import { useFormik } from "formik";
import { candidateGridUpdateSchema } from "@/lib/models/candidate";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react"; // or any other modal library
import { updateCandidate } from "@/api/candidates/candidates";
import { useState } from "react";
import LocationAutocomplete from "@/components/Elements/utils/location-autocomplete";
import { Location } from "@/lib/definitions";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import CancelButton from "@/components/Elements/utils/CancelButton";
const CandidateGridUpdate = ({
  initialValues,
  id,
  autoClose,
  masterLocations,
  onClose,
}: {
  initialValues: any;
  id: number;
  autoClose: () => void;
  masterLocations: any;
  onClose: () => void;
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);
  const [modes, setModes] = useState<any>([]);

  const onChangeLocation = (location: Location) => {
    formik.setFieldValue("currentLocation", {
      locationId: location.locationId,
    });
  };

  const addNewLocation = async (location: Location) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik.setFieldValue("currentLocation", {
      locationId: location.locationId,
    });
  };

  const handleStatusChange = (value: boolean) => {
    if (value === false) {
      // For inactive, show confirmation
      setPendingValue(false);
      setShowConfirmation(true);
    } else {
      // For active, update directly
      formik.setFieldValue("isActive", true);
    }
  };

  const confirmInactive = () => {
    formik.setFieldValue("isActive", false);
    setShowConfirmation(false);
  };

  const getUpdatedFields = (initialValues: any, values: any) => {
    const updatedFields = Object.keys(values).reduce(
      (acc: Record<string, any>, key) => {
        if (key === "currentLocation") {
          if (values[key].locationId !== initialValues[key].locationId) {
            acc[key] = values[key];
          }
        }

        if (values[key] !== initialValues[key]) {
          if (key !== "currentLocation") {
            acc[key] = values[key];
          }
        }
        return acc;
      },
      {}
    );

    return updatedFields;
  };

  const transormedvalues = {
    ...initialValues,
    isExpectedCtcNegotiable:
      initialValues.isExpectedCtcNegotiable === "true"
        ? true
        : initialValues.isExpectedCtcNegotiable === "false"
        ? false
        : initialValues.isExpectedCtcNegotiable,
    preferredJobModes: initialValues.preferredJobModes,
    address1: initialValues.address1,
    linkedin: initialValues.linkedin,
  };

  const [isDifferentlyAbleEnabled, setIsDifferentlyAbleEnabled] =
    useState(false);

  const formik = useFormik({
    initialValues: transormedvalues, // Pass initialValues from props
    validationSchema: candidateGridUpdateSchema,
    onSubmit: (values) => {
      console.log(values);
      const updatedFields = getUpdatedFields(initialValues, values);
      try {
        updateCandidate(updatedFields, id).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Profile updated successfully", {
              position: "top-right",
            });
            onClose();
            autoClose();
          } else {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.", {
          position: "top-right",
        });
      }
    },
  });

  return (
    <div className="min-h-screen mt-4 p-6 rounded-md">
      <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200 flex items-center flex-shrink-0">
          <svg
            className="w-6 h-6 mr-2 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">Update Candidate</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <form className="p-4" onSubmit={formik.handleSubmit}>
            {/* Basic Details Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-6">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-md font-semibold"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="e.g. John"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.firstName.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-md font-semibold"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="e.g. Doe"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.lastName.toString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Email */}
                <div>
                  <label
                    htmlFor="emailId"
                    className="block text-md font-semibold"
                  >
                    Email
                  </label>
                  <input
                    id="emailId"
                    name="emailId"
                    type="email"
                    placeholder="e.g. john@example.com"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.emailId}
                  />
                  {formik.touched.emailId && formik.errors.emailId ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.emailId.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Primary Number */}
                <div>
                  <label
                    htmlFor="primaryNumber"
                    className="block text-md font-semibold"
                  >
                    Mobile Number (Primary)
                  </label>
                  <input
                    id="primaryNumber"
                    name="primaryNumber"
                    type="tel"
                    placeholder="e.g. +1234567890"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.primaryNumber}
                  />
                  {formik.touched.primaryNumber &&
                  formik.errors.primaryNumber ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.primaryNumber.toString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                Professional Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Designation */}
                <div>
                  <label
                    htmlFor="designation"
                    className="block text-md font-semibold"
                  >
                    Designation
                  </label>
                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.designation}
                  />
                  {formik.touched.designation && formik.errors.designation ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.designation.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Tech Role */}
                <div>
                  <label
                    htmlFor="techRole"
                    className="block text-md font-semibold"
                  >
                    Tech Role
                  </label>
                  <input
                    id="techRole"
                    name="techRole"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.techRole}
                  />
                  {formik.touched.techRole && formik.errors.techRole ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.techRole.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-md font-semibold"
                  >
                    Current Company
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="e.g. Google"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyName}
                  />
                  {formik.touched.companyName && formik.errors.companyName ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.companyName.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Total Experience */}
                <div>
                  <label
                    htmlFor="totalExperience"
                    className="block text-md font-semibold"
                  >
                    Total Experience (Years)
                  </label>
                  <input
                    id="totalExperience"
                    name="totalExperience"
                    type="number"
                    placeholder="e.g. 5"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.totalExperience}
                  />
                  {formik.touched.totalExperience &&
                  formik.errors.totalExperience ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.totalExperience.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Current Salary */}
                <div>
                  <label
                    htmlFor="currentSalary"
                    className="block text-md font-semibold"
                  >
                    Current Salary (LPA)
                  </label>
                  <input
                    id="currentSalary"
                    name="currentSalary"
                    type="number"
                    placeholder="e.g. 50000"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.currentSalary}
                  />
                  {formik.touched.currentSalary &&
                  formik.errors.currentSalary ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.currentSalary.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Expected Salary */}
                <div>
                  <label
                    htmlFor="expectedSalary"
                    className="block text-md font-semibold"
                  >
                    Expected Salary (LPA)
                  </label>
                  <input
                    id="expectedSalary"
                    name="expectedSalary"
                    type="number"
                    placeholder="e.g. 50000"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.expectedSalary}
                  />
                  {formik.touched.expectedSalary &&
                  formik.errors.expectedSalary ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.expectedSalary.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Notice Period */}
                <div>
                  <label
                    htmlFor="noticePeriod"
                    className="block text-md font-semibold"
                  >
                    Notice Period (Days)
                  </label>
                  <input
                    id="noticePeriod"
                    name="noticePeriod"
                    type="number"
                    placeholder="e.g. 30"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.noticePeriod}
                  />
                  {formik.touched.noticePeriod && formik.errors.noticePeriod ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.noticePeriod.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Candidate Status */}
                <div className="space-y-6">
                  <label
                    htmlFor="isActive"
                    className="block text-md font-semibold"
                  >
                    Candidate Status
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="status_active"
                        name="isActive"
                        type="radio"
                        onChange={() => handleStatusChange(true)}
                        checked={formik.values.isActive === true}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formik.values.isActive === true
                            ? "border-cyan-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formik.values.isActive === true && (
                          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                        )}
                      </div>
                      <span className="text-gray-700 dark:text-black">
                        Active
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        id="status_inactive"
                        name="isActive"
                        type="radio"
                        onChange={() => handleStatusChange(false)}
                        checked={formik.values.isActive === false}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formik.values.isActive === false
                            ? "border-cyan-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formik.values.isActive === false && (
                          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                        )}
                      </div>
                      <span className="text-gray-700 dark:text-black">
                        Inactive
                      </span>
                    </label>
                  </div>
                  {/* Confirmation Dialog */}
                  <Dialog
                    open={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    className="relative z-50"
                  >
                    <div
                      className="fixed inset-0 bg-black/30"
                      aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                      <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
                        <Dialog.Title className="font-bold text-lg">
                          Confirm Status Change
                        </Dialog.Title>
                        <Dialog.Description className="mt-2">
                          Are you sure you want to make this candidate inactive?
                        </Dialog.Description>

                        <div className="mt-4 flex gap-3 justify-end">
                          <button
                            onClick={() => setShowConfirmation(false)}
                            className="px-4 py-2 border border-gray-300 rounded  hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmInactive}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Confirm
                          </button>
                        </div>
                      </Dialog.Panel>
                    </div>
                  </Dialog>

                  {formik.touched.isActive && formik.errors.isActive ? (
                    <div className="flex items-center mt-2 gap-2 text-red-600 font-medium">
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
                      <span>{formik.errors.isActive.toString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Education and Location Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-6">
                Location
              </h2>
              {/* Highest Education */}
              <div className="grid grid-cols-1 gap-14  lg:grid-cols-2">
                {/* Location */}
                <div className="space-y-0">
                  <label
                    htmlFor="currentLocation"
                    className="block text-md font-semibold"
                  >
                    Current Location
                  </label>
                  <LocationAutocomplete
                    name="currentLocation"
                    placeholder="Enter Current Location"
                    value={formik.values.currentLocation.locationDetails}
                    onChange={onChangeLocation}
                    options={masterLocations}
                    onAdd={addNewLocation}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
              <CancelButton executable={autoClose}></CancelButton>
              <SubmitButton label={"Update"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateGridUpdate;
