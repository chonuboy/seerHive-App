"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ProfessionalForm from "@/components/Forms/candidates/addcandidatesteps/AddCandidate-4";
import Step5SocialLinks from "@/components/Forms/candidates/addcandidatesteps/AddCandidate-5";
import ProgressIndicator from "@/components/Elements/utils/progress-indicator";

interface OptionalStepsModalProps {
  candidateId: number;
  onClose: () => void;
  masterSkills: any[];
  masterCertifications: any[];
  masterCompanies: any[];
  masterLocations: any[];
  masterDomains: any[];
  masterEducations: any[];
}

export default function OptionalStepsModal({
  candidateId,
  onClose,
  masterSkills,
  masterCertifications,
  masterCompanies,
  masterLocations,
  masterDomains,
  masterEducations,
}: OptionalStepsModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = ["Preferences", "Social Links"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />
        </div>

        {/* Form Content */}
        <div className="">
          {currentStep === 1 && (
            <ProfessionalForm
              masterSkills={masterSkills}
              masterCertifications={masterCertifications}
              masterCompanies={masterCompanies}
              masterlocations={masterLocations}
              masterDomains={masterDomains}
              masterEducations={masterEducations}
            />
          )}
          {currentStep === 2 && <Step5SocialLinks />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center p-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-1 rounded-md ${
              currentStep === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            }`}
          >
            Previous
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-1 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={currentStep === totalSteps ? onClose : nextStep}
              className="px-6 py-1 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
            >
              {currentStep === totalSteps ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
