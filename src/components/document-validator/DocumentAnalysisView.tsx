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
    Calendar,
    User,
    Building2,
    FileCheck,
    RotateCcw
} from 'lucide-react';
import { ValidationResults } from "@/types/document-validator";
import { Badge } from "@/components/ui/badge";

interface DocumentAnalysisViewProps {
    results: ValidationResults;
    onReset: () => void;
}

export const DocumentAnalysisView: React.FC<DocumentAnalysisViewProps> = ({
                                                                              results,
                                                                              onReset
                                                                          }) => {
    const getPageData = (pageNumber: number) => {
        return {
            pageInfo: results.pages.find(p => p.page_number === pageNumber)?.diagnostics.valid_info,
            observation: results.observations.find(o => o.page_number === pageNumber),
            validationImage: results.validation_images.find(v => v.page_num === pageNumber)
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

                {Array.from({ length: results.total_pages }, (_, i) => i + 1).map((pageNum) => {
                    const pageData = getPageData(pageNum);

                    return (
                        <TabsContent key={pageNum} value={`page-${pageNum}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información General */}
                                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Información del Documento
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {pageData.pageInfo && (
                                            <>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                                                    <div className="flex items-center gap-2">
                                                        <User className="text-blue-400" />
                                                        <span>Asegurado:</span>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {pageData.pageInfo.person_by_policy.name}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="text-purple-400" />
                                                        <span>Empresa:</span>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {pageData.pageInfo.company}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                                                    <div className="flex items-center gap-2">
                                                        <FileCheck className="text-green-400" />
                                                        <span>Póliza:</span>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {pageData.pageInfo.policy_number}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="text-orange-400" />
                                                        <span>Vigencia:</span>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {pageData.pageInfo.validity}
                                                    </Badge>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Validaciones */}
                                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileSignature className="w-5 h-5" />
                                            Validaciones
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {pageData.observation && pageData.validationImage && (
                                            <>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                                                    <span>Logo</span>
                                                    <Badge variant={pageData.validationImage.logo_status ? "outline" : "destructive"}>
                                                        {pageData.validationImage.logo_status ? "Válido" : "Inválido"}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                                                    <span>Firma</span>
                                                    <Badge variant={pageData.validationImage.signature_status ? "outline" : "destructive"}>
                                                        {pageData.validationImage.signature_status ? "Válida" : "Inválida"}
                                                    </Badge>
                                                </div>

                                                <div className="p-3 rounded-lg bg-gray-800/50">
                                                    <p className="text-sm text-gray-300">
                                                        {pageData.validationImage.diagnostics}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    );
                })}
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

            {/* Botón de Reset */}
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