import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
  duration?: number;
}

interface RecipeStepsProps {
  steps: RecipeStep[];
  className?: string;
}

const RecipeSteps: React.FC<RecipeStepsProps> = ({ steps, className = '' }) => {
  const { t } = useTranslation();
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  if (!steps || steps.length === 0) {
    return null;
  }

  const openImageModal = (stepNumber: number) => {
    setSelectedStep(stepNumber);
  };

  const closeImageModal = () => {
    setSelectedStep(null);
  };

  const selectedStepData = selectedStep ? steps.find(step => step.stepNumber === selectedStep) : null;

  return (
    <div className={`recipe-steps ${className}`}>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('recipe.instructions')}
      </h3>
      
      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {/* Step Number */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {step.stepNumber}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Instruction Text */}
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.duration && (
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {step.duration} {t('common.minutes')}
                    </div>
                  )}
                </div>

                {/* Step Image */}
                {step.imageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={step.imageUrl}
                      alt={`${t('recipe.step')} ${step.stepNumber}`}
                      className="w-32 h-24 lg:w-40 lg:h-30 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openImageModal(step.stepNumber)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedStep && selectedStepData && selectedStepData.imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedStepData.imageUrl}
              alt={`${t('recipe.step')} ${selectedStepData.stepNumber}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-2">
                {t('recipe.step')} {selectedStepData.stepNumber}
              </h4>
              <p className="text-sm leading-relaxed">
                {selectedStepData.instruction}
              </p>
              {selectedStepData.duration && (
                <div className="mt-2 flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedStepData.duration} {t('common.minutes')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSteps;