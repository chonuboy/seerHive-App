"use client"

import type React from "react"
import { useState } from "react"
import { FieldConfig, FieldStyle } from "@/lib/invoice"

interface FieldStyleEditorProps {
  field: FieldConfig
  onStyleUpdate: (
    fieldId: string,
    styleType: "styleForm" | "styleDisplay" | "labelStyle" | "containerStyle",
    styles: FieldStyle,
  ) => void
  onFieldUpdate: (fieldId: string, updates: Partial<FieldConfig>) => void
}

export const FieldStyleEditor: React.FC<FieldStyleEditorProps> = ({ field, onStyleUpdate, onFieldUpdate }) => {
  const [displayStyles, setDisplayStyles] = useState<FieldStyle>(field.styleDisplay || {})
  const [labelStyles, setLabelStyles] = useState<FieldStyle>(field.labelStyle || {})
  const [containerStyles, setContainerStyles] = useState<FieldStyle>(field.containerStyle || {})
  const [activeStyleTab, setActiveStyleTab] = useState("container")

  const widthOptions = [
    { value: "auto", label: "Auto" },
    { value: "25%", label: "25%" },
    { value: "33.333%", label: "33%" },
    { value: "50%", label: "50%" },
    { value: "66.666%", label: "66%" },
    { value: "75%", label: "75%" },
    { value: "100%", label: "100%" },
    { value: "120px", label: "120px" },
    { value: "150px", label: "150px" },
    { value: "200px", label: "200px" },
    { value: "250px", label: "250px" },
    { value: "300px", label: "300px" },
    { value: "400px", label: "400px" },
    { value: "500px", label: "500px" },
  ]

  const heightOptions = [
    { value: "auto", label: "Auto" },
    { value: "32px", label: "32px (Small)" },
    { value: "40px", label: "40px (Medium)" },
    { value: "48px", label: "48px (Large)" },
    { value: "56px", label: "56px (Extra Large)" },
    { value: "64px", label: "64px" },
    { value: "80px", label: "80px" },
    { value: "100px", label: "100px" },
  ]

  const spacingOptions = [
    { value: "0", label: "None (0)" },
    { value: "4px", label: "4px" },
    { value: "8px", label: "8px" },
    { value: "12px", label: "12px" },
    { value: "16px", label: "16px" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px" },
    { value: "32px", label: "32px" },
  ]

  const fontSizeOptions = [
    { value: "12px", label: "12px (Small)" },
    { value: "14px", label: "14px (Default)" },
    { value: "16px", label: "16px (Medium)" },
    { value: "18px", label: "18px (Large)" },
    { value: "20px", label: "20px" },
    { value: "24px", label: "24px (Heading)" },
    { value: "28px", label: "28px" },
    { value: "32px", label: "32px (Large Heading)" },
  ]

  const borderRadiusOptions = [
    { value: "0", label: "None (0)" },
    { value: "2px", label: "2px (Subtle)" },
    { value: "4px", label: "4px (Small)" },
    { value: "6px", label: "6px (Medium)" },
    { value: "8px", label: "8px (Large)" },
    { value: "12px", label: "12px (Extra Large)" },
    { value: "16px", label: "16px" },
    { value: "50%", label: "50% (Rounded)" },
  ]

  const updateDisplayStyle = (property: keyof FieldStyle, value: string) => {
    const newStyles = { ...displayStyles, [property]: value }
    setDisplayStyles(newStyles)
    onStyleUpdate(field.id, "styleDisplay", newStyles)
  }

  const updateLabelStyle = (property: keyof FieldStyle, value: string) => {
    const newStyles = { ...labelStyles, [property]: value }
    setLabelStyles(newStyles)
    onStyleUpdate(field.id, "labelStyle", newStyles)
  }

  const updateContainerStyle = (property: keyof FieldStyle, value: string) => {
    const newStyles = { ...containerStyles, [property]: value }
    setContainerStyles(newStyles)
    onStyleUpdate(field.id, "containerStyle", newStyles)
  }

  const createDropdownInput = (
    id: string,
    value: string,
    onChange: (value: string) => void,
    options: { value: string; label: string }[],
    placeholder: string,
  ) => (
    <div className="flex gap-2">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )

  const StyleControls = ({
    styles,
    updateStyle,
    type,
  }: {
    styles: FieldStyle
    updateStyle: (property: keyof FieldStyle, value: string) => void
    type: "display" | "label" | "container"
  }) => (
    <div className="space-y-4">
      {type === "container" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Width</label>
            {createDropdownInput(
              `${type}-width`,
              styles.width || "",
              (value) => updateStyle("width", value),
              widthOptions,
              "Custom width",
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Height</label>
            {createDropdownInput(
              `${type}-min-height`,
              styles.minHeight || "",
              (value) => updateStyle("minHeight", value),
              heightOptions,
              "Custom height",
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={styles.color || "#000000"}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="w-16 h-10 p-1 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={styles.color || ""}
              onChange={(e) => updateStyle("color", e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
          {createDropdownInput(
            `${type}-font-size`,
            styles.fontSize || "",
            (value) => updateStyle("fontSize", value),
            fontSizeOptions,
            "Custom size",
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
          <select
            value={styles.fontWeight || "normal"}
            onChange={(e) => updateStyle("fontWeight", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
          <select
            value={styles.fontFamily || "inherit"}
            onChange={(e) => updateStyle("fontFamily", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="inherit">Inherit</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
          </select>
        </div>
      </div>

      {type !== "container" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
            <select
              value={styles.textAlign || "left"}
              onChange={(e) => updateStyle("textAlign", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Transform</label>
            <select
              value={styles.textTransform || "none"}
              onChange={(e) => updateStyle("textTransform", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>
        </div>
      )}

      {type === "container" && (
        <>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display</label>
              <select
                value={styles.display || "block"}
                onChange={(e) => updateStyle("display", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="block">Block</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
              {createDropdownInput(
                `${type}-padding`,
                styles.padding || "",
                (value) => updateStyle("padding", value),
                spacingOptions,
                "Custom padding",
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
              {createDropdownInput(
                `${type}-margin`,
                styles.margin || "",
                (value) => updateStyle("margin", value),
                spacingOptions,
                "Custom margin",
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gap</label>
              {createDropdownInput(
                `${type}-gap`,
                styles.gap || "",
                (value) => updateStyle("gap", value),
                spacingOptions,
                "Custom gap",
              )}
            </div>
          </div>
        </>
      )}

      {type === "display" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={styles.backgroundColor || "#ffffff"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-16 h-10 p-1 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={styles.backgroundColor || ""}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
            <select
              value={styles.lineHeight || "1.5"}
              onChange={(e) => updateStyle("lineHeight", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 (Tight)</option>
              <option value="1.25">1.25 (Snug)</option>
              <option value="1.5">1.5 (Normal)</option>
              <option value="1.75">1.75 (Relaxed)</option>
              <option value="2">2 (Loose)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Style Editor: {field.label}</h3>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
          <select
            value={field.type}
            onChange={(e) => onFieldUpdate(field.id, { type: "select" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="tel">Phone</option>
            <option value="url">URL</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="list">List</option>
          </select>
        </div>
      </div>
      <div className="p-4">
        <div className="w-full">
          <div className="grid grid-cols-3 border-b border-gray-200 mb-4">
            {["container", "display", "label"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStyleTab(tab)}
                className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  activeStyleTab === tab
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeStyleTab === "container" && (
              <StyleControls styles={containerStyles} updateStyle={updateContainerStyle} type="container" />
            )}

            {activeStyleTab === "display" && (
              <StyleControls styles={displayStyles} updateStyle={updateDisplayStyle} type="display" />
            )}

            {activeStyleTab === "label" && (
              <StyleControls styles={labelStyles} updateStyle={updateLabelStyle} type="label" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
