"use client";

import { Check, Palette, Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  fetchAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../../api/invoice/templatestyling";
import { updateInvoiceTemplate } from "../../api/invoice/invoicetemplate";

interface Theme {
  themeId: string;
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface ThemeCustomizerProps {
  activeTheme: string;
  onThemeChange: (theme: string) => void;
  currentTemplate?: any; // Add current template prop for update operations
  onThemeUpdate?: (themeId: string, themeData: any) => void; // Add callback for theme updates
}

export default function ThemeCustomizer({
  activeTheme,
  onThemeChange,
  currentTemplate,
  onThemeUpdate,
}: ThemeCustomizerProps) {
  const [showCustomTheme, setShowCustomTheme] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingTheme, setUpdatingTheme] = useState<string | null>(null); // Track which theme is being updated
  const [error, setError] = useState<string | null>(null);
  const [customTheme, setCustomTheme] = useState({
    name: "",
    primaryColor: "#1e40af",
    secondaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
  });

  // Fetch templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllTemplates();
      console.log(response);
      if (response && Array.isArray(response.content)) {
        // Transform API response to match our Theme interface
        const transformed = response.content;
        const apiThemes: Theme[] = transformed.map((template: any) => ({
          themeId: template.themeId?.toString() || "1",
          themeName: template.themeName || "Unnamed Theme",
          primaryColor: template.primaryColor || "#1e40af",
          secondaryColor: template.secondaryColor || "#3b82f6",
          backgroundColor: template.backgroundColor || "#ffffff",
          textColor: template.textColor || "#1f2937",
        }));
        setThemes([...apiThemes]);
      }
    } catch (err: any) {
      setError("Failed to load themes");
      console.error("Error loading themes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = async (themeId: string) => {
    // First update the UI immediately for better UX
    onThemeChange(themeId);

    console.log(currentTemplate.templateId);

    console.log(themeId);
    
    // If we have a current template and the selected theme is a custom theme, update it via API
    if (currentTemplate) {
      const response = await updateInvoiceTemplate(currentTemplate.templateId,{
        themeStyle:{
          themeId: themeId
        }
      });
      console.log(response);
    }
  };

  const handleUpdateCurrentTemplateTheme = async (themeId: string) => {
    setUpdatingTheme(themeId);
    setError(null);
    
    try {
      // Find the selected theme data
      const selectedTheme = themes.find(theme => theme.themeId === themeId);
      
      if (!selectedTheme) {
        throw new Error("Selected theme not found");
      }

      // Prepare theme data for update
      const themeData = {
        themeName: selectedTheme.themeName,
        primaryColor: selectedTheme.primaryColor,
        secondaryColor: selectedTheme.secondaryColor,
        backgroundColor: selectedTheme.backgroundColor,
        textColor: selectedTheme.textColor,
      };

      // Extract numeric ID for API call (remove 'custom-' prefix if present)
      const numericId = themeId.replace("custom-", "");
      
      // Update the template with the new theme
      const response = await updateTemplate(parseInt(numericId), themeData);

      if (response) {
        // Notify parent component about the theme update
        if (onThemeUpdate) {
          onThemeUpdate(themeId, themeData);
        }
        
        // Show success feedback
        console.log("Theme updated successfully:", response);
      } else {
        throw new Error("Failed to update theme");
      }
    } catch (err: any) {
      setError("Failed to update theme");
      console.error("Error updating theme:", err);
      
      // Revert to previous theme if update fails
      // You might want to implement a more sophisticated rollback mechanism
    } finally {
      setUpdatingTheme(null);
    }
  };

  const handleCreateCustomTheme = async () => {
    if (!customTheme.name.trim()) {
      setError("Please enter a theme name");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newThemeData = {
        themeName: customTheme.name,
        primaryColor: customTheme.primaryColor,
        secondaryColor: customTheme.secondaryColor,
        backgroundColor: customTheme.backgroundColor,
        textColor: customTheme.textColor,
      };

      const response = await createTemplate(newThemeData);

      if (response && response.themeId) {
        const newTheme: Theme = {
          themeId: `custom-${response.themeId}`,
          ...newThemeData,
        };

        setThemes((prev) => [...prev, newTheme]);
        
        // Automatically select the newly created theme
        onThemeChange(newTheme.themeId);
        
        // If we have a current template, update it with the new theme
        if (currentTemplate) {
          await handleUpdateCurrentTemplateTheme(newTheme.themeId);
        }
        
        setShowCustomTheme(false);
        setCustomTheme({
          name: "",
          primaryColor: "#1e40af",
          secondaryColor: "#3b82f6",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
        });
      } else {
        throw new Error("Failed to create theme");
      }
    } catch (err: any) {
      setError("Failed to create theme");
      console.error("Error creating theme:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTheme = async (themeId: string, themeData: Partial<Theme>) => {
    setLoading(true);
    setError(null);
    try {
      // Extract numeric ID for API call (remove 'custom-' prefix if present)
      const numericId = themeId.replace("custom-", "");
      const response = await updateTemplate(parseInt(numericId), themeData);

      if (response) {
        setThemes((prev) =>
          prev.map((theme) =>
            theme.themeId === themeId ? { ...theme, ...themeData } : theme
          )
        );
        
        // If this is the currently active theme, notify parent
        if (activeTheme === themeId && onThemeUpdate) {
          onThemeUpdate(themeId, themeData);
        }
      } else {
        throw new Error("Failed to update theme");
      }
    } catch (err: any) {
      setError("Failed to update theme");
      console.error("Error updating theme:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    if (!themeId.startsWith("custom-")) {
      setError("Cannot delete default themes");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const numericId = themeId.replace("custom-", "");
      const response = await deleteTemplate(parseInt(numericId));

      if (response) {
        setThemes((prev) => prev.filter((theme) => theme.themeId !== themeId));
        if (activeTheme === themeId) {
          onThemeChange("professional-blue");
        }
      } else {
        throw new Error("Failed to delete theme");
      }
    } catch (err: any) {
      setError("Failed to delete theme");
      console.error("Error deleting theme:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Color Themes</h3>
        <button
          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setShowCustomTheme(!showCustomTheme)}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-red-600 hover:text-red-800 mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-3">
        {themes.map((theme) => (
          <div
            key={theme.themeId}
            className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              activeTheme === theme.themeId
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
                : "border-gray-200 hover:bg-gray-50"
            } ${updatingTheme === theme.themeId ? "opacity-70" : ""}`}
            onClick={() => handleThemeSelect(theme.themeId)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {theme.themeName}
                </h4>
                {updatingTheme === theme.themeId && (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeTheme === theme.themeId && !updatingTheme && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
                {theme.themeId.startsWith("custom-") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTheme(theme.themeId);
                    }}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    disabled={loading || updatingTheme === theme.themeId}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div
                className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: theme.primaryColor }}
                title="Primary Color"
              />
              <div
                className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: theme.secondaryColor }}
                title="Secondary Color"
              />
              <div
                className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: theme.backgroundColor }}
                title="Background Color"
              />
              <div
                className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                style={{ backgroundColor: theme.textColor }}
                title="Text Color"
              />
            </div>
          </div>
        ))}
      </div>

      {showCustomTheme && (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium mb-3 text-gray-900">
            Create Custom Theme
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Theme name"
              value={customTheme.name}
              onChange={(e) =>
                setCustomTheme({ ...customTheme, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={customTheme.primaryColor}
                  onChange={(e) =>
                    setCustomTheme({
                      ...customTheme,
                      primaryColor: e.target.value,
                    })
                  }
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={customTheme.secondaryColor}
                  onChange={(e) =>
                    setCustomTheme({
                      ...customTheme,
                      secondaryColor: e.target.value,
                    })
                  }
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={customTheme.backgroundColor}
                  onChange={(e) =>
                    setCustomTheme({
                      ...customTheme,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={customTheme.textColor}
                  onChange={(e) =>
                    setCustomTheme({
                      ...customTheme,
                      textColor: e.target.value,
                    })
                  }
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateCustomTheme}
                disabled={loading || !customTheme.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                Create Theme
              </button>
              <button
                onClick={() => setShowCustomTheme(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
        <Palette className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">Create Custom Theme</p>
        <button
          className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
          onClick={() => setShowCustomTheme(true)}
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          New Theme
        </button>
      </div>
    </div>
  );
}