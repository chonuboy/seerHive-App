"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateCandidate } from "@/api/candidates/candidates"; // Adjust the import path as needed
import { toast } from "react-toastify";
// import { FaGlobe, FaBloggerB, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Step5SocialLinks() {
  const { formData } = useSelector((state: any) => state.candidate);
  const [candidateId, setCandidateId] = useState<number>(formData.contactId);
  
  // Local state for social links
  const [socialLinks, setSocialLinks] = useState({
    portfolioWebsiteLink: "",
    blog: "",
    github: "",
    linkedin: "",
    twitter: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize with existing form data if available
  useEffect(() => {
    if (formData.contactId) {
      setCandidateId(formData.contactId);
    }
    
    // Set initial values from formData if they exist
    setSocialLinks({
      portfolioWebsiteLink: formData.website || "",
      blog: formData.blog || "",
      github: formData.github || "",
      linkedin: formData.linkedin || "",
      twitter: formData.twitter || ""
    });
  }, [formData]);

  const handleInputChange = async (field: string, value: string) => {
    // Update local state immediately for better UX
    setSocialLinks(prev => ({
      ...prev,
      [field]: value
    }));

    // If we have a candidate ID, update via API
    if (candidateId) {
      setIsLoading(true);
      try {
        const updateData = {
          [field]: value
        };

        const response = await updateCandidate(updateData, candidateId);
        
        if (response.status === 200 || response.status === 201) {
          console.log(`Updated ${field} successfully`);
        } else {
          toast.error(`Failed to update ${field}`, {
            position: "top-center",
          });
          // Revert local state on error
          setSocialLinks(prev => ({
            ...prev,
            [field]: formData[field] || ""
          }));
        }
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        toast.error(`Error updating ${field}`, {
          position: "top-center",
        });
        // Revert local state on error
        setSocialLinks(prev => ({
          ...prev,
          [field]: formData[field] || ""
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBlur = (field: string, value: string) => {
    // Optional: You can also trigger updates on blur for better performance
    if (value !== (formData[field] || "") && candidateId) {
      handleInputChange(field, value);
    }
  };

  return (
    <div className="bg-white rounded-lg px-6 space-y-10">
      <h2 className="text-cyan-600 font-semibold text-lg">Social Links</h2>

      {/* Website */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Website</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaGlobe className="text-gray-400" /> */}
          <input
            value={socialLinks.portfolioWebsiteLink}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, portfolioWebsiteLink: e.target.value }))}
            onBlur={(e) => handleBlur("portfolioWebsiteLink", e.target.value)}
            placeholder="https://myweb.co"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Blog */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Blog</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaBloggerB className="text-gray-400" /> */}
          <input
            value={socialLinks.blog}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, blog: e.target.value }))}
            onBlur={(e) => handleBlur("blog", e.target.value)}
            placeholder="https://www.blog.my_blog_name"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Github */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Github</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaGithub className="text-gray-400" /> */}
          <input
            value={socialLinks.github}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
            onBlur={(e) => handleBlur("github", e.target.value)}
            placeholder="https://github.com/username"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Linkedin */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Linkedin</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaLinkedin className="text-gray-400" /> */}
          <input
            value={socialLinks.linkedin}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
            onBlur={(e) => handleBlur("linkedin", e.target.value)}
            placeholder="https://www.linkedin.com/in/username"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Twitter */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Twitter</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaTwitter className="text-gray-400" /> */}
          <input
            value={socialLinks.twitter}
            onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
            onBlur={(e) => handleBlur("twitter", e.target.value)}
            placeholder="https://twitter.com/username"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-sm text-cyan-600 text-center">
          Updating...
        </div>
      )}

      {/* Save All Button (Optional - if you want manual save instead of auto-save) */}
      {/* <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isLoading}
          className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium disabled:bg-cyan-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Social Links"}
        </button>
      </div> */}
    </div>
  );
}