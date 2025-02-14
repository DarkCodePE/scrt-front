import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileSignature,
    Image,
    Calendar,
    User
} from 'lucide-react';

interface ValidationStatusProps {
    finalVerdict: {
        verdict: boolean;
        reason: string;
        details: {
            logo_validation_passed: boolean;
            validity_validation_passed: boolean;
            signature_validation_passed: boolean;
            person_validation_passed: boolean;
        };
    };
}

const ValidationItem = ({
                            status,
                            icon: Icon,
                            label
                        }: {
    status: boolean;
    icon: React.ElementType;
    label: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg backdrop-blur-md border ${
            status
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
        }`}
    >
        <div className="flex flex-col items-center gap-2">
            <Icon className={`w-8 h-8 ${status ? 'text-green-400' : 'text-red-400'}`} />
            <span className="font-medium">{label}</span>
            {status
                ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                : <XCircle className="w-5 h-5 text-red-400" />
            }
        </div>
    </motion.div>
);

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ finalVerdict }) => {
    return (
        <div className="space-y-8">
            {/* Veredicto Principal */}
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 mb-6"
                >
                    <div className={`p-3 rounded-full ${
                        finalVerdict.verdict
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                    }`}>
                        {finalVerdict.verdict
                            ? <CheckCircle2 className="w-12 h-12" />
                            : <XCircle className="w-12 h-12" />
                        }
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        {finalVerdict.verdict ? 'Documento Válido' : 'Documento Inválido'}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Alert className="max-w-3xl mx-auto backdrop-blur-md bg-white/5 border border-white/10">
                        <AlertCircle className="w-5 h-5" />
                        <AlertTitle className="text-lg font-semibold text-purple-400">
                            Resultado de la Validación
                        </AlertTitle>
                        <AlertDescription className="text-gray-300 mt-2">
                            {finalVerdict.reason}
                        </AlertDescription>
                    </Alert>
                </motion.div>
            </div>

            {/* Estados de Validación */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
                <ValidationItem
                    status={finalVerdict.details.logo_validation_passed}
                    icon={Image}
                    label="Logo"
                />
                <ValidationItem
                    status={finalVerdict.details.validity_validation_passed}
                    icon={Calendar}
                    label="Vigencia"
                />
                <ValidationItem
                    status={finalVerdict.details.signature_validation_passed}
                    icon={FileSignature}
                    label="Firma"
                />
                <ValidationItem
                    status={finalVerdict.details.person_validation_passed}
                    icon={User}
                    label="Persona"
                />
            </motion.div>
        </div>
    );
};

export default ValidationStatus;