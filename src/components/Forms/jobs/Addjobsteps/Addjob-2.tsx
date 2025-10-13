import { useField } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateAddJobFormData } from "@/Features/job-slice";

export default function Step2Preferences() {
  const dispatch = useDispatch();
  const formData = useSelector((state: any) => state.job.formData);

  // Formik field hooks
  const [minimumexperienceField, minexperienceMeta] = useField("minimumExperience");
  const [maximumexperienceField, maxexperienceMeta] = useField("maximumExperience");
  const [salaryInCtcField, salaryInCtcMeta] = useField("salaryInCtc");
  const [preferredJobModeField, preferredJobModeMeta] =
    useField("preferredJobMode");
  const [hiringTypeField, hiringTypeMeta] = useField("hiringType");
  const [jobPostTypeField, jobPostTypeMeta] = useField("jobPostType");
  const [numberOfOpeningsField, numberOfOpeningsMeta] = useField("noOfOpenings");

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateAddJobFormData({ [field]: value }));
  };

  const handleRadioChange = (field: string, value: string) => {
    dispatch(updateAddJobFormData({ [field]: value }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-medium text-cyan-500 mb-8">Preferences</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-3" htmlFor="experience">
              Minimum Experience (years) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...minimumexperienceField}
                value={formData.minimumExperience}
                id="minimumExperience"
                onChange={(e) => {
                  minimumexperienceField.onChange(e);
                  handleInputChange("minimumExperience", e.target.value);
                }}
                placeholder="Enter minimum experience in years"
                onBlur={minimumexperienceField.onBlur}
                className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              />
              {minexperienceMeta.error && (
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
                  <span>{minexperienceMeta.error}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-3" htmlFor="experience">
              Maximum Experience (years)
            </label>
            <div className="relative">
              <input
                {...maximumexperienceField}
                value={formData.maximumExperience}
                id="maximumExperience"
                onChange={(e) => {
                  maximumexperienceField.onChange(e);
                  handleInputChange("maximumExperience", e.target.value);
                }}
                placeholder="Enter maximum experience in years"
                onBlur={maximumexperienceField.onBlur}
                className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              />
              {maxexperienceMeta.error && (
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
                  <span>{maxexperienceMeta.error}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-3" htmlFor="salaryInCtc">
              Budget (LPA) <span className="text-red-500">*</span>
            </label>
            <div>
              <input
                {...salaryInCtcField}
                type="number"
                id="salaryInCtc"
                min={0}
                value={formData.salaryInCtc}
                onChange={(e) => {
                  salaryInCtcField.onChange(e);
                  handleInputChange("salaryInCtc", e.target.value);
                }}
                onBlur={salaryInCtcField.onBlur}
                placeholder="Enter amount"
                className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              />
              {salaryInCtcMeta.error && (
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
                  <span>{salaryInCtcMeta.error}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-3" htmlFor="salaryInCtc">
              No. of Openings <span className="text-red-500">*</span>
            </label>
            <div>
              <input
                {...numberOfOpeningsField}
                type="number"
                id="noOfOpenings"
                min={1}
                value={formData.noOfOpenings}
                onChange={(e) => {
                  numberOfOpeningsField.onChange(e);
                  handleInputChange("noOfOpenings", e.target.value);
                }}
                onBlur={numberOfOpeningsField.onBlur}
                placeholder="Enter Count"
                className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
              />
              {numberOfOpeningsMeta.error && (
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
                  <span>{numberOfOpeningsMeta.error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Preferred Job Mode */}
          <div>
            <label
              className="block font-semibold mb-3"
              htmlFor="preferredJobMode"
            >
              Preferred Job Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 py-2 gap-2 sm:grid-cols-3 sm:gap-8">
              {["FullTime", "PartTime", "Contract"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={preferredJobModeField.name}
                    value={type}
                    checked={formData.preferredJobMode === type}
                    onChange={() => {
                      preferredJobModeField.onChange({
                        target: {
                          value: type,
                          name: preferredJobModeField.name,
                        },
                      });
                      handleRadioChange("preferredJobMode", type);
                    }}
                    onBlur={preferredJobModeField.onBlur}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.preferredJobMode === type
                        ? "border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.preferredJobMode === type && (
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>
            {/* <div className="border-0 border-b border-gray-300 mt-2"></div> */}
            {preferredJobModeMeta.error && (
              <div className="flex items-center mt-2 gap-1 text-red-600 font-medium">
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
                <span>{preferredJobModeMeta.error}</span>
              </div>
            )}
          </div>

          {/* Hiring Type */}
          <div>
            <label className="block font-semibold mb-3" htmlFor="hiringType">
              Hiring Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 py-2 gap-2 sm:grid-cols-3 sm:gap-8">
              {["Onsite", "Remote", "Hybrid"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={hiringTypeField.name}
                    value={type}
                    checked={formData.hiringType === type}
                    onChange={() => {
                      hiringTypeField.onChange({
                        target: { value: type, name: hiringTypeField.name },
                      });
                      handleRadioChange("hiringType", type);
                    }}
                    onBlur={hiringTypeField.onBlur}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.hiringType === type
                        ? "border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.hiringType === type && (
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>
            {hiringTypeMeta.error && (
              <div className="flex items-center mt-2 gap-1 text-red-600 font-medium">
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
                <span>{hiringTypeMeta.error}</span>
              </div>
            )}
          </div>

          {/* Job Post Type */}
          <div>
            <label className="block font-semibold mb-3" htmlFor="jobPostType">
              Job Post Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 py-2 gap-2 sm:grid-cols-3 sm:gap-8">
              {["New", "Replacement", "Temporary"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={jobPostTypeField.name}
                    value={type}
                    checked={formData.jobPostType === type}
                    onChange={() => {
                      jobPostTypeField.onChange({
                        target: { value: type, name: jobPostTypeField.name },
                      });
                      handleRadioChange("jobPostType", type);
                    }}
                    onBlur={jobPostTypeField.onBlur}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.jobPostType === type
                        ? "border-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.jobPostType === type && (
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>
            {jobPostTypeMeta.error && (
              <div className="flex items-center mt-2 gap-1 text-red-600 font-medium">
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
                <span>{jobPostTypeMeta.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
