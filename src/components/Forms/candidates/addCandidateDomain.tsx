import {
  createContactDomain,
  deleteContactDomain,
} from "@/api/candidates/domains";
import { createDomain } from "@/api/master/domain";
import { domainDetails, Domains } from "@/lib/models/candidate";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface AddDomainProps {
  masterDomains: domainDetails[];
  onCancel?: () => void;
  contactId: any;
  contactDomains: Domains[];
}

export default function AddCandidateDomain({
  masterDomains,
  onCancel,
  contactId,
  contactDomains,
}: AddDomainProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [candidateDomains, setCandidateDomains] =
    useState<Domains[]>(contactDomains);

  const availableDomains = masterDomains.filter(
    (domain) =>
      !candidateDomains.some(
        (selected) => selected.domain.domainId === domain.domainId
      )
  );

  const filteredDomains = availableDomains.filter((domain) =>
    domain.domainDetails.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDomainSelect = async (domainName: string) => {
    try {
      // Check if domain already exists in candidate's domains
      if (
        candidateDomains.some(
          (domain) =>
            domain.domain.domainDetails.toLowerCase() === domainName.toLowerCase()
        )
      ) {
        toast.error("Domain already added", {
          position: "top-center",
        });
        setSearchTerm("");
        setIsDropdownOpen(false);
        return;
      }

      // Check if domain exists in master domains
      const domainExists = masterDomains.some(
        (domain) =>
          domain.domainDetails.toLowerCase() === domainName.toLowerCase()
      );

      let domainToAdd;
      if (domainExists) {
        // If domain exists, find it in master domains
        domainToAdd = masterDomains.find(
          (domain) =>
            domain.domainDetails.toLowerCase() === domainName.toLowerCase()
        );
      } else {
        // If domain doesn't exist, create it
        const newDomain = {
          domainDetails: domainName,
          // Add other required fields for createDomain API
        };

        // Create the new domain
        const createdDomain = await createDomain(newDomain);
        console.log(createdDomain);
        
        // Update master domains with the new domain
        // Note: You might need to pass setMasterDomains as a prop if you want to update the parent state
        // masterDomains = [...masterDomains, createdDomain];
        
        domainToAdd = createdDomain;
      }

      // Associate the domain with the candidate
      if (domainToAdd) {
        const result = await createContactDomain({
          domain: {
            domainId: domainToAdd.domainId,
          },
          contactDetails: {
            contactId: contactId,
          },
        });
        
        setCandidateDomains([...candidateDomains, result]);
        setSearchTerm("");
        setIsDropdownOpen(false);
        
        toast.success("Domain added successfully", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error adding domain:", error);
      toast.error("Failed to add domain. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleDomainRemove = (domaintoremove: Domains) => {
    deleteContactDomain(domaintoremove.contactDomainId).then((res) => {
      const filtered = candidateDomains.filter(
        (domain) => domain.contactDomainId !== domaintoremove.contactDomainId
      );
      setCandidateDomains(filtered);
    });
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Add Domain</h1>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-700 mb-4">
          Domain Name <span className="text-red-500">*</span>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDomainSelect(searchTerm);
                }
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

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredDomains.length > 0 ? (
                filteredDomains.map((domain) => (
                  <div
                    key={domain.domainId}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700"
                    onClick={() => handleDomainSelect(domain.domainDetails)}
                  >
                    {domain.domainDetails}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 font-medium">
                  {searchTerm ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleDomainSelect(searchTerm)}
                    >
                      Add "{searchTerm}"
                    </div>
                  ) : (
                    "No domains found"
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {candidateDomains.map((domain) => (
            <div
              key={domain.contactDomainId}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-cyan-400 rounded-lg relative text-gray-700 font-medium"
            >
              <span>{domain.domain.domainDetails}</span>
              <button
                onClick={() => handleDomainRemove(domain)}
                className="absolute -right-2 -top-2"
              >
                <X className="w-5 h-5 text-gray-500 bg-white rounded-full border-2 border-gray-500"></X>
              </button>
            </div>
          ))}
        </div>
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