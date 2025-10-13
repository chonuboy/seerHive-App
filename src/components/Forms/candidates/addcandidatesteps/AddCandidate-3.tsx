"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateCandidateFormData } from "@/Features/candidateSlice";
import { useField } from "formik";

export default function Step3Professional() {
  const dispatch = useDispatch();
  const formData = useSelector((state: any) => state.candidate.formData);

  // Formik field hooks
  const [experienceField, experienceMeta] = useField("totalExperience");
  const [companyField, companyMeta] = useField("companyName");
  const [noticePeriodField, noticePeriodMeta] = useField("noticePeriod");
  const [designationField, designationMeta] = useField("designation");
  const [salaryField, salaryMeta] = useField("currentSalary");
  const [roleField, roleMeta] = useField("techRole");
  const [relevantExpField, relevantExpMeta] = useField("relevantExperience");
  const [currentSalaryField, currentSalaryMeta] = useField("currentSalary");
  const [expectedSalaryField, expectedSalaryMeta] = useField("expectedSalary");
  const [ctcNegotiableField, ctcNegotiableMeta] = useField(
    "isExpectedCtcNegotiable"
  );

  const handleInputChange = (field: string, value: string | number) => {
    dispatch(updateCandidateFormData({ [field]: value }));
  };
  const handleRadioChange = (field: string, value: any) => {
    dispatch(updateCandidateFormData({ [field]: value }));
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-medium text-cyan-500 mb-8">
        Professional Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-3">
            Total Experience (Years) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              {...experienceField}
              value={formData.totalExperience}
              onChange={(e) => {
                experienceField.onChange(e);
                handleInputChange("totalExperience", e.target.value);
              }}
              onBlur={experienceField.onBlur}
              placeholder="Enter total experience"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {experienceMeta.error && (
              <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                <span>{experienceMeta.error}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-3">
            Relevant Experience (Years)
          </label>
          <div className="relative">
            <input
              type="number"
              {...relevantExpField}
              value={formData.relevantExperience}
              onChange={(e) => {
                relevantExpField.onChange(e);
                handleInputChange("relevantExperience", e.target.value);
              }}
              onBlur={relevantExpField.onBlur}
              placeholder="Enter relevant experience"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {relevantExpMeta.error && (
              <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                <span>{relevantExpMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block font-semibold mb-3">
            Designation
          </label>
          <div className="relative">
            <input
              type="text"
              {...designationField}
              value={formData.designation}
              onChange={(e) => {
                designationField.onChange(e);
                handleInputChange("designation", e.target.value);
              }}
              onBlur={designationField.onBlur}
              placeholder="Product Manager"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {designationMeta.error && (
              <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                <span>{designationMeta.error}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-3">
            Tech Role
          </label>
          <div className="relative">
            <input
              type="text"
              {...roleField}
              value={formData.techRole}
              onChange={(e) => {
                roleField.onChange(e);
                handleInputChange("techRole", e.target.value);
              }}
              onBlur={roleField.onBlur}
              placeholder="Enter your current job role"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {roleMeta.error && (
              <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                <span>{roleMeta.error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="block font-semibold mb-3">
            Current Salary (LPA) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...currentSalaryField}
            value={formData.currentSalary}
            onChange={(e) => {
              currentSalaryField.onChange(e);
              handleInputChange("currentSalary", e.target.value);
            }}
            onBlur={currentSalaryField.onBlur}
            placeholder="Min"
            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
          />
          {currentSalaryMeta.error && (
            <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
              <span>{currentSalaryMeta.error}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-3">
            Expected Salary (LPA) <span className="text-red-500">*</span>
          </label>
          <div className="flex-1 relative">
            <input
              type="number"
              {...expectedSalaryField}
              value={formData.expectedSalary}
              onChange={(e) => {
                expectedSalaryField.onChange(e);
                handleInputChange("expectedSalary", e.target.value);
              }}
              onBlur={expectedSalaryField.onBlur}
              placeholder="Min"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
          </div>
          {expectedSalaryMeta.error && (
            <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
              <span>{expectedSalaryMeta.error}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-8">Salary Negotiable?</label>
          <div className="flex flex-wrap gap-6">
            {[true, false].map((option, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={ctcNegotiableField.name}
                  value={formData.isExpectedCtcNegotiable}
                  onChange={(e) => {
                    ctcNegotiableField.onChange(e);
                    handleRadioChange("isExpectedCtcNegotiable", option);
                  }}
                  onBlur={ctcNegotiableField.onBlur}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.isExpectedCtcNegotiable === option
                      ? "border-cyan-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.isExpectedCtcNegotiable === option && (
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  )}
                </div>
                <span className="text-gray-700">
                  {option === true ? "Yes" : "No"}
                </span>
              </label>
            ))}
          </div>
          {ctcNegotiableMeta.error && (
            <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
              <span>{ctcNegotiableMeta.error}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-3">
            Notice Period (Days) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              {...noticePeriodField}
              value={formData.noticePeriod}
              onChange={(e) => {
                noticePeriodField.onChange(e);
                handleInputChange("noticePeriod", e.target.value);
              }}
              onBlur={noticePeriodField.onBlur}
              placeholder="Enter notice period"
              className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
            />
            {noticePeriodMeta.error && (
              <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                <span>{noticePeriodMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
