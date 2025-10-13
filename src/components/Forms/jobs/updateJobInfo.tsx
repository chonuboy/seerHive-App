import { useFormik } from "formik";
import { toast } from "react-toastify";
import { clientLocationFormValues, jobUpdateSchema } from "@/lib/models/client";
import { updateJob } from "@/api/client/clientJob";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CancelButton from "@/components/Elements/utils/CancelButton";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import QuillEditor from "@/components/Elements/utils/QuilEditor";

// Quill CSS once globally
import "quill/dist/quill.snow.css";
import { X } from "lucide-react";
import { Location } from "@/lib/definitions";
import { fetchAllLocations } from "@/api/master/masterLocation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function JobInfoUpdateForm({
  currentJob,
  id,
  autoClose,
}: {
  currentJob: any;
  id: number;
  autoClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jd, setJobDescription] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<clientLocationFormValues[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [allClientLocations, setAllClientLocations] = useState([]);

  useEffect(() => {
    fetchAllLocations().then((data) => {
      if (data.length > 0) {
        setAllClientLocations(data);
      }
    });
  }, []);
  const getUpdatedFields = (initialValues: any, values: any) => {
    return Object.keys(values).reduce((acc: Record<string, any>, key) => {
      if (values[key] !== initialValues[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);

    // Filter suggestions based on input
    if (e.target.value) {
      const filtered = allClientLocations.filter((location: any) =>
        `${location.locationDetails}`
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(allClientLocations);
    }
  };
  const handleSelectSuggestion = (location: any) => {
    const alreadyExists = formik.values.locations?.some(
      (loc: any) => loc.locationId === location.locationId
    );

    if (!alreadyExists) {
      const updatedLocations = [...(formik.values.locations || []), location];
      formik.setFieldValue("locations", updatedLocations);
    }

    setInputValue("");
    setShowSuggestions(false);
  };

  const formik = useFormik({
    initialValues: currentJob,
    validationSchema: jobUpdateSchema,
    onSubmit: (values) => {
      try {
        const updatedFields = getUpdatedFields(currentJob, values);
        console.log("Updating job with:", id, updatedFields);

        // Add await here to properly handle the promise
        updateJob(id, updatedFields).then((data) => {
          if (data.status === 200) {
            console.log(data);
            toast.success("Job updated successfully", {
              position: "top-right",
            });
            autoClose();
          } else if (data.message) {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        });
      } catch (error: any) {
        console.error("Update error:", error);
        toast.error(error.message || "An error occurred during update.", {
          position: "top-right",
        });
      }
    },
  });

  function handleRemoveLocation(index: number) {
    const updatedLocations = [...currentJob.jobLocations];
    updatedLocations.splice(index, 1);
    formik.setFieldValue("jobLocations", updatedLocations);
  }

  return (
    <div className="min-h-screen py-8">
      <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200 flex items-center flex-shrink-0">
          {currentJob.jobId ? (
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
          ) : (
            ""
          )}

          <h1 className="text-2xl font-bold text-gray-900">
            {currentJob.jobId ? "Update Job" : "Create New Job"}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form className="p-8" onSubmit={formik.handleSubmit}>
            {/* Basic Job Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-4">
                Job Details
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* Job Title */}
                <div>
                  <label
                    htmlFor="jobTitle"
                    className="block font-semibold mb-2"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    id="jobTitle"
                    value={formik.values.jobTitle || ""}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                  {formik.errors.jobTitle && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                      <span>{formik.errors.jobTitle.toString()}</span>
                    </div>
                  )}
                </div>

                {/* Job Code */}
                <div>
                  <label htmlFor="jobCode" className="block font-semibold mb-2">
                    Job Code
                  </label>
                  <input
                    type="text"
                    name="jobCode"
                    id="jobCode"
                    value={formik.values.jobCode || ""}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                  {formik.errors.jobCode && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                      <span>{formik.errors.jobCode.toString()}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="noOfOpenings"
                    className="block font-semibold mb-2"
                  >
                    No. of Openings
                  </label>
                  <input
                    type="number"
                    name="noOfOpenings"
                    id="noOfOpenings"
                    min="0"
                    value={formik.values.noOfOpenings || 0}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                  {formik.errors.noOfOpenings && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                      <span>{formik.errors.noOfOpenings.toString()}</span>
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block font-semibold mb-2"
                  >
                    Min Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="minimumExperience"
                    id="minimumExperience"
                    min="0"
                    value={formik.values.minimumExperience || 0}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                  {formik.errors.minimumExperience && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                      <span>{formik.errors.minimumExperience.toString()}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="maximumExperience"
                    className="block font-semibold mb-2"
                  >
                    Max Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="maximumExperience"
                    id="maximumExperience"
                    min="0"
                    value={formik.values.maximumExperience || 0}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                  {formik.errors.maximumExperience && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                      <span>{formik.errors.maximumExperience.toString()}</span>
                    </div>
                  )}
                </div>

                {/* Salary */}
                <div>
                  <label
                    htmlFor="salaryInCtc"
                    className="block font-semibold mb-2"
                  >
                    Salary (LPA)
                  </label>
                  <input
                    type="number"
                    name="salaryInCtc"
                    id="salaryInCtc"
                    min="0"
                    value={formik.values.salaryInCtc || 0}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                  {formik.errors.salaryInCtc && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                      <span>{formik.errors.salaryInCtc.toString()}</span>
                    </div>
                  )}
                </div>

                {/* Job Status */}
                <div>
                  <label
                    htmlFor="isJobActive"
                    className="block font-semibold mb-2"
                  >
                    Job Status
                  </label>
                  <select
                    name="isJobActive"
                    id="isJobActive"
                    value={formik.values.isJobActive || "OnHold"}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="OnHold">On Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Job Post Type */}
                <div>
                  <label
                    htmlFor="jobPostType"
                    className="block font-semibold mb-2"
                  >
                    Job Post Type
                  </label>
                  <select
                    name="jobPostType"
                    id="jobPostType"
                    value={formik.values.jobPostType || "Replacement"}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold">
                    Job Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                      type="text"
                      name="jobLocation"
                      id="jobLocation"
                      placeholder="Select Job Location"
                      value={inputValue}
                      onChange={handleLocationInputChange}
                      onFocus={() => {
                        setShowSuggestions(true);
                        setSuggestions(allClientLocations);
                      }}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border w-full dark:bg-gray-700">
                        <ul className="py-2 text-base text-gray-700 dark:text-gray-200">
                          {suggestions.map((location: any, index) => (
                            <li
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                              key={index}
                              onClick={() => handleSelectSuggestion(location)}
                            >
                              {location.locationDetails}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {currentJob.locations &&
                      currentJob.locations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-3">
                          {formik.values.locations &&
                            formik.values.locations.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-3">
                                {formik.values.locations.map(
                                  (location: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                                    >
                                      <span>{location.locationDetails}</span>
                                      <button
                                        type="button"
                                        className="absolute -right-2 -top-2"
                                        onClick={() => {
                                          const updatedLocations =
                                            formik.values.locations.filter(
                                              (loc: any) =>
                                                loc.locationId !==
                                                location.locationId
                                            );
                                          formik.setFieldValue(
                                            "locations",
                                            updatedLocations
                                          );
                                        }}
                                      >
                                        <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500"></X>
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      )}
                    {showSuggestions && suggestions.length === 0 && (
                      <div>
                        <span className="text-gray-500">
                          No Job location Found
                        </span>
                      </div>
                    )}

                    {formik.errors.jobLocations && (
                      <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                        <span>{formik.errors.jobLocations.toString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hiringType"
                    className="block font-semibold mb-2"
                  >
                    Hiring Type
                  </label>
                  <select
                    name="hiringType"
                    id="hiringType"
                    value={formik.values.hiringType || "Onsite"}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="preferredJobMode"
                    className="block font-semibold mb-2"
                  >
                    PreferredJobMode
                  </label>
                  <select
                    name="preferredJobMode"
                    id="preferredJobMode"
                    value={formik.values.preferredJobMode || "FullTime"}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  >
                    <option value="FullTime">Full Time</option>
                    <option value="PartTime">Part Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Inserted By */}
                <div>
                  <label
                    htmlFor="insertedBy"
                    className="block font-semibold mb-2"
                  >
                    Posted By
                  </label>
                  <input
                    type="text"
                    name="insertedBy"
                    id="insertedBy"
                    value={formik.values.insertedBy || ""}
                    onChange={formik.handleChange}
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                  />
                  {formik.errors.insertedBy && (
                    <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                      <span>{formik.errors.insertedBy.toString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-4">
                Job Description
              </h2>
              <div>
                <QuillEditor
                  value={formik.values.jobDescription}
                  onChange={(content) => {
                    formik.values.jobDescription = content;
                  }}
                  height={300}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
              <CancelButton executable={autoClose}></CancelButton>
              <SubmitButton label="Update"></SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
