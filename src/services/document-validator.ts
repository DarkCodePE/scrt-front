import {ValidationResults} from "@/types/document-validator";

const VALIDATOR_SERVER = process.env.NEXT_PUBLIC_VALIDATOR_SERVER || 'http://localhost:9002'

export const validateDocument = async (file: File): Promise<ValidationResults> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${VALIDATOR_SERVER}/document/v2/validate`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Validation failed');
    }

    return response.json();
};