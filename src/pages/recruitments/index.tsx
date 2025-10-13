import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { useEffect } from "react";
import { useFormik } from "formik";
import {
  fetchAllRecruitmentData,
  uploadRecruitmentData,
} from "@/api/recruitment/recruitmentData";
import { useState } from "react";
import { RecruitmentColumn } from "@/lib/models/client";
import { Popup } from "@/components/Elements/cards/popup";
import RecruitmentDataSearch from "@/components/Elements/utils/recruitmentSearch";
import { Search, User, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { searchRecruitmentData } from "@/api/recruitment/recruitmentData";
import { recruitmentSearchFormValues } from "@/lib/models/recruitmentCandidate";
import { useRouter } from "next/router";
import RecruitmentGrid from "@/components/Grids/RecruitmentGrid";
import { RecruitCandidateData } from "@/lib/models/recruitmentCandidate";

export default function Recruitments() {
  const [recruitmentData, setRecruitmentData] = useState<
    RecruitCandidateData[] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isDoc, setIsDoc] = useState(false);
  const [addCandidate, setAddCandidate] = useState(false);
  const [resetEntries, setResetEntries] = useState(12);

  const initialValues: recruitmentSearchFormValues = {
    role: "",
    skills: [],
    currentLocation: "",
    preferredLocations: [],
    totalExperience: 0,
    relevantExperience: 0,
    communicationSkillsRating: 0,
    technicalSkillsRating: 0,
    noticePeriod: 0,
    currentCTC: 0,
    expectedCTC: 0,
  };
  const [searchParams, setSearchParams] =
    useState<recruitmentSearchFormValues | null>(null);

  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageElements, setPageElements] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!isSearchMode) {
          const data = await fetchAllRecruitmentData(currentPage, resetEntries);
          if (data) {
            setRecruitmentData(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
            setPageElements(data.content?.length || 0);
          } else {
            setRecruitmentData([]);
            toast.error("Failed to fetch recruitment data", {
              position: "top-right",
            });
          }
        } else if (searchParams) {
          const searchData = await searchRecruitmentData(
            searchParams,
            currentPage
          );
          if (searchData.status === 200) {
            setRecruitmentData(searchData.data.content || []);
            setTotalPages(searchData.data.totalPages || 0);
            setTotalElements(searchData.data.totalElements || 0);
            setPageElements(searchData.data.content?.length || 0);
          } else {
            setRecruitmentData([]);
            toast.error("Error fetching search results", {
              position: "top-right",
            });
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Failed to load recruitment data. Please try again later.");
        setRecruitmentData([]);
        setTotalPages(0);
        setTotalElements(0);
        setPageElements(0);
        toast.error("An error occurred while fetching data", {
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, isSearchMode, searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmit = (values: recruitmentSearchFormValues) => {
    const updatedFields = getUpdatedFields(initialValues, values);
    setIsLoading(true);
    setIsSearchMode(true);
    setSearchParams(updatedFields as recruitmentSearchFormValues); // Store search parameters
    setCurrentPage(0); // Reset to first page when performing new search

    try {
      searchRecruitmentData(updatedFields, currentPage).then((data) => {
        console.log(data);
        if (data.status === 200) {
          setTimeout(() => {
            setRecruitmentData(data.data);
            setShowSearchForm(false);
            formik.resetForm();
            setIsLoading(false);
          }, 2000);
        } else {
          setIsSearchMode(false);
          setSearchParams(null);
          toast.error("Candidates not found", {
            position: "top-right",
          });
        }
      });
    } catch (error) {
      setIsSearchMode(false);
      setSearchParams(null);
      console.error("Form submission error", error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: recruitmentSearchSchema,
    onSubmit: handleSubmit,
  });

  const handleEntriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const numValue =
        value === "" ? 1 : Math.min(100, Math.max(1, parseInt(value, 10)));
      setResetEntries(numValue);
      setCurrentPage(0); // Reset to first page when changing entries per page
    }
  };

  const getUpdatedFields = (initialValues: any, values: any) => {
    const updatedFields = Object.keys(values).reduce(
      (acc: Record<string, any>, key) => {
        // Skip fields that haven't changed
        if (values[key] !== initialValues[key]) {
          // Special handling for currentLocation
          if (key === "currentLocation") {
            acc[key] = {
              locationId: 2,
            };
          }
          // Handle all other fields normally
          else {
            acc[key] = values[key];
          }
        }
        return acc;
      },
      {}
    );

    return updatedFields;
  };

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SearchIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDocSubmit = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      uploadRecruitmentData(file).then((res) => {
        console.log(res);

        if (res.message) {
          toast.error(res.message, { position: "top-right" });
        } else {
          toast.success("File uploaded successfully", {
            position: "top-right",
          });
          setUploading(false);
          setFile(null);
          setIsDoc(false);
        }
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleEntriesKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      if (resetEntries > totalElements) {
        toast.error("Cannot set entries more than total elements", {
          position: "top-center",
        });
        return;
      }
      setIsLoading(true);
      setCurrentPage(0); // Reset to first page when changing entries per page
      const data = await fetchAllRecruitmentData(currentPage, resetEntries);
      if (data) {
        setRecruitmentData(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setPageElements(data.content?.length || 0);
        setIsLoading(false);
      } else {
        setRecruitmentData([]);
        toast.error("Failed to fetch recruitment data", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <MainLayout>
      <ContentHeader title="Recruitments" />
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      {!isLoading && (!recruitmentData || recruitmentData.length === 0) && (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 rounded-lg w-full max-w-md mx-auto">
          <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#a0d9f7] bg-white">
            <User className="w-12 h-12 text-[#00bcd4]" />
          </div>
          <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">
            {isSearchMode
              ? "No matching candidates found"
              : "No Candidates Added Yet!"}
          </h2>
          <p className="text-base text-[#888888] text-center mb-6">
            {isSearchMode
              ? "Try adjusting your search criteria"
              : "Create Candidate and it will show up here"}
          </p>
          <button
            className="flex items-center justify-center px-6 py-3 bg-[#00bcd4] text-white rounded-md text-lg font-semibold shadow-md hover:bg-[#00a0b3] transition-colors duration-200"
            onClick={() => router.push("/recruitments/add")}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Candidate
          </button>
        </div>
      )}
      {isDoc && (
        <Popup
          onClose={() => {
            setIsDoc(false);
          }}
        >
          <div className="mx-auto p-6 bg-white rounded-xl shadow-lg border mt-16 border-gray-200 transition-all duration-300 hover:shadow-xl">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Upload Document
              </h3>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <div className="flex flex-col items-center gap-4">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-700 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-base font-medium text-gray-700 mb-1">
                    {file ? file.name : "Choose a file or drag it here"}
                  </span>
                  <span className="text-xs text-gray-500">PDF, DOC, DOCX</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleDocSubmit}
              disabled={uploading || !file}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                uploading || !file
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Document"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-5 p-4 bg-red-50 border border-red-300 rounded-lg">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-700">Error:</p>
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Popup>
      )}
      {showSearchForm && (
        <Popup onClose={() => setShowSearchForm(false)}>
          <div className="min-h-screen  py-8 mt-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Search Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8 lg:p-10">
                  <form onSubmit={formik.handleSubmit} className="space-y-8">
                    {/* Basic Search Criteria */}
                    <div className="space-y-6">
                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            1
                          </div>
                          Basic Criteria
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Role */}
                          <div className="space-y-3">
                            <label
                              htmlFor="role"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Role / Position
                            </label>
                            <div className="relative">
                              <input
                                id="role"
                                name="role"
                                type="text"
                                placeholder="e.g. Frontend Developer, Data Scientist"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.role}
                              />
                            </div>
                            {formik.touched.role && formik.errors.role && (
                              <div className="text-red-500 text-sm font-medium flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {formik.errors.role.toString()}
                              </div>
                            )}
                          </div>

                          {/* Skills */}
                          <div className="space-y-3">
                            <label
                              htmlFor="skills"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Required Skills
                            </label>
                            <div className="relative">
                              <input
                                id="skills"
                                name="skills"
                                type="text"
                                placeholder="e.g. React, JavaScript, CSS, Node.js"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={(e) => {
                                  const skillsArray = e.target.value
                                    .split(",")
                                    .map((skill) => skill.trim())
                                    .filter((skill) => skill.length > 0);
                                  formik.setFieldValue("skills", skillsArray);
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.skills.join(", ")}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-md">
                                  Comma separated
                                </span>
                              </div>
                            </div>
                            {formik.touched.skills && formik.errors.skills && (
                              <div className="text-red-500 text-sm font-medium flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {formik.errors.skills.toString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location Preferences */}
                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            2
                          </div>
                          Location Preferences
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Current Location */}
                          <div className="space-y-3">
                            <label
                              htmlFor="currentLocation"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Current Location
                            </label>
                            <input
                              id="currentLocation"
                              name="currentLocation"
                              type="text"
                              placeholder="e.g. Chennai, India"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.currentLocation}
                            />
                            {formik.touched.currentLocation &&
                              formik.errors.currentLocation && (
                                <div className="text-red-500 text-sm font-medium flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {formik.errors.currentLocation.toString()}
                                </div>
                              )}
                          </div>

                          {/* Preferred Locations */}
                          <div className="space-y-3">
                            <label
                              htmlFor="preferredLocations"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Preferred Work Locations
                            </label>
                            <div className="relative">
                              <input
                                id="preferredLocations"
                                name="preferredLocations"
                                type="text"
                                placeholder="e.g. Mumbai, India"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={(e) => {
                                  const locationsArray = e.target.value
                                    .split(",")
                                    .map((location) => location.trim())
                                    .filter((location) => location.length > 0);
                                  formik.setFieldValue(
                                    "preferredLocations",
                                    locationsArray
                                  );
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.preferredLocations.join(
                                  ", "
                                )}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-md">
                                  Comma separated
                                </span>
                              </div>
                            </div>
                            {formik.touched.preferredLocations &&
                              formik.errors.preferredLocations && (
                                <div className="text-red-500 text-sm font-medium flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {formik.errors.preferredLocations.toString()}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Experience & Skills */}
                      <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            3
                          </div>
                          Experience & Skills Assessment
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Total Experience */}
                          <div className="space-y-3">
                            <label
                              htmlFor="totalExperience"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Total Experience
                            </label>
                            <div className="relative">
                              <input
                                id="totalExperience"
                                name="totalExperience"
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.totalExperience ?? ""}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs">
                                  years
                                </span>
                              </div>
                            </div>
                            {formik.touched.totalExperience &&
                              formik.errors.totalExperience && (
                                <div className="text-red-500 text-sm font-medium">
                                  {formik.errors.totalExperience.toString()}
                                </div>
                              )}
                          </div>

                          {/* Relevant Experience */}
                          <div className="space-y-3">
                            <label
                              htmlFor="relevantExperience"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Relevant Experience
                            </label>
                            <div className="relative">
                              <input
                                id="relevantExperience"
                                name="relevantExperience"
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.relevantExperience ?? ""}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs">
                                  years
                                </span>
                              </div>
                            </div>
                            {formik.touched.relevantExperience &&
                              formik.errors.relevantExperience && (
                                <div className="text-red-500 text-sm font-medium">
                                  {formik.errors.relevantExperience.toString()}
                                </div>
                              )}
                          </div>

                          {/* Communication Skills Rating */}
                          <div className="space-y-3">
                            <label
                              htmlFor="communicationSkillsRating"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Communication Rating
                            </label>
                            <div className="relative">
                              <input
                                id="communicationSkillsRating"
                                name="communicationSkillsRating"
                                type="number"
                                min="0"
                                max="10"
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                  formik.values.communicationSkillsRating ?? ""
                                }
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs">
                                  /10
                                </span>
                              </div>
                            </div>
                            {formik.touched.communicationSkillsRating &&
                              formik.errors.communicationSkillsRating && (
                                <div className="text-red-500 text-sm font-medium">
                                  {formik.errors.communicationSkillsRating.toString()}
                                </div>
                              )}
                          </div>

                          {/* Technical Skills Rating */}
                          <div className="space-y-3">
                            <label
                              htmlFor="technicalSkillsRating"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Technical Rating
                            </label>
                            <div className="relative">
                              <input
                                id="technicalSkillsRating"
                                name="technicalSkillsRating"
                                type="number"
                                min="0"
                                max="10"
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                  formik.values.technicalSkillsRating ?? ""
                                }
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs">
                                  /10
                                </span>
                              </div>
                            </div>
                            {formik.touched.technicalSkillsRating &&
                              formik.errors.technicalSkillsRating && (
                                <div className="text-red-500 text-sm font-medium">
                                  {formik.errors.technicalSkillsRating.toString()}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Compensation & Availability */}
                      <div className="pb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            4
                          </div>
                          Compensation & Availability
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Notice Period */}
                          <div className="space-y-3">
                            <label
                              htmlFor="noticePeriod"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Notice Period
                            </label>
                            <div className="relative">
                              <input
                                id="noticePeriod"
                                name="noticePeriod"
                                type="number"
                                min="0"
                                placeholder="30"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.noticePeriod ?? ""}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs">
                                  days
                                </span>
                              </div>
                            </div>
                            {formik.touched.noticePeriod &&
                              formik.errors.noticePeriod && (
                                <div className="text-red-500 text-sm font-medium">
                                  {formik.errors.noticePeriod.toString()}
                                </div>
                              )}
                          </div>

                          {/* Current CTC */}
                          <div className="space-y-3">
                            <label
                              htmlFor="currentCTC"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Current CTC
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">₹</span>
                              </div>
                              <input
                                id="currentCTC"
                                name="currentCTC"
                                type="number"
                                min="0"
                                placeholder="800000"
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.currentCTC ?? ""}
                              />
                            </div>
                            {formik.touched.currentCTC &&
                              formik.errors.currentCTC && (
                                <div className="text-red-500 text-sm font-medium">
                                  {formik.errors.currentCTC.toString()}
                                </div>
                              )}
                          </div>

                          {/* Expected CTC */}
                          <div className="space-y-3">
                            <label
                              htmlFor="expectedCTC"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Expected CTC
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">₹</span>
                              </div>
                              <input
                                id="expectedCTC"
                                name="expectedCTC"
                                type="number"
                                min="0"
                                placeholder="1200000"
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base placeholder-gray-400 bg-gray-50 focus:bg-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.expectedCTC ?? ""}
                              />
                            </div>
                            {formik.touched.expectedCTC &&
                              formik.errors.expectedCTC && (
                                <div className="text-red-500 text-sm font-medium">
                                  {formik.errors.expectedCTC.toString()}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          formik.resetForm();
                          setShowSearchForm(false);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all duration-200 text-sm sm:text-base shadow-sm"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel Search
                      </button>
                      <button
                        type="button"
                        onClick={() => formik.resetForm()}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-orange-300 rounded-xl text-orange-700 bg-orange-50 hover:bg-orange-100 font-medium transition-all duration-200 text-sm sm:text-base"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Reset Filters
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <SearchIcon />
                        <span className="ml-2">Search Candidates</span>
                        <div className="ml-2 w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      )}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">Loading</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      )}
      {!isLoading && recruitmentData && recruitmentData.length > 0 && (
        <>
          <div className="flex justify-end mb-4">
            <div className="flex item gap-2">
              <button
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-200"
                onClick={() => router.push("/recruitments/add")}
              >
                Add New Candidate
              </button>
              <button
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-200"
                onClick={() => setIsDoc(true)}
              >
                Bulk Upload
              </button>
              <button
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-200"
                onClick={() => router.push("/recruitments/search")}
              >
                Search Candidates
              </button>
            </div>
          </div>
          <RecruitmentGrid
            recruitmentCandidate={recruitmentData}
          ></RecruitmentGrid>
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-500">
              Showing
              <input
                type="number"
                min={1}
                max={totalElements}
                value={resetEntries}
                onChange={handleEntriesChange}
                onKeyDown={handleEntriesKeyDown}
                className="w-14 px-2 mx-2 py-1 border rounded focus:border-cyan-500"
              />
              of {totalElements} entries
            </div>

            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === 0
                    ? "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {"<"}
              </button>

              {/* Page Numbers */}
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;

                // Calculate start and end page numbers
                let startPage = Math.max(
                  0,
                  currentPage - Math.floor(maxVisiblePages / 2)
                );
                let endPage = Math.min(
                  totalPages - 1,
                  startPage + maxVisiblePages - 1
                );

                // Adjust start page if we're near the end
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(0, endPage - maxVisiblePages + 1);
                }

                // Always show first page
                if (startPage > 0) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(0)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === 0
                          ? "bg-cyan-500 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      1
                    </button>
                  );

                  // Show ellipsis if there are pages between first page and start page
                  if (startPage > 1) {
                    pages.push(
                      <span
                        key="ellipsis-start"
                        className="px-2 text-sm text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                }

                // Show page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === i
                          ? "bg-cyan-500 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                }

                // Always show last page
                if (endPage < totalPages - 1) {
                  // Show ellipsis if there are pages between end page and last page
                  if (endPage < totalPages - 2) {
                    pages.push(
                      <span
                        key="ellipsis-end"
                        className="px-2 text-sm text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }

                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages - 1)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === totalPages - 1
                          ? "bg-cyan-500 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages - 1
                    ? "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {">"}
              </button>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
