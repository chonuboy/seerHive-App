import { useEffect, useRef, useState } from "react";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import { RecruitCandidateData } from "@/lib/models/recruitmentCandidate";
import RecruitmentCandidateSchema from "@/lib/models/recruitmentCandidate";
import { useFormik } from "formik";
import { addRecruitmentData, uploadRecruitmentCandidateResume } from "@/api/recruitment/recruitmentData";
import { AlertCircle, IndianRupee, Plus, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import LocationAutocomplete from "@/components/Elements/utils/location-autocomplete";
import { fetchAllLocations } from "../../../api/master/masterLocation";
import { Location } from "@/lib/definitions";
import { set } from "date-fns";
import { useRouter } from "next/router";

export default function CandidateForm() {

  const [resumeName,setResumeName] = useState("");
  const router = useRouter();

  const initialValues: RecruitCandidateData = {
    date: new Date().toISOString().split("T")[0],
    recruiterName: "",
    portal: "",
    candidateName: "",
    role: "",
    primarySkill: "",
    secondarySkill: "",
    contactNumber: "",
    emailID: "",
    totalExperience: 0,
    relevantExperience: 0,
    currentCTC: 0,
    expectedCTC: 0,
    noticePeriod: 0,
    currentLocation: "",
    preferredLocation: "",
    qualification: "",
    communicationSkillsRating: 0,
    technicalSkillsRating: 0,
    remarks: "",
    resumeLink: resumeName,
    sourcingStatus: "",
    preferredRoles: [],
  };

  const [currentPreferredRole, setCurrentPreferredRole] = useState("");
  const [locations, setLocations] = useState([]);
  const [file, setFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updatedFileName, setUpdatedFileName] = useState<string | undefined>(
    undefined
  );
  

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleChooseFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    fileInputRef?.current?.click();
  };

  const handleFileClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const target = event.target;
    if (target && target.type === "file") {
      setFile(target?.files?.[0]);
      setUpdatedFileName(target?.files?.[0]?.name);
      console.log(target?.files?.[0]);
    }
  };

  const handleUpload = async (event: any) => {
    event.stopPropagation();
    const fileName = file?.name;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    try {
      uploadRecruitmentCandidateResume(formData)
        .then((data) => {
          setResumeName(data);
          setUpdatedFileName("File Uploaded Successfully");
      })
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchAllLocations().then((data) => {
      setLocations(data);
    });
  }, []);

  const handleSubmit = (values: RecruitCandidateData) => {
    console.log("Form submitted:", values);
    values.resumeLink = resumeName;
    addRecruitmentData(values).then((data) => {
      toast.success("Candidate Added Successfully", { position: "top-right" });
      router.push("/recruitments");
    }).catch((err) => toast.error(err,{position:"top-right"}));
  };

  const formik = useFormik<RecruitCandidateData>({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: RecruitmentCandidateSchema,
  });

  const onChangeCurrentLocation = (location: Location) => {
    formik.setFieldValue("currentLocation", location.locationDetails);
  };

  const addNewCurrentLocation = async (location: Location) => {
    formik.setFieldValue("currentLocation", location.locationDetails);
  };

  const onChangePreferredLocation = (location: Location) => {
    formik.setFieldValue("preferredLocation", location.locationDetails);
  };

  const addNewPreferredLocation = async (location: Location) => {
    formik.setFieldValue("preferredLocation", location.locationDetails);
  };

  return (
    <>
      <MainLayout>
        <ContentHeader title="Add New Candidate" />
        <div className="min-h-screen transition-all duration-200">
          <div className="">
            <div className="">
              <form className="space-y-6" onSubmit={formik.handleSubmit}>
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-8 bg-white p-6 rounded-md">
                    <h3 className="text-lg sm:text-xl text-cyan-500 border-b-2 pb-2 border-cyan-400 mb-12 flex items-center">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label
                          htmlFor="recruiterName"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Recruiter Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formik.values.recruiterName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name="recruiterName"
                          placeholder="Enter recruiter name"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.recruiterName && formik.touched.recruiterName && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.recruiterName}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="portal" className="block text-lg font-semibold text-gray-700 dark:text-white">
                          Portal <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="portal"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors outline-none"
                          value={formik.values.portal}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <option value="" className="text-gray-400">
                            Select Portal
                          </option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Naukri">Naukri</option>
                          <option value="Indeed">Indeed</option>
                          <option value="Referral">Referral</option>
                          <option value="Other">Other</option>
                        </select>
                        {formik.errors.portal && formik.touched.portal && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.portal}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="candidateName"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Candidate Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formik.values.candidateName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name="candidateName"
                          placeholder="Enter candidate full name"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.candidateName && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.candidateName}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="role" className="block text-lg font-semibold text-gray-700 dark:text-white">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={formik.values.role}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="text"
                          name="role"
                          placeholder="Enter job role/position"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.role && formik.touched.role && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.role}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="qualification"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Qualification <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={formik.values.qualification}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="text"
                          name="qualification"
                          placeholder="Enter highest qualification"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.qualification && formik.touched.qualification && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.qualification}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills & Experience */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-8 bg-white p-6 rounded-md">
                    <h3 className="text-lg sm:text-xl text-cyan-500 border-b-2 pb-2 border-cyan-400 mb-12 flex items-center">
                      Skills & Experience
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label
                          htmlFor="primarySkill"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Primary Skill <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formik.values.primarySkill}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name="primarySkill"
                          placeholder="Comma Seperated"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.primarySkill && formik.touched.primarySkill && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.primarySkill}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="secondarySkill"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Secondary Skill <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formik.values.secondarySkill}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name="secondarySkill"
                          placeholder="Comma Seperated"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.secondarySkill && formik.touched.secondarySkill && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.secondarySkill}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="totalExperience"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Total Experience (Years) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="totalExperience"
                            value={formik.values.totalExperience ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="0"
                            min="0"
                            step="0.5"
                            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">years</span>
                          </div>
                        </div>
                        {formik.errors.totalExperience && formik.touched.totalExperience && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.totalExperience}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="relevantExperience"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Relevant Experience (Years) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="relevantExperience"
                            value={formik.values.relevantExperience ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="0"
                            min="0"
                            step="0.5"
                            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">years</span>
                          </div>
                        </div>
                        {formik.errors.relevantExperience && formik.touched.relevantExperience && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.relevantExperience}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="communicationSkillsRating"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Communication Skills (1-5) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="communicationSkillsRating"
                            value={formik.values.communicationSkillsRating ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            min={1}
                            max={5}
                            placeholder="0"
                            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">/5</span>
                          </div>
                        </div>
                        {formik.errors.communicationSkillsRating && formik.touched.communicationSkillsRating && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.communicationSkillsRating}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="technicalSkillsRating"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Technical Skills (1-5) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="technicalSkillsRating"
                            min={1}
                            max={5}
                            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors outline-none"
                            value={formik.values.technicalSkillsRating ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">/5</span>
                          </div>
                        </div>
                        {formik.errors.technicalSkillsRating && formik.touched.technicalSkillsRating && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.technicalSkillsRating}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Resume */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-8 bg-white p-6 rounded-md">
                    <h3 className="text-lg sm:text-xl text-cyan-500 border-b-2 pb-2 border-cyan-400 mb-12 flex items-center">
                      Upload Resume
                    </h3>
                    <div className="space-y-3 rounded-xl">
                      <div
                        className="mt-2 flex flex-col items-center justify-center w-full p-6 h-40 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <Upload className="w-10 h-10 mb-4 text-gray-500 dark:text-gray-400" />
                        <div className="mb-4 flex text-sm/6 text-gray-500 dark:text-gray-400">
                          <button
                            className="border border-gray-300 px-3 py-1 rounded-md font-semibold bg-white hover:bg-gray-100 transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-white"
                            type="button"
                            onClick={handleChooseFile}
                          >
                            Choose a File
                          </button>
                          <input
                            type="file"
                            name="resume"
                            ref={fileInputRef}
                            accept=".pdf, .doc, .docx"
                            style={{ display: "none" }}
                            onClick={handleFileClick}
                            onChange={handleFileChange}
                          />
                          <p className="pl-2 mt-1">or drag and drop</p>
                        </div>
                        <p className="text-xs/4 text-gray-500 dark:text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                        {file && <p className="mt-2 text-green-500 dark:text-green-400">{updatedFileName}</p>}
                        <button
                          className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          type="button"
                          onClick={handleUpload}
                          disabled={!file || updatedFileName === "File Uploaded Successfully"}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6 bg-white p-6 rounded-md">
                    <h3 className="text-lg sm:text-xl font-medium text-cyan-500 border-b-2 pb-2 border-cyan-400 mb-8 flex items-center">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label
                          htmlFor="contactNumber"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formik.values.contactNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Mobile Number"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.contactNumber && formik.touched.contactNumber && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.contactNumber}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="emailID" className="block text-lg font-semibold text-gray-700 dark:text-white">
                          Email ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="emailID"
                          value={formik.values.emailID}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="candidate@example.com"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        />
                        {formik.errors.emailID && formik.touched.emailID && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.emailID}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="currentLocation"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Current Location <span className="text-red-500">*</span>
                        </label>
                        <LocationAutocomplete
                          name="currentLocation"
                          placeholder="Enter Current Location"
                          value={formik.values.currentLocation}
                          onChange={onChangeCurrentLocation}
                          options={locations}
                          styleMod="w-full flex items-center gap-2 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                          onAdd={addNewCurrentLocation}
                        ></LocationAutocomplete>
                        {formik.errors.currentLocation && formik.touched.currentLocation && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.currentLocation}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="preferredLocation"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Preferred Location <span className="text-red-500">*</span>
                        </label>
                        <LocationAutocomplete
                          name="preferredLocation"
                          placeholder="Enter preferred Location"
                          value={formik.values.preferredLocation}
                          onChange={onChangePreferredLocation}
                          options={locations}
                          styleMod=""
                          onAdd={addNewPreferredLocation}
                        ></LocationAutocomplete>
                        {formik.errors.preferredLocation && formik.touched.preferredLocation && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.preferredLocation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compensation & Notice Period */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6 bg-white p-6 rounded-md">
                    <h3 className="text-lg sm:text-xl font-medium text-cyan-500 border-b-2 pb-2 border-cyan-400 mb-8 flex items-center">
                      Compensation & Availability
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label
                          htmlFor="currentCTC"
                          className="flex items-center text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Current CTC (<IndianRupee className="w-4 h-4 mr-1"></IndianRupee> LPA) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="currentCTC"
                            min="0"
                            value={formik.values.currentCTC ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="800000"
                            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors outline-none"
                          />
                        </div>
                        {formik.errors.currentCTC && formik.touched.currentCTC && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.currentCTC}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="expectedCTC"
                          className="flex items-center text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Expected CTC (<IndianRupee className="w-4 h-4 mr-1"></IndianRupee> LPA) <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="expectedCTC"
                            min="0"
                            value={formik.values.expectedCTC ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="1200000"
                            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors outline-none"
                          />
                        </div>
                        {formik.errors.expectedCTC && formik.touched.expectedCTC && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.expectedCTC}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label
                          htmlFor="noticePeriod"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Notice Period (Days) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="noticePeriod"
                            min="0"
                            value={formik.values.noticePeriod ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="30"
                            className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors outline-none"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-xs">days</span>
                          </div>
                        </div>
                        {formik.errors.noticePeriod && formik.touched.noticePeriod && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.noticePeriod}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferred Roles */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6 bg-white p-6 rounded-md">
                    <h3 className="text-lg sm:text-xl font-medium text-cyan-500 border-b-2 pb-2 border-cyan-400 mb-8 flex items-center">
                      Preferred Roles
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        name="preferredRoles"
                        value={currentPreferredRole}
                        id="preferredRoles"
                        placeholder="Enter preferred roles"
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                        onChange={(e) => {
                          setCurrentPreferredRole(e.target.value)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && currentPreferredRole.trim() !== "") {
                            e.preventDefault() // Prevent form submission
                            const updatedRoles = [...formik.values.preferredRoles, currentPreferredRole.trim()]
                            formik.setFieldValue("preferredRoles", updatedRoles)
                            setCurrentPreferredRole("")
                          }
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          className="text-white text-xs bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200"
                          type="button"
                          onClick={() => {
                            if (currentPreferredRole.trim() !== "") {
                              const updatedRoles = [...formik.values.preferredRoles, currentPreferredRole.trim()]
                              formik.setFieldValue("preferredRoles", updatedRoles)
                              setCurrentPreferredRole("")
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {formik.errors.preferredRoles && formik.touched.preferredRoles && (
                      <div className="text-red-500 text-sm font-medium flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formik.errors.preferredRoles.toString()}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {formik.values.preferredRoles.length > 0 &&
                        formik.values.preferredRoles.map((role, index) => (
                          <div key={index} className="bg-blue-500 py-1 px-4 rounded-md text-white relative text-sm">
                            {role}
                            <X
                              onClick={() => {
                                const updatedRoles = formik.values.preferredRoles.filter((_, i) => i !== index)
                                formik.setFieldValue("preferredRoles", updatedRoles)
                              }}
                              className="w-4 h-4 absolute -top-2 -right-2 cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600"
                            ></X>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6 bg-white p-6 rounded-md">
                    <h3 className="text-lg sm:text-xl font-medium text-cyan-500 border-b-2 pb-2 border-cyan-400 mb-8 flex items-center">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label
                          htmlFor="sourcingStatus"
                          className="block text-lg font-semibold text-gray-700 dark:text-white"
                        >
                          Sourcing Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="sourcingStatus"
                          className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors outline-none"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.sourcingStatus}
                        >
                          <option value="" className="text-gray-400">
                            Select Status
                          </option>
                          <option value="Active">Active</option>
                          <option value="Passive">Inactive</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Hired">Hired</option>
                        </select>
                        {formik.errors.sourcingStatus && formik.touched.sourcingStatus && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.sourcingStatus}
                          </div>
                        )}
                      </div>
                      <div className="lg:col-span-2 space-y-3">
                        <label htmlFor="remarks" className="block text-lg font-semibold text-gray-700 dark:text-white">
                          Remarks <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="remarks"
                          rows={4}
                          value={formik.values.remarks}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter any additional remarks, notes, or observations about the candidate..."
                          className="w-full flex items-center gap-2 py-1 bg-white border-2 rounded-md border-gray-300 focus-within:border-cyan-500 transition-colors outline-none"
                        />
                        {formik.errors.remarks && formik.touched.remarks && (
                          <div className="text-red-500 text-sm font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formik.errors.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <span className="ml-2">Add Candidate</span>
                    <div className="ml-2 w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
      </MainLayout>
    </>
  );
}
