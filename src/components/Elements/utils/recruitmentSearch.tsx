import { useState } from "react";
import { useFormik } from "formik";
import { recruitmentSearchFormValues } from "@/lib/models/recruitmentCandidate";
import { Search } from "lucide-react";
import { recruitmentSearchSchema } from "@/lib/models/recruitmentCandidate";
import { searchRecruitmentData } from "@/api/recruitment/recruitmentData";

// Validation schema using Yup

// Initial values for the search form
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

export default function RecruitmentDataSearch({autoClose}:{autoClose:()=>void}) {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  
  
  const handleSubmit = (values: recruitmentSearchFormValues) => {
    const updatedFields = getUpdatedFields(initialValues, values);
    // Here you would call your API with the search parameters
    console.log(updatedFields);
    // Call your API here
    try {
      searchRecruitmentData(updatedFields).then((data) => {
        console.log(data);
        autoClose();
      });
    } catch (error) {
      console.error("Form submission error", error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: recruitmentSearchSchema,
    onSubmit: handleSubmit,
  });

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

  

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 p-4 bg-white">
      <h2 className="text-2xl font-bold mb-6">Search Candidates</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role */}
          <div className="space-y-2">
            <label htmlFor="role" className="text-gray-400 font-medium">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              placeholder="e.g. Frontend Developer"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
            />
            {formik.touched.role && formik.errors.role ? (
              <div className="text-red-500 text-sm">
                {formik.errors.role.toString()}
              </div>
            ) : null}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label htmlFor="skills" className="text-gray-400 font-medium">
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              placeholder="e.g. React, JavaScript, CSS"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const skillsArray = e.target.value
                  .split(",")
                  .map((skill) => skill.trim());
                formik.setFieldValue("skills", skillsArray);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.skills.join(", ")}
            />
            {formik.touched.skills && formik.errors.skills ? (
              <div className="text-red-500 text-sm">
                {formik.errors.skills.toString()}
              </div>
            ) : null}
          </div>

          {/* Current Location */}
          <div className="space-y-2">
            <label
              htmlFor="currentLocation"
              className="text-gray-400 font-medium"
            >
              Current Location
            </label>
            <input
              id="currentLocation"
              name="currentLocation"
              type="text"
              placeholder="e.g. San Francisco"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentLocation}
            />
            {formik.touched.currentLocation && formik.errors.currentLocation ? (
              <div className="text-red-500 text-sm">
                {formik.errors.currentLocation.toString()}
              </div>
            ) : null}
          </div>

          {/* Preferred Locations */}
          <div className="space-y-2">
            <label
              htmlFor="preferredLocations"
              className="text-gray-400 font-medium"
            >
              Preferred Locations
            </label>
            <input
              id="preferredLocations"
              name="preferredLocations"
              type="text"
              placeholder="e.g. New York, Remote, Austin"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const locationsArray = e.target.value
                  .split(",")
                  .map((location) => location.trim());
                formik.setFieldValue("preferredLocations", locationsArray);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.preferredLocations.join(", ")}
            />
            {formik.touched.preferredLocations &&
            formik.errors.preferredLocations ? (
              <div className="text-red-500 text-sm">
                {formik.errors.preferredLocations.toString()}
              </div>
            ) : null}
          </div>

          {/* Total Experience */}
          <div className="space-y-2">
            <label
              htmlFor="totalExperience"
              className="text-gray-400 font-medium"
            >
              Total Experience (years)
            </label>
            <input
              id="totalExperience"
              name="totalExperience"
              type="number"
              min="0"
              step="0.5"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.totalExperience ?? formik.values.totalExperience ?? ""}
            />
            {formik.touched.totalExperience && formik.errors.totalExperience ? (
              <div className="text-red-500 text-sm">
                {formik.errors.totalExperience.toString()}
              </div>
            ) : null}
          </div>

          {/* Relevant Experience */}
          <div className="space-y-2">
            <label
              htmlFor="relevantExperience"
              className="text-gray-400 font-medium"
            >
              Relevant Experience (years)
            </label>
            <input
              id="relevantExperience"
              name="relevantExperience"
              type="number"
              min="0"
              step="0.5"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.relevantExperience ?? formik.values.relevantExperience ?? ""}
            />
            {formik.touched.relevantExperience &&
            formik.errors.relevantExperience ? (
              <div className="text-red-500 text-sm">
                {formik.errors.relevantExperience.toString()}
              </div>
            ) : null}
          </div>

          {/* Communication Skills Rating */}
          <div className="space-y-2">
            <label
              htmlFor="communicationSkillsRating"
              className="text-gray-400 font-medium"
            >
              Communication Rating (0-10)
            </label>
            <input
              id="communicationSkillsRating"
              name="communicationSkillsRating"
              type="number"
              min="0"
              max="10"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.communicationSkillsRating ?? formik.values.communicationSkillsRating ?? ""}
            />
            {formik.touched.communicationSkillsRating &&
            formik.errors.communicationSkillsRating ? (
              <div className="text-red-500 text-sm">
                {formik.errors.communicationSkillsRating.toString()}
              </div>
            ) : null}
          </div>

          {/* Technical Skills Rating */}
          <div className="space-y-2">
            <label
              htmlFor="technicalSkillsRating"
              className="text-gray-400 font-medium"
            >
              Technical Rating (0-10)
            </label>
            <input
              id="technicalSkillsRating"
              name="technicalSkillsRating"
              type="number"
              min="0"
              max="10"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.technicalSkillsRating ?? formik.values.technicalSkillsRating ?? ""}
            />
            {formik.touched.technicalSkillsRating &&
            formik.errors.technicalSkillsRating ? (
              <div className="text-red-500 text-sm">
                {formik.errors.technicalSkillsRating.toString()}
              </div>
            ) : null}
          </div>

          {/* Notice Period */}
          <div className="space-y-2">
            <label htmlFor="noticePeriod" className="text-gray-400 font-medium">
              Notice Period (days)
            </label>
            <input
              id="noticePeriod"
              name="noticePeriod"
              type="number"
              min="0"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.noticePeriod ?? formik.values.noticePeriod ?? ""}
            />
            {formik.touched.noticePeriod && formik.errors.noticePeriod ? (
              <div className="text-red-500 text-sm">
                {formik.errors.noticePeriod.toString()}
              </div>
            ) : null}
          </div>

          {/* Current CTC */}
          <div className="space-y-2">
            <label htmlFor="currentCTC" className="text-gray-400 font-medium">
              Current CTC ($)
            </label>
            <input
              id="currentCTC"
              name="currentCTC"
              type="number"
              min="0"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentCTC ?? formik.values.currentCTC ?? ""}
            />
            {formik.touched.currentCTC && formik.errors.currentCTC ? (
              <div className="text-red-500 text-sm">
                {formik.errors.currentCTC.toString()}
              </div>
            ) : null}
          </div>

          {/* Expected CTC */}
          <div className="space-y-2">
            <label htmlFor="expectedCTC" className="text-gray-400 font-medium">
              Expected CTC ($)
            </label>
            <input
              id="expectedCTC"
              name="expectedCTC"
              type="number"
              min="0"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.expectedCTC ?? formik.values.expectedCTC ?? ""}
            />
            {formik.touched.expectedCTC && formik.errors.expectedCTC ? (
              <div className="text-red-500 text-sm">
                {formik.errors.expectedCTC.toString()}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-1 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Candidates
          </button>
          <button className="px-4 py-1 ml-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={autoClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
