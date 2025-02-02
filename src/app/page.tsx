'use client';

import { useState } from 'react';
import { DocumentUploader } from '@/components/document-validator/DocumentUploader';
import { ValidationResultsView } from '@/components/document-validator/ValidationResults';
import type { ValidationResults as ValidationResultsType } from '@/types/document-validator';

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
            <ValidationResultsView results={results} onReset={handleReset} />
        ) : (
            <DocumentUploader onValidationComplete={handleValidationComplete} />
        )}
      </div>
  );
}