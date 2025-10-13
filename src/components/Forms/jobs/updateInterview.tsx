import { useState, useEffect, useRef } from "react";
import { Edit, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { updateInterviewRound } from "@/api/interviews/InterviewRounds";
import { uploadImageSnapForRound } from "@/api/interviews/InterviewRounds"; // Import the new API function
import { useFormik } from "formik";
import { interviewFormSchema } from "@/lib/models/candidate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid } from "date-fns";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import CancelButton from "@/components/Elements/utils/CancelButton";
import {
  Calendar,
  ChevronDown,
  Code,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
} from "lucide-react";
import {
  createInterviewTech,
  deleteInterviewTech,
  updateInterviewTech,
} from "@/api/interviews/Interview-Tech";
import {
  createTechnology,
  fetchAllTechnologies,
} from "@/api/master/masterTech";

// Rating Selection Modal Component
const RatingSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  technologyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rating: number) => void;
  technologyName: string;
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedRating);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Rate {technologyName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
            Select Rating
          </label>
          <div className="flex items-center justify-center space-x-12 mb-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setSelectedRating(rating)}
                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                  selectedRating === rating
                    ? "font-semibold border-2 border-cyan-500 bg-cyan-50"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 text-sm flex-1 sm:flex-none border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-md hover:bg-cyan-600 transition-colors"
          >
            Confirm Rating
          </button>
        </div>
      </div>
    </div>
  );
};

// Image Upload Modal Component
const ImageUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  roundId,
  isUploading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  roundId: number;
  isUploading?: boolean;
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first", { position: "top-right" });
      return;
    }

    await onUpload(selectedImage);
    
    // Reset state after successful upload
    resetImageSelection();
  };

  const resetImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetImageSelection();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Interview Image</h3>
          <button
            onClick={handleClose}
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
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
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
  );
};

