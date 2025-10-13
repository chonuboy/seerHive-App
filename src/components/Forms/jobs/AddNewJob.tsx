import { Formik, Form, FormikErrors } from "formik";
import { ClientInfo, jobFormSchema } from "@/lib/models/client";
import {
  JobFormData,
  nextStep,
  prevStep,
  resetForm,
  updateAddJobFormData,
} from "@/Features/job-slice";
import ProgressIndicator from "@/components/Elements/utils/progress-indicator";
import Step1BasicDetails from "./Addjobsteps/Addjob-1";
import Step2Preferences from "./Addjobsteps/Addjob-2";
import Step3JobDescription from "./Addjobsteps/Addjob-3";
import { useDispatch, useSelector } from "react-redux";
import { step1Schema, step2Schema, step3Schema } from "@/lib/models/client";
import { useEffect, useState } from "react";
import { createJob } from "@/api/client/clientJob";
import { toast } from "react-toastify";
import CloseButton from "@/components/Elements/utils/CloseButton";

export default function AddNewJob({
  client,
  autoClose,
}: {
  client: ClientInfo | null;
  autoClose: () => void;
}) {
  const dispatch = useDispatch();
  const { currentStep, formData } = useSelector((state: any) => state.job);
  const [user, setUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const steps = [
    "Basic Details",
    "Preferences",
    "Job Description",
    "Miscellaneous",
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user);
  }, []);

  const handleNext = async (
    validateForm: () => Promise<FormikErrors<JobFormData>>
  ) => {
    // Only validate current step's fields
    const errors = await validateForm();

    console.log(errors);
    console.log(formData);
    if (Object.keys(errors).length === 0) {
      if (currentStep < 3) {
        // Move to the next step
        dispatch(nextStep());
      }
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleCancel = () => {
    dispatch(resetForm());
    autoClose();
  };

  const handleSubmit = async (values: any) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    console.log(client);
    dispatch(
      updateAddJobFormData({
        client: {
          clientId: client?.clientId,
        },
      })
    );
    console.log("Form submitted:", values);
    if (formData.client.clientId) {
      await createJob(values)
        .then((data) => {
          console.log(data);
          if (data.status === 201) {
            toast.success("Job added successfully", {
              position: "top-right",
            });
            autoClose();
            dispatch(resetForm());
          } else {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        })
        .catch((error) => {
          console.error("Form submission error", error);
          toast.error("Failed to add job", {
            position: "top-right",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setIsSubmitting(false);
      toast.error("Client information is missing", {
        position: "top-right",
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicDetails />;
      case 2:
        return <Step2Preferences />;
      case 3:
        return <Step3JobDescription />;
      default:
        return <Step1BasicDetails />;
    }
  };

  const getButtonText = () => {
    return currentStep === 3 ? "Add Job" : "Next";
  };

  const handlePrimaryAction = async (
    validateForm: () => Promise<FormikErrors<JobFormData>>,
    submitForm: () => Promise<void>
  ) => {
    if (currentStep === 3) {
      // For step 3, only validate and then let Formik handle the submission
      const errors = await validateForm();
      if (Object.keys(errors).length === 0) {
        await submitForm();
      }
    } else {
      // For steps 1 and 2, just validate and move to next step
      await handleNext(validateForm);
    }
  };

  return (
    <div className="min-h-screen my-8">
      <div className="max-w-4xl mx-auto px-4">
        <Formik
          initialValues={formData}
          validationSchema={
            currentStep === 1
              ? step1Schema
              : currentStep === 2
              ? step2Schema
              : step3Schema
          }
          onSubmit={handleSubmit}
          enableReinitialize={true}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({
            validateForm,
            submitForm,
            errors,
            touched,
            isSubmitting: formikSubmitting,
          }) => (
            <Form>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Add New Job
                  </h1>
                  <CloseButton
                    onClose={handleCancel}
                    hasUnsavedChanges
                    confirmationMessage="Are you sure you want to cancel? The candidate information will not be saved."
                  />
                </div>

                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={3}
                  steps={steps}
                />

                <div className="mb-12">
                  {renderCurrentStep()}
                  {/* Display step-specific errors */}
                  {Object.keys(errors).some((key) => touched[key]) && (
                    <div className="mt-4 text-red-500">
                      Please fix the validation errors before proceeding
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  {currentStep === 1 ? (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors font-medium"
                    >
                      Back
                    </button>
                  )}

                  <button
                    type={currentStep === 3 ? "submit" : "button"}
                    onClick={(e) => {
                      if (currentStep === 3) {
                        // For step 3, let Formik handle the submission
                        // We'll validate in the handlePrimaryAction
                        e.preventDefault(); // Prevent default form submission
                        handlePrimaryAction(validateForm, submitForm);
                      } else {
                        // For steps 1 and 2, use the click handler
                        e.preventDefault();
                        handlePrimaryAction(validateForm, submitForm);
                      }
                    }}
                    // disabled={formikSubmitting || isSubmitting}
                    className="px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formikSubmitting || isSubmitting
                      ? "Submitting..."
                      : getButtonText()}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
