import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    FileText,
    CheckCircle2,
    XCircle,
    FileSignature,
    Image,
    ScrollText
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PageAnalysisProps {
    pageNumber: number;
    pageData: {
        diagnostics: any;
        observation: any;
        signatures: any;
        logos: any;
    };
}

export const PageAnalysis: React.FC<PageAnalysisProps> = ({ pageNumber, pageData }) => {
    const { diagnostics, observation, signatures, logos } = pageData;

    return (
        <TabsContent value={`page-${pageNumber}`} className="space-y-6">
            {/* Información Semántica */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ScrollText className="w-5 h-5" />
                        Análisis Semántico - Página {pageNumber}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-800/50 rounded-lg">
                                <h4 className="font-medium text-gray-200 mb-2">Información del Documento</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Vigencia:</span>
                                        <span className="text-gray-200">{diagnostics.valid_info.validity}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Póliza:</span>
                                        <span className="text-gray-200">{diagnostics.valid_info.policy_number}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Empresa:</span>
                                        <span className="text-gray-200">{diagnostics.valid_info.company}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-800/50 rounded-lg">
                                <h4 className="font-medium text-gray-200 mb-2">Verificación</h4>
                                <div className="space-y-2">
                                    {Object.entries(observation.details).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                      </span>
                                            {value ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Alert className="bg-gray-800/30 border-gray-700">
                            <AlertTitle>Observación</AlertTitle>
                            <AlertDescription>
                                {observation.reason}
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>

            {/* Firmas en la Página */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSignature className="w-5 h-5" />
                        Firmas Detectadas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {signatures.map((sig: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-200">
                    Firma {index + 1}
                  </span>
                                    <Badge variant={sig.signature_status ? "outline" : "destructive"}>
                                        {sig.signature_status ? 'Válida' : 'No Válida'}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {sig.metadata.signatures_details.map((detail: any, idx: number) => (
                                        <div key={idx} className="text-sm text-gray-400">
                                            <div>Posición: ({detail.left}, {detail.top})</div>
                                            <div>Tamaño: {detail.width}x{detail.height}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Logos en la Página */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        Logos Detectados
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logos.map((logo: any, index: number) => (
                            <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-200">{logo.logo}</span>
                                    <Badge variant={logo.logo_status ? "outline" : "destructive"}>
                                        {logo.logo_status ? 'Detectado' : 'No Detectado'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-400">{logo.diagnostics}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};
