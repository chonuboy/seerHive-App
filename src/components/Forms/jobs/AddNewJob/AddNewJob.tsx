import { Formik, Form, FormikErrors } from "formik";
import { ClientInfo } from "@/lib/models/client";
import {
  JobFormData,
  nextStep,
  prevStep,
  resetForm,
  updateAddJobFormData,
} from "@/Features/job-slice";
import ProgressIndicator from "@/components/Elements/utils/progress-indicator";
import Step1BasicDetails from "../Addjobsteps/Addjob-1";
import Step2Preferences from "../Addjobsteps/Addjob-2";
import Step3JobDescription from "../Addjobsteps/Addjob-3";
import { useDispatch, useSelector } from "react-redux";
import { step1Schema, step2Schema, step3Schema } from "@/lib/models/client";
import { useEffect, useState } from "react";
import { createJob } from "@/api/client/clientJob";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";

// Update the props interface
interface AddNewJobProps {
  client: ClientInfo | null;
  autoClose: () => void;
  allClients: any[]; // Add allClients prop
  onClientSelect: (client: any) => void; // Add onClientSelect prop
}

export default function AddNewJob({ 
  client, 
  autoClose, 
  allClients = [], 
  onClientSelect 
}: AddNewJobProps) {
  const dispatch = useDispatch();
  const { currentStep, formData } = useSelector((state: any) => state.job);
  const [user, setUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(client);
  
  const steps = [
    "Basic Details",
    "Preferences",
    "Job Description",
    "Miscellaneous",
  ];

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user);
    
    // If a client is passed as prop, set it in the form data
    if (client) {
      dispatch(
        updateAddJobFormData({
          client: {
            clientId: client?.clientId,
          },
        })
      );
    }
  }, [client, dispatch]);

  const handleClientSelect = (client: ClientInfo) => {
    setSelectedClient(client);
    setShowClientDropdown(false);
    onClientSelect(client);
    
    // Update form data with selected client
    dispatch(
      updateAddJobFormData({
        client: {
          clientId: client.clientId,
        },
      })
    );
  };

  const handleNext = async (
    validateForm: () => Promise<FormikErrors<JobFormData>>
  ) => {
    // Validate that a client is selected before proceeding
    if (!formData.client?.clientId) {
      toast.error("Please select a client before proceeding", {
        position: "top-right",
      });
      return;
    }

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
    
    // Validate client is selected
    if (!formData.client?.clientId) {
      toast.error("Please select a client", {
        position: "top-right",
      });
      setIsSubmitting(false);
      return;
    }

    console.log("Form submitted:", values);
    
    await createJob(values).then((data) => {
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
    }).catch((error) => {
      console.error("Form submission error", error);
      toast.error("Failed to add job", {
        position: "top-right",
      });
    }).finally(() => {
      setIsSubmitting(false);
    });
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
          {({ validateForm, submitForm, errors, touched, isSubmitting: formikSubmitting }) => (
            <Form>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">
                  Add New Job
                </h1>

                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={3}
                  steps={steps}
                />

                {/* Client Selection Dropdown */}
                <div className="mb-6">
                  <label className="block font-semibold text-gray-700 mb-2">
                    Select Client <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowClientDropdown(!showClientDropdown)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-cyan-500 transition-colors text-left"
                    >
                      <span className={selectedClient ? "text-gray-800" : "text-gray-500"}>
                        {selectedClient ? selectedClient.clientName : "Select a client"}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showClientDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showClientDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {allClients.length > 0 ? (
                          allClients.map((clientItem) => (
                            <button
                              key={clientItem.clientId}
                              type="button"
                              onClick={() => handleClientSelect(clientItem)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-800">{clientItem.clientName}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No clients available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!formData.client?.clientId && currentStep >= 1 && (
                    <div className="flex items-center mt-2 text-center gap-1 text-red-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Please select a client to continue</span>
                    </div>
                  )}
                </div>

                <div className="mb-12">
                  {renderCurrentStep()}
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
                    disabled={!formData.client?.clientId || formikSubmitting || isSubmitting}
                    className="px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formikSubmitting || isSubmitting ? "Submitting..." : getButtonText()}
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