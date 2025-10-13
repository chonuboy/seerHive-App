import { useDispatch, useSelector } from "react-redux";
import { updateCandidateFormData } from "@/Features/candidateSlice";
import { useState, useEffect } from "react";
import { uploadImage, uploadResume } from "@/api/candidates/candidates";
import { toast } from "react-toastify";
import { useField } from "formik";

export default function Step2Uploads() {
  const dispatch = useDispatch();
  const formData = useSelector((state: any) => state.candidate.formData);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    formData.image || null
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeField, resumeMeta] = useField("resume");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize from Redux store when component mounts
  useEffect(() => {
    if (formData.image) {
      setProfilePreview(formData.image);
    }
    if (formData.resume) {
      setSuccessMsg("Resume already uploaded");
    }
  }, [formData]);

  const handleImageChange = async (field: string, file: File | null) => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setProfilePreview(preview);
      };
      reader.readAsDataURL(file);

      const response = await uploadImage(file);
      console.log(response);
      if (response) {
        dispatch(updateCandidateFormData({
          image: response,
        }));
      }
    } catch (error) {
      setProfilePreview(null);
      toast.error("Image upload failed. Please try again.", { position: "top-center" });
    }
  };

  const removeProfilePhoto = () => {
    setProfilePreview(null);
    dispatch(updateCandidateFormData({ image: null }));
  };

  const handleUpload = async (event: any) => {
    event.stopPropagation();
    if (!file) return;

    if (file.size > 5000000) { // 5MB in bytes
      setError("File size should be less than 5MB");
      return;
    } else {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const data = await uploadResume(formData);
        setSuccessMsg("File Uploaded Successfully");
        setError(null);
        dispatch(updateCandidateFormData({ resume: data }));
      } catch (err: any) {
        toast.error(err.message, {
          position: "top-center",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccessMsg(null); // Reset success message when new file is selected
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium text-cyan-500 mb-8">Uploads</h2>

      <div className="space-y-8">
        <div>
          <label className="block font-semibold mb-6">Profile Photo</label>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex space-x-4">
              <label className="px-6 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors cursor-pointer">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(
                      "profilePhoto",
                      e.target.files?.[0] || null
                    )
                  }
                  className="hidden"
                />
              </label>
              {(profilePreview || formData.image) && (
                <button
                  type="button"
                  onClick={removeProfilePhoto}
                  className="px-6 py-2 text-cyan-500 hover:text-cyan-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Display your unique identity (Upload a JPG, GIF or PNG file. We
              will resize it to 180 x 180 pixels. Upload file size limit is 2MB)
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Upload Document
          </h3>
        </div>
        <div className="mx-auto p-6 bg-white mt-16 border-gray-200 transition-all duration-300 text-center">
          <div className="mb-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <label className="max-w-full flex flex-col items-center px-4 py-6 text-gray-700  cursor-pointer transition-colors duration-200">
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
                <span className="text-xs text-gray-500">
                  PDF, DOC, DOCX (Max 5MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {error && (
                <div className="flex items-center text-center gap-1 text-red-600 font-medium">
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
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            type="button"
            className={`py-2 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              uploading || !file
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
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
              "Upload"
            )}
          </button>
          {resumeMeta.error && (
            <div className="flex items-center mt-4 gap-1 text-red-600 font-medium">
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
              <span>{resumeMeta.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}