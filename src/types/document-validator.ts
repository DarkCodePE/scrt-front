export interface ValidationResults {
    validation_results: {
        valid_data: {
            validity: string;
            enterprise: string;
            policy_number: string;
            company: string;
            date_of_issuance: string;
        };
        signatures: {
            total_found: number;
            details: Array<{
                page: number;
                signatures_found: number;
                locations: Array<{
                    left: number;
                    top: number;
                    width: number;
                    height: number;
                }>;
            }>;
        };
        logos: Array<{
            found: boolean;
            logo: string;
            diagnostics: string;
        }>;
    };
    final_verdict: {
        verdict: boolean;
        reason: string;
        details: {
            logo_validation_passed: boolean;
            document_validity_approved: boolean;
            signature_validation_passed: boolean;
        };
    };
    status: string;
    message: string;
}