import { ValidationResults } from "@/types/document-validator";
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const VALIDATOR_SERVER = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002';

interface ValidationError {
    status_code: number;
    detail: string;
}

export const validateDocument = async (file: File, personName: string): Promise<ValidationResults> => {
    if (!file) {
        throw new Error('Se requiere un archivo PDF');
    }

    if (!personName?.trim()) {
        throw new Error('Se requiere el nombre de la persona');
    }

    if (!file.type.toLowerCase().endsWith('pdf')) {
        throw new Error('Solo se aceptan archivos PDF');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('person_name', personName.trim());

    try {
        const { data } = await axios.post<ValidationResults>(
            `${VALIDATOR_SERVER}/document/v2/validate`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                validateStatus: (status) => status === 200,
            }
        );

        return data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ValidationError>;

            if (axiosError.response) {
                const status = axiosError.response.status;
                const errorMessage = axiosError.response.data?.detail;

                if (status === 400) {
                    throw new Error(errorMessage || 'Archivo inválido o datos faltantes');
                } else if (status === 413) {
                    throw new Error('El archivo es demasiado grande');
                }

                throw new Error(errorMessage || 'Error en el proceso de validación');
            }

            if (axiosError.request) {
                throw new Error('No se pudo conectar con el servidor');
            }
        }

        if (error instanceof Error) {
            console.error('Error validando documento:', error);
            toast.error(error.message || 'Error procesando el documento');
            throw error;
        }

        throw new Error('Error inesperado al validar el documento');
    }
};

export const isValidationError = (error: unknown): error is ValidationError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status_code' in error &&
        'detail' in error
    );
};

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ValidationError>;
        return axiosError.response?.data?.detail || axiosError.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Error inesperado al validar el documento';
};