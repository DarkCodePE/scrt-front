import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText, CheckCircle2, XCircle, FileSignature, Image,
    Calendar, User, Building2, FileCheck, RotateCcw,
    AlertCircle, Clock, Shield
} from 'lucide-react';
import {ValidationResults} from "@/types/document-validator";
import ValidationStatus from "@/components/document-validator/ValidationStatus";


interface DocumentAnalysisViewProps {
    results: ValidationResults;
    onReset: () => void;
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-gray-400">{label}:</span>
            </div>
            <Badge variant="secondary" className="bg-white/10 group-hover:bg-white/20">
                {value}
            </Badge>
        </div>
    </div>
);

const ValidationItem = ({ type, status, icon }: { type: string, status: boolean, icon: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-gray-400">{type}</span>
            </div>
            <Badge
                variant={status ? "outline" : "destructive"}
                className={`${
                    status
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                }`}
            >
                {status ? "Válido" : "Inválido"}
            </Badge>
        </div>
    </div>
);

export const DocumentAnalysisView: React.FC<DocumentAnalysisViewProps> = ({
                                                                              results,
                                                                              onReset
                                                                          }) => {
    const getPageData = (pageNumber: number) => ({
        pageInfo: results.pages.find(p => p.page_number === pageNumber)?.diagnostics.valid_info,
        observation: results.observations.find(o => o.page_number === pageNumber),
        validationImage: results.validation_images.find(v => v.page_num === pageNumber)
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900 text-white p-8">
            {/* Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <ValidationStatus finalVerdict={results.final_verdict} />
            </motion.div>

            {/* Content */}
            <Tabs defaultValue="page-1" className="w-full">
                <TabsList className="mb-8 p-1 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                    {Array.from({ length: results.total_pages }, (_, i) => i + 1).map((pageNum) => (
                        <TabsTrigger
                            key={pageNum}
                            value={`page-${pageNum}`}
                            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                        >
                            Página {pageNum}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Array.from({ length: results.total_pages }, (_, i) => i + 1).map((pageNum) => {
                    const pageData = getPageData(pageNum);

                    return (
                        <TabsContent key={pageNum} value={`page-${pageNum}`}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Document Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span>Información del Documento</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {pageData.pageInfo && (
                                                <div className="grid gap-4">
                                                    <InfoItem
                                                        icon={<User className="text-blue-400" />}
                                                        label="Asegurado"
                                                        value={pageData.pageInfo?.person_by_policy?.name || 'No disponible'}
                                                    />
                                                    <InfoItem
                                                        icon={<Building2 className="text-purple-400" />}
                                                        label="Empresa"
                                                        value={pageData.pageInfo.company}
                                                    />
                                                    <InfoItem
                                                        icon={<FileCheck className="text-green-400" />}
                                                        label="Póliza"
                                                        value={pageData.pageInfo.policy_number}
                                                    />
                                                    <InfoItem
                                                        icon={<Calendar className="text-pink-400" />}
                                                        label="Vigencia"
                                                        value={pageData.pageInfo.validity}
                                                    />
                                                    <InfoItem
                                                        icon={<Clock className="text-orange-400" />}
                                                        label="Fecha de Emisión"
                                                        value={pageData.pageInfo.date_of_issuance}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Validations */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-500/10">
                                                    <Shield className="w-5 h-5" />
                                                </div>
                                                <span>Validaciones</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {pageData.validationImage && pageData.observation && (
                                                <div className="space-y-6">
                                                    <ValidationItem
                                                        type="Logo"
                                                        status={pageData.validationImage.logo_status}
                                                        icon={<Image className="w-5 h-5" />}
                                                    />
                                                    <ValidationItem
                                                        type="Firma"
                                                        status={pageData.validationImage.signature_status}
                                                        icon={<FileSignature className="w-5 h-5" />}
                                                    />
                                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                                        <p className="text-sm text-gray-400">
                                                            {pageData.validationImage.diagnostics}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>

            {/* Reset Button */}
            <motion.button
                onClick={onReset}
                className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <RotateCcw className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-300" />
            </motion.button>
        </div>
    );
};

export default DocumentAnalysisView;