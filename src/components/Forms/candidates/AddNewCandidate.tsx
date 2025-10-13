"use client";

import { Formik, Form, type FormikErrors } from "formik";
import {
  type CandidateFormData,
  nextStep,
  prevStep,
  resetCandidateForm,
  updateCandidateFormData,
} from "@/Features/candidateSlice";
import ProgressIndicator from "@/components/Elements/utils/progress-indicator";
import Step1BasicDetails from "@/components/Forms/candidates/addcandidatesteps/AddCandidate-1";
import Step2Uploads from "@/components/Forms/candidates/addcandidatesteps/AddCandidate-2";
import Step3Professional from "@/components/Forms/candidates/addcandidatesteps/AddCandidate-3";
import { useDispatch, useSelector } from "react-redux";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  Technology,
} from "@/lib/models/candidate";
import { useEffect, useState } from "react";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { fetchAllTechnologies } from "@/api/master/masterTech";
import { fetchAllDomains } from "@/api/master/domain";
import { fetchAllCertifications } from "@/api/master/certification";
import { fetchAllCompanies } from "@/api/master/masterCompany";
import { createCandidate } from "@/api/candidates/candidates";
import { toast } from "react-toastify";
import { Popup } from "@/components/Elements/cards/popup";
import { CheckCircle, X } from "lucide-react";
import OptionalStepsModal from "@/components/Forms/candidates/addcandidatesteps/OptionalStepsModal";
import { fetchAllEducations } from "@/api/candidates/education";
import CloseButton from "@/components/Elements/utils/CloseButton";

export default function AddNewCandidate({
  autoClose,
}: {
  autoClose: () => void;
}) {
  const dispatch = useDispatch();
  const { currentStep, formData } = useSelector(
    (state: any) => state.candidate
  );
  const [user, setUser] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [allTech, setAlltech] = useState<Technology[]>([]);
  const [domains, setDomains] = useState<any>();
  const [allEducations, setAllEducations] = useState<any>();
  const [certifications, setCertifications] = useState<any>();
  const [previousCompanies, setPreviousCompanies] = useState<any>();
  const [showOptionalSteps, setShowOptionalSteps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCandidateCreated, setCandidateCreated] = useState(false);
  const [createdCandidateId, setCreatedCandidateId] = useState<string | null>(
    null
  );
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user);
    fetchAllLocations().then((data) => {
      const allLocatoins = data;
      setLocations(allLocatoins);
    });
    fetchAllTechnologies().then((data) => {
      setAlltech(data);
    });
    fetchAllDomains().then((data) => {
      setDomains(data);
    });
    fetchAllCertifications().then((data) => {
      setCertifications(data);
    });
    fetchAllCompanies().then((data) => {
      setPreviousCompanies(data);
    });
    fetchAllEducations().then((data) => {
      console.log(data);
      setAllEducations(data);
    });
  }, []);

  const handleNext = async (
    validateForm: () => Promise<FormikErrors<CandidateFormData>>
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      if (currentStep < 3) {
        dispatch(nextStep());
      }
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleCancel = () => {
    dispatch(resetCandidateForm());
    autoClose();
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const data = await createCandidate(formData);

      if (data.status === 201) {
        toast.success("Candidate added successfully", {
          position: "top-center",
        });
        const contactId = data.data.contactId;
        dispatch(
          updateCandidateFormData({
            contactId: contactId,
          })
        );
        setCreatedCandidateId(contactId);
        setCandidateCreated(true);
        setShowSuccessPopup(true); // Show success popup after creation
      } else {
        toast.error(data.message || "Failed to create candidate", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Error creating candidate", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepAction = async (
    validateForm: () => Promise<FormikErrors<CandidateFormData>>,
    submitForm: () => Promise<any>
  ) => {
    if (currentStep === 3) {
      // For final step, validate and submit
      const errors = await validateForm();
      if (Object.keys(errors).length === 0 && !isSubmitting) {
        await submitForm();
      }
    } else {
      // For other steps, just validate and move forward
      await handleNext(validateForm);
    }
  };

  const handleAddAdditionalInfo = () => {
    setShowSuccessPopup(false);
    setShowOptionalSteps(true);
  };

  const handleCloseOptionalSteps = () => {
    setShowOptionalSteps(false);
    setCandidateCreated(false);
    dispatch(resetCandidateForm());
    autoClose();
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setCandidateCreated(false);
    dispatch(resetCandidateForm());
    autoClose();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails User={user ?? ""} locations={locations} />;
      case 2:
        return <Step2Uploads />;
      case 3:
        return <Step3Professional />;
      default:
        return <Step1BasicDetails User={user ?? ""} locations={locations} />;
    }
  };

  const getButtonText = () => {
    return currentStep === 3 ? "Create Candidate" : "Next";
  };

  const steps = ["Basic Details", "Uploads", "Professional"];

  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      default:
        return step1Schema;
    }
  };

  // Show success popup after candidate creation
  if (showSuccessPopup) {
    return (
      <Popup>
        <div className="bg-white p-8 mt-14 rounded-lg max-w-md mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Candidate Created Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Would you like to add additional information about preferences and
              social links?
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                type="button"
                onClick={handleAddAdditionalInfo}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Add Additional Info
              </button>
              <button
                type="button"
                onClick={handleCloseSuccessPopup}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Popup>
    );
  }

  // Show optional steps modal
  if (showOptionalSteps) {
    return (
      <OptionalStepsModal
        candidateId={createdCandidateId || formData.contactId}
        onClose={handleCloseOptionalSteps}
        masterSkills={allTech}
        masterCertifications={certifications}
        masterCompanies={previousCompanies}
        masterLocations={locations}
        masterDomains={domains}
        masterEducations={allEducations}
      />
    );
  }

  // Show main form (only when not showing success popup or optional steps)
  return (
    <Popup>
      <div className="my-4 max-h-[95vh] flex flex-col bg-white rounded-lg">
        <div className="px-8 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h3 className="text-2xl font-bold">Add New Candidate</h3>
          <div className="flex justify-end">
            <CloseButton
              onClose={handleCancel}
              hasUnsavedChanges
              confirmationMessage="Are you sure you want to cancel? The candidate information will not be saved."
            />
          </div>
        </div>

        <div className="rounded-md flex-1 overflow-y-auto">
          <Formik
            initialValues={formData}
            validationSchema={getCurrentSchema()}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({ validateForm, submitForm, errors, touched }) => (
              <Form className="p-10">
                <div className="">
                  <ProgressIndicator
                    currentStep={currentStep}
                    totalSteps={3}
                    steps={steps}
                  />

                  <div>{renderCurrentStep()}</div>

                  <div className="flex justify-end space-x-4 mt-6">
                    {currentStep === 1 ? (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors font-medium"
                      >
                        Back
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleStepAction(validateForm, submitForm)}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-cyan-500 border-2 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium disabled:bg-cyan-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creating..." : getButtonText()}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Popup>
  );
}
