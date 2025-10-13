import React, { useState } from "react";
import { uploadJobDescriptionById } from "@/api/client/clientJob";
import { toast } from "react-toastify";

export default function JobDescriptionUploader({ jobId,autoClose }: { jobId: number,autoClose?:()=>void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    if(file.size > 500000){
      toast.error("File size should be less than 5MB", {
        position: "top-right",
        delay: 500,
      });
      return;
    }

    setUploading(true);
    setError(null);

    try {
      uploadJobDescriptionById(jobId, file).then((res) => {
        console.log(res);
        toast.success("File uploaded successfully", { position: "top-right" });
        setUploading(false);
        setFile(null);
        autoClose && autoClose();
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-lg border mt-16 border-gray-200 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Upload Document</h3>
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
            <span className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleSubmit}
        disabled={uploading || !file}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
          uploading || !file
            ? "bg-gray-400 cursor-not-allowed opacity-70"
            : "flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
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
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
  );
}
