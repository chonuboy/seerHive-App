import { updateContactCertification } from "@/api/candidates/certification"
import type { Certificates, contactCertificate } from "@/lib/models/candidate"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

interface UpdateCertificateProps {
  masterCertificates: Certificates[]
  onClose?: () => void
  onUpdate?: (updatedCertificate: contactCertificate) => void
  contactCertificate: contactCertificate
}

export default function UpdateCandidateCertificate({
  masterCertificates,
  onClose,
  onUpdate,
  contactCertificate,
}: UpdateCertificateProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCertificate, setSelectedCertificate] = useState<Certificates | null>(null)
  const [validFrom, setValidFrom] = useState("")
  const [hasExpiry, setHasExpiry] = useState(false)
  const [validTill, setValidTill] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with existing data
  useEffect(() => {
    if (contactCertificate) {
      // Find the certificate from master list
      const certificate = masterCertificates.find(
        (cert) => cert.certificationId === contactCertificate.certification?.certificationId,
      )

      if (certificate) {
        setSelectedCertificate(certificate)
        setSearchTerm(certificate.certificationName)
      }

      // Set existing values
      setValidFrom(contactCertificate.validFrom || "")
      setHasExpiry(contactCertificate.hasExpiry || false)
      setValidTill(contactCertificate.validTill || "")
    }
  }, [contactCertificate, masterCertificates])

  const availableCertificates = masterCertificates.filter((certificate) =>
    certificate.certificationName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCertificateSelect = (certificate: Certificates) => {
    setSelectedCertificate(certificate)
    setSearchTerm(certificate.certificationName)
    setIsDropdownOpen(false)
  }

  const handleUpdateCertificate = () => {
    if (!selectedCertificate) {
      toast.error("Please select a certificate", {
        position: "top-center",
      })
      return
    }

    if (hasExpiry && !validTill) {
      toast.error("Please provide expiry date when expiry is enabled", {
        position: "top-center",
      })
      return
    }

    if (validFrom && hasExpiry && validTill && new Date(validTill) <= new Date(validFrom)) {
      toast.error("Expiry date must be after valid from date", {
        position: "top-center",
      })
      return
    }

    setIsLoading(true)

    const certificationData = {
      contactCertificationId: contactCertificate.contactCertificationId,
      contactDetails: {
        contactId: contactCertificate.contactDetails?.contactId,
      },
      ...(validFrom && { validFrom }),
      ...(hasExpiry !== undefined && { hasExpiry }),
      ...(hasExpiry && validTill && { validTill }),
    }
    console.log(certificationData)

    updateContactCertification(contactCertificate.contactCertificationId || 1,certificationData)
      .then((res) => {
        console.log(res);
        toast.success("Certificate updated successfully", {
          position: "top-center",
        })
        onClose?.()
      })
      .catch((error) => {
        toast.error("Failed to update certificate", {
          position: "top-center",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleCancel = () => {
    onClose?.()
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Update Certificate</h1>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          Certificate Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            className="space-y-2 w-full bg-white cursor-pointer flex items-center justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <input
              type="text"
              placeholder="Select or type here..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setIsDropdownOpen(true)
              }}
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
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
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {availableCertificates.length > 0 ? (
                availableCertificates.map((certificate) => (
                  <div
                    key={certificate.certificationId}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                    onClick={() => handleCertificateSelect(certificate)}
                  >
                    {certificate.certificationName}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">No certificates found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Certificate Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
            <input
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
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
                  setHasExpiry(e.target.checked)
                  if (!e.target.checked) {
                    setValidTill("")
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
      </div>

      {/* Current Certificate Preview */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Certificate</h3>
        <div className="flex flex-col gap-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium">
          <span className="font-semibold">{contactCertificate.certification?.certificationName}</span>
          <div className="text-xs text-gray-600">
            {contactCertificate.validFrom && <div>Valid from: {contactCertificate.validFrom}</div>}
            {contactCertificate.hasExpiry && contactCertificate.validTill && (
              <div>Valid till: {contactCertificate.validTill}</div>
            )}
            {!contactCertificate.hasExpiry && <div className="text-green-600">No expiry</div>}
            {!contactCertificate.validFrom && !contactCertificate.hasExpiry && (
              <div className="text-gray-500">No validity dates set</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateCertificate}
          disabled={isLoading}
          className="flex-1 sm:flex-none sm:px-8 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Certificate"}
        </button>
      </div>
    </div>
  )
}