export default function InterviewForm({
  className,
  masterTechnologies = [],
  initialValues,
  id,
  autoClose,
  technologiesData = [],
}: {
  className?: string;
  initialValues: any;
  id: number;
  masterTechnologies: any;
  autoClose: () => void;
  technologiesData?: any[];
}) {
  const [selectedSoftRating, setSelectedSoftRating] = useState<number | null>(
    null
  );
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [showAddTech, setShowAddTech] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMasterTechs, setFilteredMasterTechs] = useState<any[]>([]);
  const [editingTech, setEditingTech] = useState<number | null>(null);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    selectedTech: any | null;
  }>({
    isOpen: false,
    selectedTech: null,
  });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialValues.softskillsRating) {
      setSelectedSoftRating(initialValues.softskillsRating);
    }
  }, [initialValues]);

  // Process technologies data from API response
  useEffect(() => {
    if (technologiesData && technologiesData.length > 0) {
      const processedTechs = technologiesData.map((item) => ({
        interviewTechId: item.interviewTechId,
        technology: {
          techId: item.technology.techId,
          technology: item.technology.technology,
          insertedOn: item.technology.insertedOn,
        },
        techRating: item.techRating || item.interviewRound?.techRating || null,
      }));
      setTechnologies(processedTechs);
    }
  }, [technologiesData]);

  // Filter master technologies based on search term and exclude already added ones
  useEffect(() => {
    const existingTechIds = technologies.map((tech) => tech.technology.techId);
    const filtered = masterTechnologies.filter(
      (tech: any) =>
        !existingTechIds.includes(tech.techId) &&
        tech.technology.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMasterTechs(filtered);
  }, [masterTechnologies, technologies, searchTerm]);

  const getUpdatedFields = (initialValues: any, values: any) => {
    return Object.keys(values).reduce((acc: Record<string, any>, key) => {
      if (values[key] !== initialValues[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: interviewFormSchema,
    onSubmit: (values) => {
      const updatedFields = getUpdatedFields(initialValues, values);
      delete updatedFields.interview;
      delete updatedFields.interviewImageSnapshot;

      // If status is "Scheduled" or "Cancelled", remove rating fields from submission
      if (
        values.interviewStatus === "SCHEDULED" ||
        values.interviewStatus === "CANCELLED"
      ) {
        delete updatedFields.softskillsRating;
        delete updatedFields.techRating;
      }
      console.log(updatedFields);
      try {
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
          autoClose();
          return;
        }
        updateInterviewRound(id, updatedFields).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Interview updated successfully", {
              position: "top-right",
            });
            autoClose();
          } else {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        });
      } catch (error) {
        console.error("Form submission error", error);
      }
    },
  });

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
      formik.setFieldValue("softskillsRating", null);

      // Delete all technologies when status is changed to "Cancelled" or "Scheduled"
      if (technologies.length > 0) {
        technologies.forEach((tech) => {
          handleTechDelete(tech.interviewTechId);
        });
      }
    }
  };

  const handleTechRatingUpdate = async (
    interviewTechId: number,
    rating: number
  ) => {
    try {
      const response = await updateInterviewTech(interviewTechId, {
        techRating: rating,
      });
      if (response) {
        setTechnologies((prev) =>
          prev.map((tech) =>
            tech.interviewTechId === interviewTechId
              ? { ...tech, techRating: rating }
              : tech
          )
        );
        setEditingTech(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTechDelete = async (interviewTechId: number) => {
    console.log(interviewTechId);
    try {
      const response = await deleteInterviewTech(interviewTechId);
      if (response) {
        setTechnologies((prev) =>
          prev.filter((tech) => tech.interviewTechId !== interviewTechId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTechnologyClick = (masterTech: any) => {
    if (technologies.some((t) => t.technology.techId === masterTech.techId)) {
      toast.error("Technology already added", { position: "top-center" });
      return;
    }

    // Open rating modal instead of directly adding
    setRatingModal({
      isOpen: true,
      selectedTech: masterTech,
    });
    setSearchTerm("");
  };

  const handleConfirmRating = async (rating: number) => {
    if (!ratingModal.selectedTech) return;

    try {
      const reqData = {
        technology: {
          techId: ratingModal.selectedTech.techId,
        },
        interviewRound: {
          roundId: id,
        },
        techRating: rating,
      };

      const response = await createInterviewTech(reqData);
      console.log(response);

      const newTech = {
        interviewTechId: response.data?.interviewTechId || Date.now(), // Use actual ID from response or temporary
        technology: {
          techId: ratingModal.selectedTech.techId,
          technology: ratingModal.selectedTech.technology,
          insertedOn: ratingModal.selectedTech.insertedOn,
        },
        techRating: rating,
      };

      setTechnologies((prev) => [...prev, newTech]);
      setShowAddTech(false);
      toast.success("Technology added successfully");
    } catch (error) {
      console.error("Error adding technology:", error);
      toast.error("Failed to add technology");
    }
  };

  const addNewTechnology = () => {
    createTechnology({
      technology: searchTerm,
    }).then((data) => {
      if (data.technology) {
        fetchAllTechnologies().then((data) => {
          masterTechnologies = data;
        });
        handleAddTechnologyClick(data);
      }
      console.log(data);
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadImageSnapForRound(file, id);
      console.log(result);
      
      // Update the form field with the uploaded image info
      toast.success("Image uploaded successfully", { position: "top-right" });
      setShowImageUpload(false);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image", { position: "top-right" });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("interviewImageSnapshot", null);
    toast.info("Image removed", { position: "top-right" });
  };

  const isScheduled = formik.values.interviewStatus === "SCHEDULED";
  const isCancelled = formik.values.interviewStatus === "CANCELLED";

  return (
    <div className="my-8">
      {/* Rating Selection Modal */}
      <RatingSelectionModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, selectedTech: null })}
        onConfirm={handleConfirmRating}
        technologyName={ratingModal.selectedTech?.technology || ""}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={handleImageUpload}
        roundId={id}
        isUploading={isUploading}
      />

      <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">
            Update Interview Round
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form className="p-8 space-y-8" onSubmit={formik.handleSubmit}>
            {/* Basic Details Section */}
            <div>
              <h2 className="text-xl font-medium text-cyan-500 mb-6">
                Basic Details
              </h2>
              <div className="space-y-8">
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
                      className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    />
                  </div>
                  {formik.touched.interviewerName &&
                    formik.errors.interviewerName && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.interviewerName.toString()}
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-4 z-10 w-4 h-4" />
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
                        className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none appearance-none pl-10"
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </div>
                    {formik.touched.roundDate && formik.errors.roundDate && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.roundDate.toString()}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className="block font-semibold mb-2"
                      htmlFor="interviewTime"
                    >
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        id="interviewTime"
                        name="interviewTime"
                        value={formik.values.interviewTime}
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
                        className="w-60 border-0 py-3 border-b border-gray-300 focus:border-blue-500 focus:ring-0 placeholder-gray-400 focus:outline-none"
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

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <span>
                            {formik.errors.interviewStatus.toString()}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Image Upload Section - Only show if not scheduled */}
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

            {/* Assessment Section */}
            <div>
              <h2 className="text-xl font-medium text-cyan-500 mb-6">
                Assessment
              </h2>

              {/* Technologies Section - Tag/Chip Style - Only show if not scheduled or cancelled */}
              {!isScheduled && !isCancelled && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-semibold text-gray-700">
                      Technologies Interviewed
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddTech(!showAddTech)}
                      className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors font-medium flex items-center gap-1"
                    >
                      Add Technology
                    </button>
                  </div>

                  {/* Add Technology Input */}
                  {showAddTech && (
                    <div className="mb-4 relative">
                      <input
                        type="text"
                        placeholder="Type to search and add technologies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddTech(false);
                          setSearchTerm("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Search Results Dropdown */}
                      {filteredMasterTechs.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {filteredMasterTechs.map((tech) => (
                            <button
                              key={tech.techId}
                              type="button"
                              onClick={() => handleAddTechnologyClick(tech)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-cyan-50 hover:text-cyan-700 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {tech.technology}
                            </button>
                          ))}
                        </div>
                      )}

                      {filteredMasterTechs.length === 0 && searchTerm && (
                        <div
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 text-center cursor-pointer text-sm text-gray-500"
                          onClick={addNewTechnology}
                        >
                          Add New Technology "{searchTerm}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Technologies as Tags/Chips */}
                  {technologies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <div
                          key={tech.interviewTechId}
                          className="relative group"
                        >
                          {editingTech === tech.interviewTechId ? (
                            // Editing Mode - Rating Selection
                            <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-cyan-500 rounded-md shadow-lg">
                              <span className="text-sm font-medium text-gray-900 mr-1">
                                {tech.technology.technology}
                              </span>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() =>
                                      handleTechRatingUpdate(
                                        tech.interviewTechId,
                                        rating
                                      )
                                    }
                                    className={`w-6 h-6 rounded-md text-xs font-medium transition-colors ${
                                      tech.techRating === rating
                                        ? "bg-cyan-500 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                                  >
                                    {rating}
                                  </button>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditingTech(null)}
                                className="ml-1 text-red-500 hover:text-red-600 text-sm"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            // Display Mode
                            <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-cyan-500 rounded-md hover:bg-cyan-100 transition-colors">
                              <span className="text-sm font-medium text-gray-900">
                                {tech.technology.technology}
                              </span>
                              {tech.techRating && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500 text-white rounded-full text-xs font-medium">
                                  ★ {tech.techRating}
                                </span>
                              )}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingTech(tech.interviewTechId)
                                  }
                                  className="text-cyan-600 hover:text-cyan-800 text-xs p-1"
                                  title="Edit rating"
                                >
                                  <Edit className="w-4 h-4"></Edit>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleTechDelete(tech.interviewTechId)
                                  }
                                  className="text-white border bg-red-500 border-red-500 rounded-full"
                                  title="Delete"
                                >
                                  <X className="w-3 h-3"></X>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-sm">No technologies added yet</p>
                      <p className="text-xs mt-1">
                        Click "Add Technology" to get started
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Soft Skill Rating - Only show if not scheduled or cancelled */}
              {!isScheduled && !isCancelled && (
                <div className="mb-8 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Soft Skill Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="">
                    <div className="space-x-20">
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
                        <span>{formik.errors.softskillsRating.toString()}</span>
                      </div>
                    )}
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="block font-semibold mb-2" htmlFor="remarks">
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
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.remarks.toString()}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 border-t border-gray-100 pt-6">
              <CancelButton executable={autoClose} />
              <SubmitButton label="Update Round" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}