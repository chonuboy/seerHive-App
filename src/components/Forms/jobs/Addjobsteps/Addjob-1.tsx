import { useDispatch, useSelector } from "react-redux";
import { updateAddJobFormData } from "@/Features/job-slice";
import { useField } from "formik";
import { useEffect, useState } from "react";
import { fetchAllClientLocations } from "@/api/client/locations";
import { useRouter } from "next/router";
import { clientLocationFormValues } from "@/lib/models/client";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { fetchAllLocations } from "@/api/master/masterLocation";
import { Location } from "@/lib/definitions";

export default function Step1BasicDetails() {
  const dispatch = useDispatch();
  const formData = useSelector((state: any) => state.job.formData);

  // Formik field hooks
  const [jobTitleField, jobTitleMeta] = useField("jobTitle");
  const [jobCodeField, jobCodeMeta] = useField("jobCode");
  const [jobLocationField, jobLocationMeta] = useField("locations");
  const [insertedByField, insertedByMeta] = useField("insertedBy");
  const [jobStatusField, jobStatusMeta] = useField("isJobActive");
  const [allClientLocations, setAllClientLocations] = useState([]);
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<clientLocationFormValues[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateAddJobFormData({ [field]: value }));
  };

  const handleRadioChange = (field: string, value: any) => {
    dispatch(updateAddJobFormData({ [field]: value }));
  };

  const handleSelectSuggestion = (suggestion: Location) => {
    if (
      formData.locations?.some(
        (location: any) =>
          location.locationDetails === suggestion.locationDetails
      )
    ) {
      toast.error("Location already added", { position: "top-center" });
      return;
    }

    dispatch(
      updateAddJobFormData({
        locations: [
          ...(formData.locations || []),
          {
            locationId: suggestion.locationId,
            locationDetails: suggestion.locationDetails,
          },
        ],
      })
    );
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    fetchAllLocations().then((data) => {
      if (data.length > 0) {
        setAllClientLocations(data);
      }
    });
  }, []);
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-cyan-500">Basic Details</h2>

      <div className="space-y-8">
        <div>
          <label className="block font-semibold" htmlFor="jobTitle">
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="jobTitle"
              {...jobTitleField}
              value={formData.jobTitle}
              onChange={(e) => {
                jobTitleField.onChange(e);
                handleInputChange("jobTitle", e.target.value);
              }}
              onBlur={jobTitleField.onBlur}
              placeholder="Eg: Frontend Developer"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {jobTitleMeta.error && (
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
                <span>{jobTitleMeta.error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold" htmlFor="jobCode">
              Job Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="jobCode"
                {...jobCodeField}
                value={formData.jobCode}
                onChange={(e) => {
                  jobCodeField.onChange(e);
                  handleInputChange("jobCode", e.target.value);
                }}
                onBlur={jobCodeField.onBlur}
                placeholder="Enter job id"
                className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              />
              {jobCodeMeta.error && (
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
                  <span>{jobCodeMeta.error}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold">
              Job Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                type="text"
                name="locations"
                id="locations"
                placeholder="Select Job Location"
                value={inputValue}
                onChange={handleLocationInputChange}
                onFocus={() => {
                  setShowSuggestions(true);
                  setSuggestions(allClientLocations);
                }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border w-full dark:bg-gray-700 max-h-60 overflow-y-auto">
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
              {formData.locations && formData.locations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {formData.locations.map((location: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-1 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
                    >
                      <span>{location.locationDetails}</span>
                      <button
                        type="button"
                        className="absolute -right-2 -top-2"
                        onClick={() => {
                          const updatedLocations = formData.locations.filter(
                            (_: any, i: number) => i !== index
                          );
                          dispatch(
                            updateAddJobFormData({
                              locations: updatedLocations,
                            })
                          );
                        }}
                      >
                        <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500"></X>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {jobLocationMeta.error && (
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
                  <span>{jobLocationMeta.error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <h2 className="text-xl font-semibold text-cyan-500">Miscellaneous</h2>

        <div className="space-y-8">
          <div>
            <label className="block font-semibold mb-3" htmlFor="jobStatus">
              Job Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 justify-between text-sm">
              {["Active", "On-Hold", "Closed"].map((status) => (
                <label key={status} className="flex items-center text-sm gap-1">
                  <input
                    id="jobStatus"
                    type="radio"
                    name={jobStatusField.name}
                    value={status}
                    onChange={(e) => {
                      jobStatusField.onChange(e);
                      handleRadioChange("isJobActive", e.target.value);
                    }}
                    onBlur={jobStatusField.onBlur}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full mx-1 border-2 flex items-center justify-center ${
                      formData.isJobActive === status
                        ? "border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.isJobActive === status && (
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    )}
                  </div>
                  <span className="text-gray-700 text-sm">{status}</span>
                </label>
              ))}
            </div>
            <div className="border-0 border-b border-gray-300 mt-4"></div>
            {jobStatusMeta.error && (
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
                <span>{jobStatusMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
