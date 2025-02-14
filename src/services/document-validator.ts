import { ValidationResults } from "@/types/document-validator";
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const VALIDATOR_SERVER = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002';

/**
 * Creamos una instancia de Axios configurada con la URL base del servicio.
 * Esto nos permite centralizar la configuración y mantener el código desacoplado.
 */
const validatorApi = axios.create({
    baseURL: VALIDATOR_SERVER,
});

interface ValidationError {
    status_code: number;
    detail: string;
}

/**
 * Valida un documento PDF enviándolo al servicio de validación.
 *
 * @param file - Archivo a validar.
 * @param personName - Nombre de la persona asociada al documento.
 * @returns Una promesa que resuelve en los resultados de la validación.
 * @throws Error con mensaje detallado en caso de fallo.
 */
export const validateDocument = async (file: File, personName: string): Promise<ValidationResults> => {
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

    // Construir el FormData para enviar el archivo y el nombre
    const formData = new FormData();
    formData.append('file', file);
    formData.append('person_name', personName.trim());

    try {
        // Se utiliza la instancia de axios para enviar el POST.
        const response = await validatorApi.post('/document/v2/validate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Se asume que la respuesta cumple con el contrato de ValidationResults.
        return response.data as ValidationResults;

    } catch (error) {
        let errorMessage = 'Error inesperado al validar el documento';

        if (axios.isAxiosError(error)) {
            if (error.response) {
                const { status, data } = error.response;
                // Se intenta extraer un mensaje detallado del servidor.
                if (data && data.detail) {
                    errorMessage = data.detail;
                } else {
                    // Mensajes de error por defecto según el código de estado.
                    if (status === 400) {
                        errorMessage = 'Archivo inválido o datos faltantes';
                    } else if (status === 413) {
                        errorMessage = 'El archivo es demasiado grande';
                    } else {
                        errorMessage = 'Error en el proceso de validación';
                    }
                }
            } else {
                errorMessage = error.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error('Error validando documento:', error);
        toast.error(errorMessage);

        throw new Error(errorMessage);
    }
};

/**
 * Helper para verificar si un error es del tipo ValidationError.
 *
 * @param error - Error a evaluar.
 * @returns true si el error tiene la estructura de ValidationError.
 */
export const isValidationError = (error: unknown): error is ValidationError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status_code' in error &&
        'detail' in error
    );
};

/**
 * Extrae el mensaje de error más relevante a partir del error recibido.
 *
 * @param error - Error del que extraer el mensaje.
 * @returns Mensaje de error descriptivo.
 */
export const getErrorMessage = (error: unknown): string => {
    if (isValidationError(error)) {
        return error.detail;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Error inesperado al validar el documento';
};
