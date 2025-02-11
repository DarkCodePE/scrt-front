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

    // Validar tipo de archivo
    if (!file.type.toLowerCase().endsWith('pdf')) {
        throw new Error('Solo se aceptan archivos PDF');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('person_name', personName.trim());

    try {
        const response = await fetch(`${VALIDATOR_SERVER}/document/v2/validate`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            // Intentar obtener el mensaje de error detallado
            try {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en la validación');
            } catch {
                // Si no podemos parsear el error, usar mensaje genérico
                if (response.status === 400) {
                    throw new Error('Archivo inválido o datos faltantes');
                } else if (response.status === 413) {
                    throw new Error('El archivo es demasiado grande');
                } else {
                    throw new Error('Error en el proceso de validación');
                }
            }
        }

        return await response.json();

    } catch (error) {
        // Manejar errores específicos
        if (error instanceof Error) {
            console.error('Error validando documento:', error);

            // Mostrar notificación de error
            toast.error(error.message || 'Error procesando el documento');

            throw error;
        }

        // Error desconocido
        throw new Error('Error inesperado al validar el documento');
    }
};

// Helper para verificar si un error es del tipo ValidationError
export const isValidationError = (error: unknown): error is ValidationError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status_code' in error &&
        'detail' in error
    );
};

// Función helper para extraer el mensaje de error más relevante
export const getErrorMessage = (error: unknown): string => {
    if (isValidationError(error)) {
        return error.detail;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Error inesperado al validar el documento';
};