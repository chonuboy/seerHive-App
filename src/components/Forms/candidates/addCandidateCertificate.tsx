import { createContactCertification, deleteContactCertification } from "@/api/candidates/certification";
import { createCertification } from "@/api/master/certification";
import type { Certificates, contactCertificate } from "@/lib/models/candidate";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddCertificateProps {
  masterCertificates: Certificates[];
  onCancel?: () => void;
  contactId: any;
  contactCertificates: contactCertificate[];
}

export default function AddCandidateCertificate({
  masterCertificates,
  onCancel,
  contactId,
  contactCertificates,
}: AddCertificateProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [candidateCertificates, setCandidateCertificates] = useState<contactCertificate[]>(contactCertificates);
  const [validFrom, setValidFrom] = useState("");
  const [hasExpiry, setHasExpiry] = useState(false);
  const [validTill, setValidTill] = useState("");
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificates | null>(null);

  const availableCertificates = masterCertificates.filter(
    (certificate) =>
      !candidateCertificates.some(
        (selected) => selected.certification?.certificationId === certificate.certificationId
      )
  );

  const filteredCertificates = availableCertificates.filter((certificate) =>
    certificate.certificationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCertificateSelect = (certificate: Certificates | string) => {
    if (typeof certificate === 'string') {
      // This is a new certificate name typed by the user
      setSelectedCertificate({
        certificationId: 0, // Temporary ID
        certificationName: certificate
      });
      setSearchTerm(certificate);
    } else {
      // This is an existing certificate from the master list
      setSelectedCertificate(certificate);
      setSearchTerm(certificate.certificationName);
    }
    setIsDropdownOpen(false);
    setIsAddingCertificate(true);
  };

  const handleAddCertificate = async () => {
    try {
      if (!selectedCertificate || searchTerm.length === 0) {
        toast.error("Please select a certificate", {
          position: "top-center",
        });
        return;
      }

      if (hasExpiry && !validTill) {
        toast.error("Please provide expiry date when expiry is enabled", {
          position: "top-center",
        });
        return;
      }

      if (validFrom && hasExpiry && validTill && new Date(validTill) <= new Date(validFrom)) {
        toast.error("Expiry date must be after valid from date", {
          position: "top-center",
        });
        return;
      }

      let certificateToAdd = selectedCertificate;

      // If the certificate doesn't exist in master list (has temporary ID 0)
      if (selectedCertificate.certificationId === 0) {
        const newCertificate = {
          certificationName: selectedCertificate.certificationName,
        };
        const createdCertificate = await createCertification(newCertificate);
        certificateToAdd = createdCertificate;
      }

      const certificationData = {
        certification: {
          certificationId: certificateToAdd.certificationId,
        },
        contactDetails: {
          contactId: contactId,
        },
        ...(validFrom && { validFrom }),
        ...(hasExpiry !== undefined && { hasExpiry }),
        ...(hasExpiry && validTill && { validTill }),
      };

      const result = await createContactCertification(certificationData);
      setCandidateCertificates([...candidateCertificates, result]);
      
      // Reset form
      setSearchTerm("");
      setValidFrom("");
      setHasExpiry(false);
      setValidTill("");
      setIsAddingCertificate(false);
      setSelectedCertificate(null);
      
      toast.success("Certificate added successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error adding certificate:", error);
      toast.error("Failed to add certificate. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleCertificateRemove = async (certificateToRemove: contactCertificate) => {
    try {
      await deleteContactCertification(certificateToRemove.contactCertificationId);
      const filtered = candidateCertificates.filter(
        (certificate) => certificate.contactCertificationId !== certificateToRemove.contactCertificationId
      );
      setCandidateCertificates(filtered);
      toast.success("Certificate removed successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error removing certificate:", error);
      toast.error("Failed to remove certificate. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleCancel = () => {
    setIsAddingCertificate(false);
    setSearchTerm("");
    setValidFrom("");
    setHasExpiry(false);
    setValidTill("");
    setSelectedCertificate(null);
    onCancel?.();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Add Certificates</h1>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          Certificate Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            className="space-y-2 w-full bg-white cursor-pointer flex items-center justify-between"
            onClick={() => !isAddingCertificate && setIsDropdownOpen(!isDropdownOpen)}
          >
            <input
              type="text"
              placeholder="Select or type here..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  handleCertificateSelect(searchTerm.trim());
                }
              }}
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
              readOnly={isAddingCertificate}
            />
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {isDropdownOpen && !isAddingCertificate && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((certificate) => (
                  <div
                    key={certificate.certificationId}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                    onClick={() => handleCertificateSelect(certificate)}
                  >
                    {certificate.certificationName}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3">
                  {searchTerm && !masterCertificates.map((certificate) => certificate.certificationName).includes(searchTerm) ? (
                    <div
                      className="cursor-pointer font-medium"
                      onClick={() => handleCertificateSelect(searchTerm)}
                    >
                      Add "{searchTerm}"
                    </div>
                  ) : (
                    "Certificate Already Added"
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAddingCertificate && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Certificate Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                max={hasExpiry ? validTill : undefined}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Has Expiry Date</label>
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  id="hasExpiry"
                  checked={hasExpiry}
                  onChange={(e) => {
                    setHasExpiry(e.target.checked);
                    if (!e.target.checked) {
                      setValidTill("");
                    }
                  }}
                  className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <label htmlFor="hasExpiry" className="ml-2 text-sm text-gray-700">
                  This certificate expires
                </label>
              </div>
            </div>
          </div>

          {hasExpiry && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid Till</label>
              <input
                type="date"
                value={validTill}
                onChange={(e) => setValidTill(e.target.value)}
                min={validFrom || getTodayDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsAddingCertificate(false);
                setSearchTerm("");
                setSelectedCertificate(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCertificate}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
            >
              Add Certificate
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Certificates</h3>
        {candidateCertificates.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {candidateCertificates.map((certificate) => (
              <div
                key={certificate.contactCertificationId}
                className="flex flex-col gap-1 px-4 py-3 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium min-w-48"
              >
                <span className="font-semibold">{certificate.certification?.certificationName}</span>
                <div className="text-xs text-gray-600">
                  {certificate.validFrom && <div>Valid from: {certificate.validFrom}</div>}
                  {certificate.hasExpiry && certificate.validTill && <div>Valid till: {certificate.validTill}</div>}
                  {!certificate.hasExpiry && <div className="text-green-600">No expiry</div>}
                  {!certificate.validFrom && !certificate.hasExpiry && (
                    <div className="text-gray-500">No validity dates set</div>
                  )}
                </div>
                <button 
                  onClick={() => handleCertificateRemove(certificate)} 
                  className="absolute -right-2 -top-2"
                  aria-label="Remove certificate"
                >
                  <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No certificates added yet</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
}