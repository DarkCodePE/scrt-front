import React from 'react';
import { motion } from 'framer-motion';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    CheckCircle2,
    XCircle,
    FileSignature,
    Image,
    ScrollText, RotateCcw
} from 'lucide-react';
import {ValidationResults} from "@/types/document-validator";
interface DocumentAnalysisViewProps {
    results: ValidationResults;
    onReset: () => void;  // Esta prop es necesaria
}

function PageAnalysis(props: {
    pageNumber: number,
    pageData: {
        diagnostics: {
            valid_info: {
                validity: string;
                company: string;
                policy_number: string;
                date_of_issuance: string;
                person_by_policy: { name: string; policy_number: string; company: string }
            }
        } | {};
        observation: {
            page_number: number;
            verdict: boolean;
            reason: string;
            details: {
                validity_validation_passed: boolean;
                policy_validation_passed: boolean;
                person_validation_passed: boolean
            }
        } | {};
        logos: { logo: string; logo_status: boolean; diagnostics: string; page_num: number }[];
        signatures: {
            signature: string;
            signature_status: boolean;
            metadata: {
                page_number: number;
                signatures_found: number;
                signatures_details: Array<{ left: number; top: number; width: number; height: number }>
            }
        }[]
    }
}) {
    return null;
}

export const DocumentAnalysisView: React.FC<DocumentAnalysisViewProps> = ({
                                                                              results,
                                                                              onReset  // La recibimos como prop
                                                                          }) => {
    const getPageData = (pageNumber: number) => {
        return {
            diagnostics: results.pages.find(p => p.page_number === pageNumber)?.diagnostics || {},
            observation: results.observations.find(o => o.page_number === pageNumber) || {},
            signatures: results.signatures.filter(s => s.metadata.page_number === pageNumber) || [],
            logos: results.logo.filter(l => l.page_num === pageNumber) || []
        };
    };

    return (
        <div className="w-full space-y-6">
            <Tabs defaultValue="page-1" className="w-full">
                <TabsList className="mb-4">
                    {Array.from({ length: results.total_pages }, (_, i) => i + 1).map((pageNum) => (
                        <TabsTrigger key={pageNum} value={`page-${pageNum}`}>
                            Página {pageNum}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Array.from({ length: results.total_pages }, (_, i) => i + 1).map((pageNum) => (
                    <PageAnalysis
                        key={pageNum}
                        pageNumber={pageNum}
                        pageData={getPageData(pageNum)}
                    />
                ))}
            </Tabs>

            {/* Veredicto Final */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Veredicto Final
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                {results.final_verdict.verdict ? (
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-500" />
                                )}
                                <span className="text-xl font-medium">
                  {results.final_verdict.verdict ? 'Documento Válido' : 'Documento Inválido'}
                </span>
                            </div>
                            <p className="text-gray-300">{results.final_verdict.reason}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            {/* Agregamos un botón de reset */}
            <motion.button
                onClick={onReset}
                className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <RotateCcw className="w-6 h-6 text-white" />
            </motion.button>
        </div>
    );
};