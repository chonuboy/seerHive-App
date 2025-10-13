import { useField } from "formik";
import { useRef, useState } from "react";
import { updateAddJobFormData } from "@/Features/job-slice";
import { useDispatch, useSelector } from "react-redux";
import { Upload, FileText, X } from "lucide-react";
import { uploadJD } from "@/api/client/clientJob";
import { toast } from "react-toastify";
import QuillEditor from "@/components/Elements/utils/QuilEditor";

// Quill CSS once globally
import "quill/dist/quill.snow.css";

export default function Step3JobDescription() {
  const dispatch = useDispatch();
  const formData = useSelector((s: any) => s.job.formData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jdField, jdMeta] = useField("jobDescription");
  const [, jdFileMeta, jdFileHelpers] = useField("jd");
  const [jobDescriptionDoc, setJobDescriptionDoc] = useState<File | null>(null);

  const handleInputChange = (field: string, value: any) =>
    dispatch(updateAddJobFormData({ [field]: value }));

  // Allowed file types
  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];

  // File validation function
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(`Invalid file type. Please upload ${ALLOWED_FILE_EXTENSIONS.join(', ')} files only.`, {
        position: "top-right"
      });
      return false;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size too large. Please upload files smaller than 5MB.", {
        position: "top-right"
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = (file: File) => {
    // Validate file before upload
    if (!validateFile(file)) {
      return;
    }

    uploadJD({
      file: file,
    }).then((res) => {
      console.log(res);
      toast.success("File uploaded successfully", { position: "top-right" });
      dispatch(updateAddJobFormData({ jd: res }));
      jdFileHelpers.setValue(res);
    }).catch((error) => {
      toast.error(`Upload failed: ${error.message}`, { position: "top-right" });
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      setJobDescriptionDoc(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (ALLOWED_FILE_TYPES.includes(file.type)) {
        handleFileUpload(file);
      } else {
        toast.error(`Invalid file type. Please upload ${ALLOWED_FILE_EXTENSIONS.join(', ')} files only.`, {
          position: "top-right"
        });
      }
    }
  };

  const clearFile = () => {
    dispatch(updateAddJobFormData({ jd: null }));
    jdFileHelpers.setValue(null);
    setJobDescriptionDoc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------- render ---------------- */
  const fileInfo = formData.jd;
  const isFile = !!fileInfo;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-medium text-cyan-500 mb-6">
        Job Description
      </h2>

      {/* ------------ Quill Editor ------------- */}
      <div>
        <QuillEditor
          value={formData.jobDescription}
          onChange={(html) => {
            jdField.onChange({
              target: { name: "jobDescription", value: html },
            });
            handleInputChange("jobDescription", html);
          }}
          height={300}
        />
        {jdMeta.error && (
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
            <span>{jdMeta.error}</span>
          </div>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="text-2xl font-medium text-cyan-500 mb-8">
          Upload JD File <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex items-center">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex-1 ${
              formData.jd
                ? "border-green-300 bg-green-50"
                : jdFileMeta.touched && jdFileMeta.error
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            } border-dashed border-2 rounded-md px-6 pt-5 pb-6`}
          >
            <div className="space-y-1 text-center">
              {!jobDescriptionDoc ? (
                <>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        data-testid="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInputChange}
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
                        {jobDescriptionDoc.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(jobDescriptionDoc.size / 1024).toFixed(2)} KB
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
                </div>
              )}
            </div>
          </div>
        </div>
        {jdFileMeta.error && (
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
            <span>{jdFileMeta.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}