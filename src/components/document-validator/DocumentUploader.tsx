import React, { useState } from 'react';
import { Upload, File, Loader2 } from 'lucide-react';
import {ValidationResults} from "@/types/document-validator";
import {validateDocument} from "@/services/document-validator";

interface DocumentUploaderProps {
    onValidationComplete: (results: ValidationResults) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
                                                                      onValidationComplete
                                                                  }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Por favor selecciona un archivo PDF');
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const results = await validateDocument(file);

            clearInterval(progressInterval);
            setUploadProgress(100);

            onValidationComplete(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="text-2xl font-bold text-center mb-6">
                Document Validation
            </div>

            <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                    >
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <span className="text-sm text-gray-600">
              Drop your PDF here or click to browse
            </span>
                    </label>
                </div>

                {/* Selected File */}
                {file && (
                    <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded">
                        <File className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-blue-700">{file.name}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                        {error}
                    </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            <span className="text-sm text-gray-600">
                Processing document...
              </span>
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                        !file || isUploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 transition-colors'
                    }`}
                >
                    {isUploading ? 'Processing...' : 'Validate Document'}
                </button>
            </div>
        </div>
    );
};