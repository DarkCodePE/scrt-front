export interface ValidationResults {
    total_pages: number;
    pages: Array<{
        page_number: number;
        diagnostics: {
            valid_info: {
                validity: string;
                start_date_validity: string;
                end_date_validity: string;
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
            policy_validation_passed: boolean;
            validity_validation_passed: boolean;
            person_validation_passed: boolean;
        };
    }>;
    validation_images: Array<{
        logo: string;
        logo_status: boolean;
        diagnostics: string;
        signature_status: boolean;
        page_num: number;
    }>;
    final_verdict: {
        verdict: string;
        reason: string;
        details: {
            logo_validation_passed: boolean;
            validity_validation_passed: boolean;
            signature_validation_passed: boolean;
            person_validation_passed: boolean;
        };
    };
}