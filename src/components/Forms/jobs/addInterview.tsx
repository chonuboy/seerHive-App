import { useFormik } from "formik";
import { createInterviewRound } from "@/api/interviews/InterviewRounds";
import { uploadImageSnap } from "@/api/interviews/InterviewRounds";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  ChevronDown,
  X,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { interviewRoundSchema } from "@/lib/models/candidate";

export default function AddRound({
  className,
  interviewId,
  onclose,
  roundNumber,
  masterTechnologies,
}: {
  className?: string;
  interviewId?: number | string | string[] | undefined | null;
  onclose: () => void;
  roundNumber?: number;
  masterTechnologies?: any[] | undefined | null;
}) {
  const [selectedTechRating, setSelectedTechRating] = useState<number | null>(
    null
  );
  const [selectedSoftRating, setSelectedSoftRating] = useState<number | null>(
    null
  );
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
  const [techInputValue, setTechInputValue] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      roundDate: "",
      interviewTime: "",
      interviewerName: "",
      interviewStatus: "SCHEDULED",
      techRating: undefined,
      softskillsRating: undefined,
      remarks: "",
      interviewImageSnapshot: null,
      interview: {
        interviewId: interviewId,
      },
    },
    validationSchema: interviewRoundSchema,
    onSubmit: async (values) => {
      try {
        await createInterviewRound(values).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Round added successfully", {
              position: "top-right",
            });
          } else {
            if (
              data.message.includes(
                "Cannot create new round because the last round status is still"
              )
            ) {
              toast.error(
                "Cannot Create New Round Before Clearing Previous Round",
                { position: "top-right" }
              );
            } else {
              toast.error(data.message, { position: "top-right" });
            }
          }
          if (onclose) onclose();
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to add round", { position: "top-right" });
      }
    },
  });

  const handleSoftRatingClick = (rating: number) => {
    setSelectedSoftRating(rating);
    formik.setFieldValue("softskillsRating", rating);
  };

  const handleStatusChange = (status: string) => {
    formik.setFieldValue("interviewStatus", status);
    setShowStatusDropdown(false);

    // Reset ratings when status changes to "Scheduled" or "Cancelled"
    if (status === "SCHEDULED" || status === "CANCELLED") {
      setSelectedSoftRating(null);
      formik.setFieldValue("techRating", null);
      formik.setFieldValue("softskillsRating", null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "PASSED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "ON_HOLD":
        return <PauseCircle className="w-4 h-4 text-yellow-400" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file", { position: "top-right" });
        return;
      }

      // Check file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          position: "top-right",
        });
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first", { position: "top-right" });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImageSnap(selectedImage);

      // Set the uploaded file name to the form field
      formik.setFieldValue("interviewImageSnapshot", result);
      toast.success("Image uploaded successfully", { position: "top-right" });
      setShowImageUpload(false);
      resetImageSelection();
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image", { position: "top-right" });
    } finally {
      setIsUploading(false);
    }
  };

  const resetImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    formik.setFieldValue("interviewImageSnapshot", null);
    toast.info("Image removed", { position: "top-right" });
  };

  const isScheduled = formik.values.interviewStatus === "SCHEDULED";
  const isCancelled = formik.values.interviewStatus === "CANCELLED";

  return (
    <div className={`min-h-screen my-8`}>
      <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">
            Add Interview Round
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <form className="p-8 space-y-8" onSubmit={formik.handleSubmit}>
            {/* Basic Details Section */}
            <div>
              <h2 className="text-lg font-medium text-cyan-500 mb-6">
                Basic Details
              </h2>
              <div className="space-y-6">
                {/* Interviewer Name */}
                <div>
                  <label
                    className="block font-semibold mb-2"
                    htmlFor="interviewerName"
                  >
                    Interviewer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="interviewerName"
                      name="interviewerName"
                      value={formik.values.interviewerName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter full name"
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
                    />
                  </div>
                  {formik.touched.interviewerName &&
                    formik.errors.interviewerName && (
                      <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                        <span>{formik.errors.interviewerName}</span>
                      </div>
                    )}
                </div>
                {/* Date and Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block font-semibold mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={
                          formik.values.roundDate
                            ? parseISO(formik.values.roundDate)
                            : null
                        }
                        onChange={(date: Date | null) => {
                          if (date) {
                            formik.setFieldValue(
                              "roundDate",
                              format(date, "yyyy-MM-dd")
                            );
                          } else {
                            formik.setFieldValue("roundDate", null);
                          }
                        }}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="23-06-2025"
                        className="w-full flex items-center gap-2 py-2 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                      <Calendar className="absolute right-36 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                    </div>
                    {formik.touched.roundDate && formik.errors.roundDate && (
                      <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                        <span>{formik.errors.roundDate.toString()}</span>
                      </div>
                    )}
                  </div>
                  {/* Time */}
                  <div>
                    <label
                      className="block font-semibold mb-1"
                      htmlFor="interviewTime"
                    >
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        id="interviewTime"
                        name="interviewTime"
                        onChange={(e) => {
                          const timeValue = e.target.value;
                          if (timeValue) {
                            const [hours, minutes] = timeValue.split(":");
                            formik.setFieldValue(
                              "interviewTime",
                              `${hours}:${minutes}`
                            );
                          } else {
                            formik.setFieldValue("interviewTime", null);
                          }
                        }}
                        className="w-full flex items-center gap-2 py-2 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none"
                      />
                    </div>
                    {formik.touched.interviewTime &&
                      formik.errors.interviewTime && (
                        <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                          <span>{formik.errors.interviewTime.toString()}</span>
                        </div>
                      )}
                  </div>
                </div>
                {/* Technology and Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label
                      className="block font-semibold mb-2"
                      htmlFor="interviewStatus"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {/* Custom Dropdown */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowStatusDropdown(!showStatusDropdown)
                        }
                        className="w-full flex items-center justify-between gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none text-left"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(formik.values.interviewStatus)}
                          <span>{formik.values.interviewStatus}</span>
                        </div>
                        <ChevronDown className="text-gray-400 w-4 h-4 transition-transform duration-200" />
                      </button>

                      {/* Dropdown Menu */}
                      {showStatusDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {[
                            "SCHEDULED",
                            "PASSED",
                            "REJECTED",
                            "ON_HOLD",
                            "CANCELLED",
                          ].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleStatusChange(status)}
                              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {getStatusIcon(status)}
                              <span>{status}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {formik.touched.interviewStatus &&
                      formik.errors.interviewStatus && (
                        <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                          <span>{formik.errors.interviewStatus}</span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Image Upload Section */}
                {!isScheduled && (
                  <div>
                    <label className="block font-semibold mb-2">
                      Interview Image Snapshot
                    </label>
                    <div className="flex items-center gap-4">
                      {formik.values.interviewImageSnapshot ? (
                        <div className="flex items-center gap-2 p-3 border border-green-200 bg-green-50 rounded-lg">
                          <ImageIcon className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700">
                            Image uploaded:{" "}
                            {formik.values.interviewImageSnapshot}
                          </span>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowImageUpload(true)}
                          className="flex items-center gap-2 px-4 py-2 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assessment Section - Only show if not scheduled or cancelled */}
            {!isScheduled && !isCancelled && (
              <div>
                <h2 className="text-lg font-medium text-cyan-500 mb-6">
                  Assessment
                </h2>
                <div className="space-y-8">
                  {/* Soft Skill Rating */}
                  <div>
                    <label className="block font-semibold mb-4">
                      Soft Skill Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-28">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleSoftRatingClick(rating)}
                            className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                              (selectedSoftRating ||
                                formik.values.softskillsRating) === rating
                                ? "font-semibold border-2 border-cyan-500"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                    {formik.touched.softskillsRating &&
                      formik.errors.softskillsRating && (
                        <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                          <span>{formik.errors.softskillsRating}</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Remarks */}
            <div>
              <label htmlFor="remarks" className="block font-semibold mb-2">
                Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                name="remarks"
                id="remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your observations"
                rows={4}
                className="w-full px-2 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm resize-none"
              />
              {formik.touched.remarks && formik.errors.remarks && (
                <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                  <span>{formik.errors.remarks}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  onclose();
                  formik.resetForm();
                }}
                className="px-6 py-2.5 border border-cyan-500 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
              >
                Add New Round
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Upload Popup */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Interview Image</h3>
              <button
                onClick={() => {
                  setShowImageUpload(false);
                  resetImageSelection();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Image File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preview
                  </label>
                  <div className="border border-gray-300 rounded-lg p-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowImageUpload(false);
                    resetImageSelection();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={!selectedImage || isUploading}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
