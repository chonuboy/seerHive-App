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
import Step4Preferences from "@/components/Forms/candidates/addcandidatesteps/AddCandidate-4";
import Step5SocialLinks from "@/components/Forms/candidates/addcandidatesteps/AddCandidate-5";
import { useDispatch, useSelector } from "react-redux";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  Technology,
} from "@/lib/models/candidate";
import { useEffect, useState } from "react";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { fetchAllTechnologies } from "@/api/master/masterTech";
import { fetchAllDomains } from "@/api/master/domain";
import { fetchAllCertifications } from "@/api/master/certification";
import { fetchAllCompanies } from "@/api/master/masterCompany";
import { createCandidate } from "@/api/candidates/candidates";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Popup } from "@/components/Elements/cards/popup";

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
  const [certifications, setCertifications] = useState<any>();
  const [previousCompanies, setPreviousCompanies] = useState<any>();
  const [assignInterview, setAssignInterview] = useState<number | null>(null);
  const router = useRouter();

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
    const interiewJobId = localStorage.getItem("jobId");
    setAssignInterview(interiewJobId ? JSON.parse(interiewJobId) : null);
  }, []);

  const handleNext = async (
    validateForm: () => Promise<FormikErrors<CandidateFormData>>
  ) => {
    // Only validate current step's fields
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      if (currentStep < 5) {
        // Move to the next step
        dispatch(nextStep());
      } else {
        // Submit the form
        handleSubmit(formData);
      }
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleCancel = () => {
    dispatch(resetCandidateForm());
  };

  const handleSubmit = (values: any) => {
    toast.success("Candidate added successfully", {
      position: "top-right",
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails User={user ?? ""} locations={locations} />;
      case 2:
        return <Step2Uploads />;
      case 3:
        return <Step3Professional />;
      case 4:
        return (
          <Step4Preferences
            masterlocations={locations}
            masterSkills={allTech}
            masterCompanies={previousCompanies}
            masterDomains={domains}
            masterCertifications={certifications}
          />
        );
      case 5:
        return <Step5SocialLinks />;
      default:
        return <Step1BasicDetails User={user ?? ""} locations={locations} />;
    }
  };

  const getButtonText = () => {
    return currentStep === 5 ? "Add Candidate" : "Next";
  };

  const steps = [
    "Basic Details",
    "Uploads",
    "Professional",
    "Preferences",
    "Social Links",
  ];

  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1:
        return step1Schema;
      case 2:
        return step2Schema;
      case 3:
        return step3Schema;
      case 4:
        return step4Schema;
      case 5:
        return step5Schema;
      default:
        return step1Schema;
    }
  };

  const handlePrimaryAction = async (
    validateForm: () => any,
    submitForm: () => Promise<void>
  ) => {
    if (currentStep === 4) {
      await submitForm();

      // Now create the candidate
      const data:any = await createCandidate(formData);
      console.log(data);
      if (data.status === 201) {
        toast.success("Candidate added successfully", {
          position: "top-center",
        });
        await handleNext(validateForm);
        dispatch(updateCandidateFormData({ contactId: data.data.contactId }));
      }
      if (data.message) {
        toast.error(data.message, {
          position: "top-center",
        });
      }
    } else {
      handleNext(validateForm);
    }
  };

  return (
    <Popup onClose={handleCancel}>
      <div className="rounded-md">
        <div className="">
          <Formik
            initialValues={formData}
            validationSchema={getCurrentSchema()}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ validateForm, submitForm, errors, touched }) => (
              <Form className="bg-white p-10 rounded-md">
                <div className="">
                  <ProgressIndicator
                    currentStep={currentStep}
                    totalSteps={5}
                    steps={steps}
                  />

                  <div>
                    {renderCurrentStep()}
                    {/* Display step-specific errors */}
                    {Object.keys(errors).some((key) => touched[key]) && (
                      <div className="flex mt-4 items-center text-center gap-1 text-red-600 font-medium">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Please Fix The Errors Before Proceed</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
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
                      type={currentStep === 3 ? "submit" : "button"}
                      onClick={() =>
                        handlePrimaryAction(validateForm, submitForm)
                      }
                      className="px-6 py-2 bg-cyan-500 border-2 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
                    >
                      {getButtonText()}
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
