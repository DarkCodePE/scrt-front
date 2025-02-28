import { ValidationResults } from "@/types/document-validator";
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const VALIDATOR_SERVER = process.env.NEXT_PUBLIC_VALIDATOR_SERVER || 'http://localhost:9000';

/**
 * Creamos una instancia de Axios configurada con la URL base del servicio.
 */
const validatorApi = axios.create({
    baseURL: VALIDATOR_SERVER,
});

interface ValidationError {
    status_code: number;
    detail: string;
}

const formatDate = (date: string): string => {
    if (!date) return '';
    // Convertir YYYY-MM-DD a DD/MM/YYYY
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

/**
 * Valida un documento PDF enviándolo al servicio de validación.
 *
 * @param file - Archivo a validar.
 * @param personName - Nombre de la persona asociada al documento.
 * @param referenceDate - Fecha de referencia opcional para la validación.
 * @returns Una promesa que resuelve en los resultados de la validación.
 * @throws Error con mensaje detallado en caso de fallo.
 */
export const validateDocument = async (
    file: File,
    personName: string,
    referenceDate?: string
): Promise<ValidationResults> => {
    // Validaciones previas
    if (!file) {
        throw new Error('Se requiere un archivo PDF');
    }

    if (!personName?.trim()) {
        throw new Error('Se requiere el nombre de la persona');
    }

    if (!file.type.toLowerCase().endsWith('pdf')) {
        throw new Error('Solo se aceptan archivos PDF');
    }

    // Construir el FormData para enviar el archivo y datos adicionales
    const formData = new FormData();
    formData.append('file', file);
    formData.append('person_name', personName.trim());

    // Agregar fecha de referencia si está presente
    if (referenceDate && referenceDate.trim()) {
        formData.append('user_date', formatDate(referenceDate) );
    }

    try {
        // Realizar la petición POST con axios
        const response = await validatorApi.post<ValidationResults>('/document/v2/validate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 12000000, // 30 segundos de timeout
        });

        return response.data;

    } catch (error) {
        let errorMessage = 'Error inesperado al validar el documento';

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ValidationError>;

            // Manejar timeout
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'La solicitud ha excedido el tiempo límite. Por favor, inténtelo de nuevo.';
            } else if (axiosError.response) {
                const { status, data } = axiosError.response;

                // Intentar extraer mensaje detallado del servidor
                if (data?.detail) {
                    errorMessage = data.detail;
                } else {
                    // Mensajes por defecto según código de estado
                    switch (status) {
                        case 400:
                            errorMessage = 'Archivo inválido o datos faltantes';
                            break;
                        case 413:
                            errorMessage = 'El archivo es demasiado grande';
                            break;
                        case 401:
                            errorMessage = 'No autorizado para realizar esta operación';
                            break;
                        case 403:
                            errorMessage = 'Acceso denegado';
                            break;
                        case 404:
                            errorMessage = 'Servicio no encontrado';
                            break;
                        case 500:
                            errorMessage = 'Error interno del servidor';
                            break;
                        default:
                            errorMessage = 'Error en el proceso de validación';
                    }
                }
            } else if (axiosError.request) {
                errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        // Log del error para debugging
        console.error('[Document Validator Error]:', error);
        toast.error(errorMessage);

        throw new Error(errorMessage);
    }
};

/**
 * Type guard mejorado para ValidationError
 */
export const isValidationError = (error: unknown): error is ValidationError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status_code' in error &&
        typeof (error as ValidationError).status_code === 'number' &&
        'detail' in error &&
        typeof (error as ValidationError).detail === 'string'
    );
};

/**
 * Función helper mejorada para extraer mensajes de error
 */
export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ValidationError>;

        // Verificar si hay un mensaje de error personalizado en la respuesta
        if (axiosError.response?.data && isValidationError(axiosError.response.data)) {
            return axiosError.response.data.detail;
        }

        // Manejar errores de red
        if (error.code === 'ECONNABORTED') {
            return 'La conexión ha excedido el tiempo límite';
        }
        if (!axiosError.response) {
            return 'Error de conexión con el servidor';
        }

        return axiosError.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Error inesperado al validar el documento';
};