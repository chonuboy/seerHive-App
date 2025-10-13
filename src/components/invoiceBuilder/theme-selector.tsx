"use client";

import type React from "react";
import type { ThemeConfig } from "@/lib/invoice";
import { defaultThemes } from "@/lib/models/default-themes";

interface ThemeSelectorProps {
  selectedThemeId?: string;
  onThemeSelect: (theme: ThemeConfig) => void;
  type?: "template" | "field";
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeId,
  onThemeSelect,
  type = "template",
}) => {
  const filteredThemes = defaultThemes.filter((theme) => theme.type === type);

  const sanitizeStyle = (styleObj: Record<string, any> = {}) => {
    const validStyles: Record<string, any> = {};
    for (const [key, value] of Object.entries(styleObj)) {
      if (value == null || value === "") continue;

      // Convert kebab-case -> camelCase
      const reactKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

      validStyles[reactKey] = value;
    }
    return validStyles;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {type === "template" ? "Template Themes" : "Field Themes"}
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredThemes.map((theme) => (
            <div
              key={theme.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedThemeId === theme.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => onThemeSelect(theme)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{theme.name}</span>
                {theme.isDefault && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    Default
                  </span>
                )}
              </div>

              {/* Theme Preview */}
              <div
                className="h-12 rounded border text-xs flex items-center justify-center text-gray-600"
                style={sanitizeStyle(theme.styles)}
              >
                Preview
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
