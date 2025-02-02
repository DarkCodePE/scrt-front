import React from 'react';
import { Check, X, AlertCircle, FileText, Users, Calendar, Hash } from 'lucide-react';
import {ValidationResults} from "@/types/document-validator";

interface ValidationResultsProps {
    results: ValidationResults;
    onReset: () => void;
}

export const ValidationResultsView: React.FC<ValidationResultsProps> = ({
                                                                        results,
                                                                        onReset
                                                                    }) => {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Status Card */}
            <div className={`rounded-lg shadow-lg p-6 ${
                results.final_verdict.verdict ? 'bg-green-50' : 'bg-red-50'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Validation Status</h2>
                    {results.final_verdict.verdict ? (
                        <div className="flex items-center text-green-600">
                            <Check className="w-8 h-8 mr-2" />
                            <span className="text-lg">Valid Document</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-red-600">
                            <X className="w-8 h-8 mr-2" />
                            <span className="text-lg">Invalid Document</span>
                        </div>
                    )}
                </div>
                <p className="text-gray-600">{results.final_verdict.reason}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Document Info Card */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <FileText className="w-6 h-6 mr-2" />
                        <h3 className="text-xl font-bold">Document Information</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Enterprise */}
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                                <Users className="w-5 h-5 mr-2 text-blue-500" />
                                <span className="font-medium">Enterprise:</span>
                            </div>
                            <span>{results.validation_results.valid_data.enterprise}</span>
                        </div>
                        {/* Policy Number */}
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                                <Hash className="w-5 h-5 mr-2 text-blue-500" />
                                <span className="font-medium">Policy Number:</span>
                            </div>
                            <span>{results.validation_results.valid_data.policy_number}</span>
                        </div>
                        {/* Company */}
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                                <Users className="w-5 h-5 mr-2 text-blue-500" />
                                <span className="font-medium">Company:</span>
                            </div>
                            <span>{results.validation_results.valid_data.company}</span>
                        </div>
                        {/* Validity */}
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                                <span className="font-medium">Validity:</span>
                            </div>
                            <span>{results.validation_results.valid_data.validity}</span>
                        </div>
                    </div>
                </div>

                {/* Validation Details Card */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <AlertCircle className="w-6 h-6 mr-2" />
                        <h3 className="text-xl font-bold">Validation Details</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Logo Validation */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="font-medium">Logo Validation</span>
                            {results.final_verdict.details.logo_validation_passed ? (
                                <Check className="w-6 h-6 text-green-500" />
                            ) : (
                                <X className="w-6 h-6 text-red-500" />
                            )}
                        </div>
                        {/* Document Validity */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="font-medium">Document Validity</span>
                            {results.final_verdict.details.document_validity_approved ? (
                                <Check className="w-6 h-6 text-green-500" />
                            ) : (
                                <X className="w-6 h-6 text-red-500" />
                            )}
                        </div>
                        {/* Signature Validation */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="font-medium">Signature Validation</span>
                            {results.final_verdict.details.signature_validation_passed ? (
                                <Check className="w-6 h-6 text-green-500" />
                            ) : (
                                <X className="w-6 h-6 text-red-500" />
                            )}
                        </div>
                        {/* Signature Details */}
                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-600">
                                Total Signatures Found: {results.validation_results.signatures.total_found}
                            </p>
                            <div className="text-sm text-gray-600">
                                <p className="font-medium mb-1">Signature Locations:</p>
                                {results.validation_results.signatures.details.map((detail, index) => (
                                    <div key={index} className="ml-2">
                                        Page {detail.page}: {detail.signatures_found} signature(s)
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={onReset}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
                >
                    Validate Another Document
                </button>
            </div>
        </div>
    );
};