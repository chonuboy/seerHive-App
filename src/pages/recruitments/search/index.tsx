import { searchRecruitmentData } from "@/api/recruitment/recruitmentData";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import { setRecruitmentSearchQuery } from "@/Features/recruitmentCandidateSearchSlice";
import { recruitmentSearchFormValues } from "@/lib/models/recruitmentCandidate";
import { useFormik } from "formik";
import { IndianRupee, X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function SearchRecruitmentData() {
  const initialValues: recruitmentSearchFormValues = {
    role: "",
    skills: [],
    currentLocation: "",
    preferredLocations: [],
    totalExperience: null,
    relevantExperience: null,
    communicationSkillsRating: null,
    technicalSkillsRating: null,
    noticePeriod: null,
    currentCTC: null,
    expectedCTC: null,
  };

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentPreflocation, setCurrentPreflocation] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
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

  const handleSubmit = (values: recruitmentSearchFormValues) => {
    const payload = Object.entries(values).reduce((acc: any, [key, value]) => {
      if (
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log(payload);

    if (Object.keys(payload).length === 0) {
      toast.error("Please enter at least one search criteria.", {
        position: "top-center",
      });
      return;
    } else {
      dispatch(setRecruitmentSearchQuery(payload));
      setTimeout(() => {
        router.push("/recruitments/results");
      }, 2000);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: recruitmentSearchSchema,
    onSubmit: handleSubmit,
  });

  return (
    <MainLayout>
      <ContentHeader title="Search Recruitment Data" />
      <div className="min-h-screen transition-all duration-200">
        <div className="">
          {/* Search Form */}
          <div className="rounded-2xl  overflow-hidden">
            <div className="">
              <form onSubmit={formik.handleSubmit} className="space-y-10">
                {/* Basic Search Criteria */}
                <div className="space-y-10">
                  <div className="bg-white p-6">
                    <h3 className="text-lg sm:text-2xl font-semibold  text-cyan-500 border-b-2 pb-2 border-red-400 mb-8 12lex items-center">
                      Basic Criteria
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Skills */}
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="skills"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Required Skills
                        </label>
                        <div className="relative">
                          <input
                            id="skills"
                            name="skills"
                            type="text"
                            placeholder="e.g. React, JavaScript, CSS, Node.js"
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                            onChange={(e) => {
                              setCurrentSkill(e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                            value={currentSkill}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                              className="text-white text-md bg-blue-500 px-3 py-1 rounded-md"
                              type="button"
                              onClick={() => {
                                if (currentSkill) {
                                  formik.setFieldValue("skills", [
                                    ...formik.values.skills,
                                    currentSkill,
                                  ]);
                                  setCurrentSkill("");
                                }
                              }}
                            >
                              Add
                            </button>
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
                        <div className="flex items-center gap-4 my-4">
                          {formik.values.skills.length > 0 &&
                            formik.values.skills.map((skill: string) => (
                              <div key={skill} className="px-4 border-2 mt-2 rounded-md border-cyan-500 items-center gap-4">
                                <span className="relative">
                                  {skill}
                                  <X
                                    className="w-5 h-5 absolute -top-3 -right-6 cursor-pointer bg-white text-gray-500 border-2 border-gray-500 rounded-full hover:bg-gray-600 hover:text-white"
                                    onClick={() => {
                                      formik.setFieldValue(
                                        "skills",
                                        formik.values.skills.filter(
                                          (s: string) => s !== skill
                                        )
                                      );
                                    }}
                                  ></X>
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Role */}
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="role"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Role / Position
                        </label>
                        <div className="relative">
                          <input
                            id="role"
                            name="role"
                            type="text"
                            placeholder="e.g. Frontend Developer, Data Scientist"
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
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
                    </div>
                  </div>

                  {/* Location Preferences */}
                  <div className="bg-white p-6">
                    <h3 className="text-lg sm:text-2xl font-semibold  text-cyan-500 border-b-2 pb-2 border-green-400 mb-12 flex items-center">
                      Location Preferences
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Preferred Locations */}
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="preferredLocations"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Preferred Work Locations
                        </label>
                        <div className="relative">
                          <input
                            id="preferredLocations"
                            name="preferredLocations"
                            type="text"
                            placeholder="e.g. Mumbai, India"
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                            onChange={(e) => {
                              setCurrentPreflocation(e.target.value);
                            }}
                            onBlur={formik.handleBlur}
                            value={currentPreflocation}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                              className="text-white text-md bg-blue-500 px-3 py-1 rounded-md"
                              type="button"
                              onClick={() => {
                                if (currentPreflocation) {
                                  formik.setFieldValue("preferredLocations", [
                                    ...formik.values.preferredLocations,
                                    currentPreflocation,
                                  ]);
                                  setCurrentPreflocation("");
                                }
                              }}
                            >
                              Add
                            </button>
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
                        <div className="flex items-center gap-4 my-4">
                          {formik.values.preferredLocations.length > 0 &&
                            formik.values.preferredLocations.map((preferredLocation: string) => (
                              <div key={preferredLocation} className="px-4 border-2 mt-2 rounded-md border-cyan-500 items-center gap-4">
                                <span className="relative">
                                  {preferredLocation}
                                  <X
                                    className="w-5 h-5 absolute -top-3 -right-6 cursor-pointer bg-white text-gray-500 border-2 border-gray-500 rounded-full hover:bg-gray-600 hover:text-white"
                                    onClick={() => {
                                      formik.setFieldValue(
                                        "preferredLocations",
                                        formik.values.preferredLocations.filter(
                                          (p: string) => p !== preferredLocation
                                        )
                                      );
                                    }}
                                  ></X>
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Current Location */}
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="currentLocation"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Current Location
                        </label>
                        <input
                          id="currentLocation"
                          name="currentLocation"
                          type="text"
                          placeholder="e.g. Chennai, India"
                          className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
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
                    </div>
                  </div>

                  {/* Experience & Skills */}
                  <div className="bg-white p-6">
                    <h3 className="text-lg sm:text-2xl font-semibold  text-cyan-500 border-b-2 pb-2 border-blue-400 mb-12 flex items-center">
                      Experience & Skills Assessment
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Total Experience */}
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="totalExperience"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
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
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.totalExperience ?? ""}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">years</span>
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
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="relevantExperience"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
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
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.relevantExperience ?? ""}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">years</span>
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
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="communicationSkillsRating"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Communication Rating
                        </label>
                        <div className="relative">
                          <input
                            id="communicationSkillsRating"
                            name="communicationSkillsRating"
                            type="number"
                            min="0"
                            max="5"
                            placeholder="0"
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.communicationSkillsRating ?? ""}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">/5</span>
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
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="technicalSkillsRating"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Technical Rating
                        </label>
                        <div className="relative">
                          <input
                            id="technicalSkillsRating"
                            name="technicalSkillsRating"
                            type="number"
                            min="0"
                            max="5"
                            placeholder="0"
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.technicalSkillsRating ?? ""}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">/5</span>
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
                  <div className="bg-white p-6">
                    <h3 className="text-lg sm:text-2xl font-semibold  text-cyan-500 border-b-2 pb-2 border-yellow-400 mb-12 flex items-center">
                      Compensation & Availability
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Notice Period */}
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="noticePeriod"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
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
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.noticePeriod ?? ""}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">days</span>
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
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="currentCTC"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Current CTC(<IndianRupee className="inline w-4 h-4 mb-1"></IndianRupee>)
                        </label>
                        <div className="relative">
                          <input
                            id="currentCTC"
                            name="currentCTC"
                            type="number"
                            min="0"
                            placeholder="800000"
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
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
                      <div className="space-y-3 mt-8">
                        <label
                          htmlFor="expectedCTC"
                          className="block text-xl font-semibold text-gray-700 dark:text-white"
                        >
                          Expected CTC (<IndianRupee className="inline w-4 h-4 mb-1"></IndianRupee>)
                        </label>
                        <div className="relative">
                          <input
                            id="expectedCTC"
                            name="expectedCTC"
                            type="number"
                            min="0"
                            placeholder="1200000"
                            className="w-full flex items-center gap-2 py-3 border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
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
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
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
    </MainLayout>
  );
}
