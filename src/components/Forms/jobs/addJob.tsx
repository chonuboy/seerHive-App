import type React from "react";

import { useState, useRef } from "react";
import { useFormik } from "formik";
import { jobFormSchema } from "@/lib/models/client";
import { createJob, uploadJD } from "@/api/client/clientJob";
import type { ClientInfo } from "@/lib/models/client";
import { FileText, Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import { uploadJobDescriptionById } from "@/api/client/clientJob";
import { fetchAllJobs } from "@/api/client/clientJob";
import { toast } from "react-toastify";
import CancelButton from "@/components/Elements/utils/CancelButton";
import SubmitButton from "@/components/Elements/utils/SubmitButton";

// Dynamic import of JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export const AddJob = ({
  client,
  autoClose,
  newjobId,
  User,
}: {
  client?: ClientInfo | null;
  autoClose: () => void;
  newjobId?: number;
  User?: string;
}) => {
  const [jd, setJobDescription] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobId, setJobId] = useState(0);
  const [jobDescriptionDocName, setJobDescriptionDocName] = useState("");

  const formik = useFormik({
    initialValues: {
      jobCode: null,
      jobTitle: null,
      salaryInCtc: null,
      jd: "",
      experience: "",
      jobDescription: "",
      isJobActive: "",
      jobPostType: "",
      insertedBy:
        User?.replace('"', "").replace('"', "").charAt(0).toUpperCase() +
        "" +
        User?.slice(2, User.length - 1),
      client: {
        clientId: client?.clientId,
      },
    },
    validationSchema: jobFormSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      setIsSubmitting(true);

      try {
        // Process rich text editor content
        if (jd) {
          values.jobDescription = jd
            ?.replace(/\s+style="[^"]*"/g, "")
            .replace(/\s+/g, "")
            .replace(/&nbsp;/g, "");
        }

        // Handle file upload if needed
        if (uploadedFile) {
          // In a real application, you would upload the file to a server
          // and get back a URL or file identifier
          console.log("File to upload:", uploadedFile);

          // For this example, we'll just set the filename
          // values.jd = uploadedFile.name;
          // uploadJobDescription(newjobId, uploadedFile).then((res) => {
          //   console.log(res);
          // });
        }

        // Submit the form

        console.log(values);
        if (
          formik.values.jd === "" ||
          formik.values.jd === null ||
          !uploadedFile
        ) {
          toast.error("Please upload Job description Document", {
            position: "top-right",
          });
          return;
        } else {
          console.log(values);
          createJob(values).then((data) => {
            console.log(data);
            if (data.status === 201) {
              toast.success("Job added successfully", {
                position: "top-right",
              });
              autoClose();
            } else {
              toast.error(data.message, {
                position: "top-right",
              });
            }
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const uploadJobDescription = (uploadedFile: File) => {
    uploadJD({
      file: uploadedFile,
    }).then((res) => {
      toast.success("File uploaded successfully", { position: "top-right" });
      setJobDescriptionDocName(res);
      formik.values.jd = res;
    });
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl mt-14">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Add New Job</h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-6">
          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="Enter job title"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jobTitle || ""}
            />
            {formik.errors.jobTitle && (
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
                <span>{formik.errors.jobTitle.toString()}</span>
              </div>
            )}
          </div>

          {/* Job Code */}
          <div>
            <label
              htmlFor="jobCode"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Job Code
            </label>
            <input
              id="jobCode"
              name="jobCode"
              type="text"
              placeholder="Enter job code"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jobCode || ""}
            />
            {formik.errors.jobCode && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.jobCode.toString()}
              </p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label
              htmlFor="salaryInCtc"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Salary (In CTC) <span className="text-red-500">*</span>
            </label>
            <input
              id="salaryInCtc"
              name="salaryInCtc"
              type="number"
              placeholder="Enter salary"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.salaryInCtc || ""}
            />
            {formik.errors.salaryInCtc && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.salaryInCtc?.toString()}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Experience (In Years) <span className="text-red-500">*</span>
            </label>
            <input
              id="experience"
              name="experience"
              type="number"
              placeholder="Enter experience"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.experience || ""}
            />
            {formik.errors.experience && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.experience?.toString()}
              </p>
            )}
          </div>

          {/* Job Status */}
          <div>
            <label
              htmlFor="isJobActive"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Job Status <span className="text-red-500">*</span>
            </label>
            <select
              id="isJobActive"
              name="isJobActive"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.isJobActive || ""}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="OnHold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>
            {formik.errors.isJobActive && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.isJobActive?.toString()}
              </p>
            )}
          </div>

          {/* Job Post Type */}
          <div>
            <label
              htmlFor="jobPostType"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Job Post Type <span className="text-red-500">*</span>
            </label>
            <select
              id="jobPostType"
              name="jobPostType"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jobPostType || ""}
            >
              <option value="">Select Post Type</option>
              <option value="Replacement">Replacement</option>
              <option value="New">New</option>
              <option value="Temporary">Temporary</option>
            </select>
            {formik.errors.jobPostType && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.jobPostType?.toString()}
              </p>
            )}
          </div>

          {/* Inserted By */}
          <div>
            <label
              htmlFor="insertedBy"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Inserted By
            </label>
            <input
              id="insertedBy"
              name="insertedBy"
              type="text"
              placeholder="Enter name"
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.insertedBy || ""}
            />
            {formik.errors.insertedBy && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.insertedBy?.toString()}
              </p>
            )}
          </div>

          {/* JD File Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload JD File <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center">
              <div
                className={`flex-1 ${
                  uploadedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300"
                } border-dashed border-2 rounded-md px-6 pt-5 pb-6`}
              >
                <div className="space-y-1 text-center">
                  {!uploadedFile ? (
                    <>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 5MB
                      </p>
                      <div className="flex justify-center">
                        <Upload className="h-10 w-10 text-gray-400" />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center relative">
                        <FileText className="h-8 w-8 text-green-500 mr-2" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                          <button
                            type="button"
                            onClick={clearFile}
                            className="ml-2 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 absolute -top-3 -right-7"
                          >
                            <span className="sr-only">Remove file</span>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        className="px-4 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
                        onClick={() => uploadJobDescription(uploadedFile)}
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {formik.errors.jd && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.jd?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Job Description (Editor) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-cyan-500 mb-2">
            Job Description
          </h2>
          <div className="border border-gray-300 rounded-lg p-2">
            <JoditEditor
              value={jd || ""}
              config={{
                height: 300,
                placeholder: "Type job description here...",
                readonly: false,
                showCharsCounter: false,
                showWordsCounter: false,
                showXPathInStatusbar: false,
                buttons:
                  "bold,italic,underline,strikethrough,ul,ol,fontsize,superscript,subscript,spellcheck,speechRecognize,paste,hr,indent,preview",
                buttonsMD:
                  "bold,italic,underline,strikethrough,ul,ol,fontsize,superscript,subscript,spellcheck,speechRecognize,paste,hr,indent,preview",
                buttonsSM:
                  "bold,italic,underline,strikethrough,ul,ol,fontsize,superscript,subscript,spellcheck,speechRecognize,paste,hr,indent,preview",
                buttonsXS:
                  "bold,italic,underline,strikethrough,ul,ol,fontsize,superscript,subscript,spellcheck,speechRecognize,paste,hr,indent,preview",
              }}
              onBlur={(content) => {
                setJobDescription(content);
              }}
              onChange={(content) => {
                formik.values.jobDescription = content;
              }}
            />
          </div>
          {formik.touched.jobDescription && formik.errors.jobDescription && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.jobDescription}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
          <CancelButton executable={autoClose}></CancelButton>
          <SubmitButton label="Submit"></SubmitButton>
        </div>
      </form>
    </div>
  );
};
