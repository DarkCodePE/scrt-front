'use client';

import { useState } from 'react';
import type { ValidationResults as ValidationResultsType } from '@/types/document-validator';
import ModernDocumentUploader from "@/components/document-validator/ModernDocumentUploader";
import {DocumentAnalysisView} from "@/components/document-validator/DocumentAnalysisView";

export default function DocumentValidatorPage() {
  const [results, setResults] = useState<ValidationResultsType | null>(null);

  const handleValidationComplete = (newResults: ValidationResultsType) => {
    setResults(newResults);
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        {results ? (
            <DocumentAnalysisView results={results} onReset={handleReset} />
        ) : (
            <ModernDocumentUploader onValidationComplete={handleValidationComplete} />
        )}
      </div>
  );
}