export interface ValidationResults {
    total_pages: number;
    pages: Array<{
        page_number: number;
        diagnostics: {
            valid_info: {
                validity: string;
                company: string;
                policy_number: string;
                date_of_issuance: string;
                person_by_policy: {
                    name: string;
                    policy_number: string;
                    company: string;
                };
            };
        };
    }>;
    observations: Array<{
        page_number: number;
        verdict: boolean;
        reason: string;
        details: {
            validity_validation_passed: boolean;
            policy_validation_passed: boolean;
            person_validation_passed: boolean;
        };
    }>;
    signatures: Array<{
        signature: string;
        signature_status: boolean;
        metadata: {
            page_number: number;
            signatures_found: number;
            signatures_details: Array<{
                left: number;
                top: number;
                width: number;
                height: number;
            }>;
        };
    }>;
    logo: Array<{
        logo: string;
        logo_status: boolean;
        diagnostics: string;
        page_num: number;
    }>;
    final_verdict: {
        verdict: boolean;
        reason: string;
        details: {
            logo_validation_passed: boolean;
            signature_validation_passed: boolean;
            document_validity_approved: boolean;
            person_validation_passed: boolean;
        };
    };
}