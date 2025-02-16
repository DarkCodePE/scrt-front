import React, { useState } from 'react';
import {Upload, File, Loader2, CloudOff, User, Calendar} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { validateDocument } from '@/services/document-validator';
import { ValidationResults } from '@/types/document-validator';

// Definir las variantes de animación
const formVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    }
};

const inputVariants = {
    hidden: {
        opacity: 0,
        x: -20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const buttonVariants = {
    initial: {
        scale: 1,
        boxShadow: "0 0 0 rgba(59, 130, 246, 0)"
    },
    hover: {
        scale: 1.02,
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
    },
    tap: {
        scale: 0.98,
        boxShadow: "0 0 0 rgba(59, 130, 246, 0)"
    },
    disabled: {
        scale: 1,
        opacity: 0.7
    }
};

interface ModernDocumentUploaderProps {
    onValidationComplete: (results: ValidationResults) => void;
    maxFileSize?: number;
}

const ModernDocumentUploader: React.FC<ModernDocumentUploaderProps> = ({
                                                                           onValidationComplete,
                                                                           maxFileSize = 10 * 1024 * 1024
                                                                       }) => {
    const [file, setFile] = useState<File | null>(null);
    const [personName, setPersonName] = useState('');
    const [referenceDate, setReferenceDate] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = (file: File): boolean => {
        if (file.type !== 'application/pdf') {
            setError('Solo se permiten archivos PDF');
            return false;
        }
        if (file.size > maxFileSize) {
            setError(`El archivo excede el tamaño máximo permitido de ${maxFileSize / (1024 * 1024)}MB`);
            return false;
        }
        return true;
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && validateFile(droppedFile)) {
            setFile(droppedFile);
            setError(null);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file || !personName.trim()) {
            setError('Por favor proporciona un archivo PDF y el nombre de la persona');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('person_name', personName.trim());
        if (referenceDate) {
            formData.append('user_date', referenceDate);
        }

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        try {
            // @ts-ignore
            const results = await validateDocument(file, personName, referenceDate);
            clearInterval(progressInterval);
            setUploadProgress(100);
            onValidationComplete(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
        } finally {
            setIsUploading(false);
            clearInterval(progressInterval);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 shadow-2xl"
            >
                <motion.h2
                    variants={inputVariants}
                    className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]"
                >
                    Validador de Documentos
                </motion.h2>

                {/* Campo de Nombre */}
                <motion.div
                    variants={inputVariants}
                    className="mb-6"
                >
                    <label htmlFor="person-name" className="block text-gray-300 mb-2">
                        Nombre de la Persona
                    </label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-hover:text-blue-400"/>
                        <input
                            id="person-name"
                            type="text"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            className="w-full bg-gray-800 text-gray-100 rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all group-hover:border-blue-400/50"
                            placeholder="Ingresa el nombre de la persona"
                            required
                        />
                    </div>
                </motion.div>

                {/* Campo de Fecha */}
                <motion.div
                    variants={inputVariants}
                    className="mb-6"
                >
                    <label htmlFor="reference-date" className="block text-gray-300 mb-2">
                        Fecha de Referencia (Opcional)
                    </label>
                    <div className="relative group">
                        <Calendar className="absolute
                        left-3 top-1/2 transform
                        -translate-y-1/2 text-gray-400
                        w-5 h-5 transition-colors
                        group-hover:text-blue-400" />
                        <input
                            id="reference-date"
                            type="date"
                            value={referenceDate}
                            onChange={(e) => setReferenceDate(e.target.value)}
                            className="w-full bg-gray-800 text-gray-100 rounded-lg pl-12 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all group-hover:border-blue-400/50"
                        />
                    </div>
                </motion.div>

                {/* Área de Carga */}
                <motion.div
                    variants={inputVariants}
                    onDragEnter={handleDragEnter}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
                        isDragging
                            ? 'border-blue-400 bg-blue-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                    }`}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="mb-4"
                        >
                            {file ? (
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <File className="w-16 h-16 text-blue-400"/>
                                </motion.div>
                            ) : (
                                <Upload className="w-16 h-16 text-gray-400"/>
                            )}
                        </motion.div>
                        <span className="text-gray-300 text-center">
                            {file
                                ? file.name
                                : 'Arrastra tu PDF aquí o haz clic para seleccionar'}
                        </span>
                        <span className="text-gray-400 text-sm mt-2">
                            Tamaño máximo: {maxFileSize / (1024 * 1024)}MB
                        </span>
                    </label>
                </motion.div>

                {/* Mensajes de Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                        >
                            <div className="flex items-center gap-2 text-red-400">
                                <CloudOff className="w-5 h-5"/>
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Barra de Progreso */}
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 space-y-4"
                    >
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${uploadProgress}%`,
                                    transition: { duration: 0.3, ease: "easeInOut" }
                                }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                        </div>
                        <div className="flex items-center justify-center text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin mr-2"/>
                            <span>Procesando documento... {uploadProgress}%</span>
                        </div>
                    </motion.div>
                )}

                {/* Botón de Envío */}
                <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    animate={(!file || !personName.trim() || isUploading) ? "disabled" : "initial"}
                    disabled={!file || !personName.trim() || isUploading}
                    onClick={handleUpload}
                    className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors relative overflow-hidden ${
                        !file || !personName.trim() || isUploading
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}
                >
                    {isUploading ? 'Procesando...' : 'Validar Documento'}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear"
                        }}
                    />
                </motion.button>
            </motion.div>
        </div>
    );
};

export default ModernDocumentUploader;