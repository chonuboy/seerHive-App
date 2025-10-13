import {
  createContactCompany,
  deleteContactCompany,
  updateContactCompany,
} from "@/api/candidates/companies";
import { createCompany } from "@/api/master/masterCompany";
import { Companies, Company } from "@/lib/models/client";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddCompanyProps {
  masterCompanies: Company[];
  onCancel?: () => void;
  contactId: any;
  contactCompanies: Companies[];
  onCompanyCreated?: (newCompany: Company) => void;
}

export default function AddCandidateCompany({
  masterCompanies,
  onCancel,
  contactId,
  contactCompanies,
  onCompanyCreated,
}: AddCompanyProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [candidateCompanies, setCandidateCompanies] =
    useState<Companies[]>(contactCompanies);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [isAddingNewCompany, setIsAddingNewCompany] = useState(false);

  const availableCompanies = masterCompanies.filter(
    (company) =>
      !candidateCompanies.some(
        (selected) => selected.company.companyId === company.companyId
      )
  );

  const filteredCompanies = availableCompanies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (companyId: number) => {
    setEditingCompanyId(companyId);
  };

  const handleSaveClick = async (companyToUpdate: Companies) => {
    // Basic validation
    if (!companyToUpdate.joiningDate) {
      toast.error("Joining Date is required.");
      return;
    }
    if (
      companyToUpdate.isCurrentCompany === false &&
      !companyToUpdate.leavingDate
    ) {
      toast.error("Leaving Date is required if not current company.");
      return;
    }
    if (
      companyToUpdate.joiningDate &&
      companyToUpdate.leavingDate &&
      new Date(companyToUpdate.joiningDate) >
        new Date(companyToUpdate.leavingDate)
    ) {
      toast.error("Leaving Date cannot be before Joining Date.");
      return;
    }

    try {
      await updateContactCompany(companyToUpdate.contactCompanyId, {
        joiningDate: companyToUpdate.joiningDate,
        isCurrentCompany: companyToUpdate.isCurrentCompany,
        leavingDate: companyToUpdate.leavingDate,
      });
      setEditingCompanyId(null);
      toast.success("Company details updated successfully!");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company details.");
    }
  };

  const handleCompanySelect = async (company: Company | string) => {
    try {
      let companyToAdd: Company;

      if (typeof company === "string") {
        // Create new company in master list
        setIsAddingNewCompany(true);
        const newCompany = { companyName: company };
        const createdCompany = await createCompany(newCompany);
        companyToAdd = createdCompany;

        // Notify parent component
        if (onCompanyCreated) {
          onCompanyCreated(createdCompany);
        }
      } else {
        // Use existing company
        companyToAdd = company;
      }

      // Check if already added
      if (
        candidateCompanies.some(
          (c) => c.company.companyId === companyToAdd.companyId
        )
      ) {
        toast.error("Company already added");
        return;
      }

      // Add to candidate's companies
      const result = await createContactCompany({
        company: { companyId: companyToAdd.companyId },
        contactDetails: { contactId },
      });

      setCandidateCompanies([...candidateCompanies, result]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company");
    } finally {
      setIsAddingNewCompany(false);
    }
  };

  const handleCompanyRemove = async (companyToRemove: Companies) => {
    try {
      await deleteContactCompany(companyToRemove.contactCompanyId);
      setCandidateCompanies(
        candidateCompanies.filter(
          (c) => c.contactCompanyId !== companyToRemove.contactCompanyId
        )
      );
      toast.success("Company removed successfully");
    } catch (error) {
      console.error("Error removing company:", error);
      toast.error("Failed to remove company");
    }
  };

  const handleFieldChange = (
    companyId: number,
    field: keyof Companies,
    value: any
  ) => {
    setCandidateCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.contactCompanyId === companyId
          ? {
              ...company,
              [field]: value,
              ...(field === "isCurrentCompany" &&
                value && { leavingDate: null }),
            }
          : company
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim() && !filteredCompanies.length) {
      handleCompanySelect(searchTerm.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Add Previous Company
      </h1>

      {/* Company Search and Add */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          Company Name <span className="text-red-500">*</span>
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
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full px-0 py-1 border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-md placeholder-gray-400 focus:outline-none"
            />
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isDropdownOpen && !isAddingNewCompany && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <div
                    key={company.companyId}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                    onClick={() => handleCompanySelect(company)}
                  >
                    {company.companyName}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3">
                  {searchTerm &&
                  !masterCompanies
                    .map((company) => company.companyName)
                    .includes(searchTerm) ? (
                    <div
                      className="cursor-pointer font-medium"
                      onClick={() => handleCompanySelect(searchTerm)}
                    >
                      Add "{searchTerm}"
                    </div>
                  ) : (
                    "Company Already Added"
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Company List */}
      <div className="mb-8">
        {candidateCompanies.length > 0 ? (
          <div className="flex flex-col gap-6">
            {candidateCompanies.map((company) => (
              <div
                key={company.contactCompanyId}
                className="flex flex-col gap-4 p-4 bg-white border-2 border-cyan-400 rounded-lg relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {company.company.companyName}
                  </span>
                  <button
                    onClick={() => handleCompanyRemove(company)}
                    className="absolute -right-2 -top-2"
                    disabled={isAddingNewCompany}
                  >
                    <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500" />
                  </button>
                </div>

                {editingCompanyId === company.contactCompanyId ? (
                  // Edit Mode
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Joining Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={company.joiningDate || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            company.contactCompanyId,
                            "joiningDate",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`leavingDate-${company.contactCompanyId}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Leaving Date
                      </label>
                      <input
                        type="date"
                        id={`leavingDate-${company.contactCompanyId}`}
                        value={company.leavingDate || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            company.contactCompanyId,
                            "leavingDate",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={company.isCurrentCompany === true}
                      />
                    </div>
                    <div className="col-span-full flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={company.isCurrentCompany || false}
                        onChange={(e) =>
                          handleFieldChange(
                            company.contactCompanyId,
                            "isCurrentCompany",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Current Company
                      </label>
                    </div>
                    <div className="col-span-full flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingCompanyId(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveClick(company)}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold">Joining Date:</span>{" "}
                      {company.joiningDate || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Leaving Date:</span>{" "}
                      {company.isCurrentCompany
                        ? "Current"
                        : company.leavingDate || "N/A"}
                    </div>
                    <div className="col-span-full">
                      <span className="font-semibold">Status:</span>{" "}
                      {company.isCurrentCompany ? "Current" : "Previous"}
                    </div>
                    <div className="col-span-full flex justify-end mt-2">
                      <button
                        onClick={() =>
                          handleEditClick(company.contactCompanyId)
                        }
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-4">No companies added yet</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50"
        >
          Cancel
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          Done
        </button>
      </div>
    </div>
  );
}
