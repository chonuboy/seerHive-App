"use client"

import type React from "react"
import { useState } from "react"
import type { InvoiceTemplate, InvoiceData, FieldStyle, ThemeConfig, FieldConfig, SectionConfig } from "@/lib/invoice"
import { defaultInvoiceTemplate, allInvoiceTemplates } from "@/lib/models/default-templates"
import { defaultThemes } from "@/lib/models/default-themes"
import { FieldRenderer } from "./field-renderer"
import { ThemeSelector } from "./theme-selector"
import { FieldStyleEditor } from "./field-style-editor"
import { Eye, Edit, Download, Palette, GripVertical, FileText, Plus, PlusCircle, Trash2 } from "lucide-react"

export const InvoiceBuilder: React.FC = () => {
  const [template, setTemplate] = useState<InvoiceTemplate>(defaultInvoiceTemplate)
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({})
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(
    defaultThemes.find((t) => t.id === template.themeId) || defaultThemes[0],
  )
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [draggedField, setDraggedField] = useState<{ fieldId: string; sectionId: string } | null>(null)
  const [dragOverField, setDragOverField] = useState<{ fieldId: string; sectionId: string } | null>(null)

  const [templateLayoutStyle, setTemplateLayoutStyle] = useState({
    gridColumns: "1",
    gridGap: "16px",
    sectionSpacing: "32px",
    fieldLayout: "grid",
    fieldColumns: "2",
    fieldGap: "16px",
  })

  const [showNewFieldDialog, setShowNewFieldDialog] = useState(false)
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false)
  const [showNewSectionDialog, setShowNewSectionDialog] = useState(false)
  const [newFieldData, setNewFieldData] = useState({
    label: "",
    type: "text" as const,
    sectionId: "",
    required: false,
  })
  const [newTemplateData, setNewTemplateData] = useState({
    name: "",
    description: "",
  })
  const [newSectionData, setNewSectionData] = useState({
    title: "",
  })

  const [activeTab, setActiveTab] = useState("templates") // Moved to top level

  const handleDataChange = (fieldId: string, value: string | string[]) => {
    setInvoiceData((prev) => ({ ...prev, [fieldId]: value }))
  }

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

  const handleThemeSelect = (theme: ThemeConfig) => {
    setSelectedTheme(theme)
    setTemplate((prev) => ({ ...prev, themeId: theme.id }))
  }

  const handleTemplateSelect = (templateId: string) => {
    const newTemplate = allInvoiceTemplates.find((t) => t.id === templateId)
    if (newTemplate) {
      setTemplate(newTemplate)
      setInvoiceData({}) // Clear existing data when switching templates
      setSelectedFieldId(null)

      // Update theme to match template's default theme
      const templateTheme = defaultThemes.find((t) => t.id === newTemplate.themeId)
      if (templateTheme) {
        setSelectedTheme(templateTheme)
      }
    }
  }

  const handleFieldStyleUpdate = (
    fieldId: string,
    styleType: "styleForm" | "styleDisplay" | "labelStyle" | "containerStyle",
    styles: FieldStyle,
  ) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => (field.id === fieldId ? { ...field, [styleType]: styles } : field)),
      })),
    }))
  }

  const handleFieldUpdate = (fieldId: string, updates: Partial<FieldConfig>) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
      })),
    }))
  }

  const handleAddField = () => {
    if (!newFieldData.label || !newFieldData.sectionId) return

    const fieldId = `field_${Date.now()}`
    const targetSection = template.sections.find((s) => s.id === newFieldData.sectionId)
    if (!targetSection) return

    const newField: FieldConfig = {
      id: fieldId,
      label: newFieldData.label,
      type: newFieldData.type,
      required: newFieldData.required,
      placeholder: `Enter ${newFieldData.label.toLowerCase()}`,
      styleForm: { width: "100%" },
      styleDisplay: {},
    }

    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === newFieldData.sectionId ? { ...section, fields: [...section.fields, newField] } : section,
      ),
    }))

    setNewFieldData({ label: "", type: "text", sectionId: "", required: false })
    setShowNewFieldDialog(false)
  }

  const handleCreateTemplate = () => {
    if (!newTemplateData.name) return

    const templateId = `template_${Date.now()}`
    const newTemplate: InvoiceTemplate = {
      id: templateId,
      name: newTemplateData.name,
      description: newTemplateData.description,
      themeId: selectedTheme.id,
      sections: [
        {
          id: "basic_info",
          title: "Basic Information",
          order: 0,
          fields: [
            {
              id: "invoice_number",
              label: "Invoice Number",
              type: "text",
              required: true,
              placeholder: "Enter invoice number",
              styleForm: { width: "100%" },
              styleDisplay: {},
            },
          ],
        },
      ],
    }

    // Add to templates list (in real app, this would save to database)
    allInvoiceTemplates.push(newTemplate)
    setTemplate(newTemplate)
    setInvoiceData({})
    setSelectedFieldId(null)

    setNewTemplateData({ name: "", description: "" })
    setShowNewTemplateDialog(false)
  }

  const handleRemoveField = (fieldId: string, sectionId: string) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, fields: section.fields.filter((field) => field.id !== fieldId) }
          : section,
      ),
    }))

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, fieldId: string, sectionId: string) => {
    setDraggedField({ fieldId, sectionId })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, fieldId: string, sectionId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverField({ fieldId, sectionId })
  }

  const handleDragLeave = () => {
    setDragOverField(null)
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string, targetSectionId: string) => {
    e.preventDefault()

    if (!draggedField) return

    const { fieldId: draggedFieldId, sectionId: draggedSectionId } = draggedField

    if (draggedFieldId === targetFieldId) {
      setDraggedField(null)
      setDragOverField(null)
      return
    }

    setTemplate((prev) => {
      const newSections = [...prev.sections]

      // Find source and target sections
      const sourceSection = newSections.find((s) => s.id === draggedSectionId)
      const targetSection = newSections.find((s) => s.id === targetSectionId)

      if (!sourceSection || !targetSection) return prev

      // Find the dragged field
      const draggedFieldIndex = sourceSection.fields.findIndex((f) => f.id === draggedFieldId)
      const draggedFieldData = sourceSection.fields[draggedFieldIndex]

      if (draggedFieldIndex === -1) return prev

      // Remove field from source
      sourceSection.fields.splice(draggedFieldIndex, 1)

      // Find target position and insert
      const targetFieldIndex = targetSection.fields.findIndex((f) => f.id === targetFieldId)
      targetSection.fields.splice(targetFieldIndex, 0, draggedFieldData)

      return { ...prev, sections: newSections }
    })

    setDraggedField(null)
    setDragOverField(null)
  }

  const selectedField = template.sections
    .flatMap((section) => section.fields)
    .find((field) => field.id === selectedFieldId)

  const handleDownload = () => {
    const databaseStructure = {
      // Template table structure
      template: {
        id: template.id,
        name: template.name,
        description: template.description || "",
        theme_id: selectedTheme.id,
        layout_config: templateLayoutStyle,
        created_by: "user_123", // Would be actual user ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },

      // Sections table structure
      sections: template.sections.map((section, index) => ({
        id: section.id,
        template_id: template.id,
        title: section.title,
        order_index: section.order || index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),

      // Fields table structure with unified styling
      fields: template.sections.flatMap((section) =>
        section.fields.map((field, index) => ({
          id: field.id,
          section_id: section.id,
          label: field.label,
          field_type: field.type,
          order_index: index,
          container_style: field.containerStyle || {
            width: "100%",
            height: "auto",
            display: "block",
            margin: "8px 0",
          },
          label_style: field.labelStyle || {
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "4px",
          },
          field_style: {
            ...field.styleForm,
            ...field.styleDisplay,
            fontSize: field.styleDisplay?.fontSize || field.styleForm?.fontSize || "16px",
            padding: field.styleForm?.padding || "8px 12px",
            border: field.styleForm?.border || "1px solid #d1d5db",
            borderRadius: field.styleForm?.borderRadius || "6px",
          },
          is_required: field.required || false,
          default_value: field.placeholder || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
      ),

      // Theme table structure
      theme: {
        id: selectedTheme.id,
        name: selectedTheme.name,
        css_properties: selectedTheme.styles,
        is_predefined: true,
        created_by: null, // null for predefined themes
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },

      // Current form data (not stored in template tables)
      form_data: invoiceData,

      // Metadata for reference
      metadata: {
        total_sections: template.sections.length,
        total_fields: template.sections.reduce((acc, section) => acc + section.fields.length, 0),
        completed_fields: Object.keys(invoiceData).length,
        completion_percentage: Math.round(
          (Object.keys(invoiceData).length /
            template.sections.reduce((acc, section) => acc + section.fields.length, 0)) *
            100,
        ),
        exported_at: new Date().toISOString(),
      },
    }

    console.log("[v0] Database Structure JSON:", JSON.stringify(databaseStructure, null, 2))

    // Also log individual table structures for easy database insertion
    console.log("[v0] Template Table:", JSON.stringify(databaseStructure.template, null, 2))
    console.log("[v0] Sections Table:", JSON.stringify(databaseStructure.sections, null, 2))
    console.log("[v0] Fields Table:", JSON.stringify(databaseStructure.fields, null, 2))
    console.log("[v0] Theme Table:", JSON.stringify(databaseStructure.theme, null, 2))

    const blob = new Blob([JSON.stringify(databaseStructure, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-template-db-${template.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleAddSection = () => {
    if (!newSectionData.title) return

    const sectionId = `section_${Date.now()}`
    const newSection: SectionConfig = {
      id: sectionId,
      title: newSectionData.title,
      order: template.sections.length,
      fields: [],
    }

    setTemplate((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))

    setNewSectionData({ title: "" })
    setShowNewSectionDialog(false)
  }

  const handleRemoveSection = (sectionId: string) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  const handleTemplateLayoutUpdate = (property: string, value: string) => {
    setTemplateLayoutStyle((prev) => ({
      ...prev,
      [property]: value,
    }))
  }

  const getTemplateLayoutStyles = () => {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${templateLayoutStyle.gridColumns}, 1fr)`,
      gap: templateLayoutStyle.gridGap,
    }
  }

  const getSectionLayoutStyles = () => {
    return {
      marginBottom: templateLayoutStyle.sectionSpacing,
    }
  }

  const getFieldGridStyles = () => {
    if (templateLayoutStyle.fieldLayout === "grid") {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${templateLayoutStyle.fieldColumns}, 1fr)`,
        gap: templateLayoutStyle.fieldGap,
      }
    }
    return {
      display: "flex",
      flexDirection: "column" as const,
      gap: templateLayoutStyle.fieldGap,
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Builder</h1>
            <p className="text-gray-600 mt-1">Create and customize professional invoices</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                previewMode
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {previewMode ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">{selectedTheme.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!previewMode && showNewSectionDialog && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                          <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                              <input
                                type="text"
                                value={newSectionData.title}
                                onChange={(e) => setNewSectionData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter section title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setShowNewSectionDialog(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddSection}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                Add Section
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!previewMode && (
                      <button
                        onClick={() => setShowNewSectionDialog(true)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Section
                      </button>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Palette className="w-4 h-4" />
                      {previewMode ? "Preview Mode" : "Edit Mode"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8" style={sanitizeStyle(selectedTheme.styles)}>
                <div style={getTemplateLayoutStyles()}>
                  {template.sections.map((section) => (
                    <div key={section.id} className="space-y-4" style={getSectionLayoutStyles()}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          {section.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!previewMode && (
                            <>
                              {showNewFieldDialog && newFieldData.sectionId === section.id && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                    <h3 className="text-lg font-semibold mb-4">Add New Field</h3>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Field Label
                                        </label>
                                        <input
                                          type="text"
                                          value={newFieldData.label}
                                          onChange={(e) =>
                                            setNewFieldData((prev) => ({ ...prev, label: e.target.value }))
                                          }
                                          placeholder="Enter field label"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Field Type
                                        </label>
                                        <select
                                          value={newFieldData.type}
                                          onChange={(e) =>
                                            setNewFieldData((prev) => ({ ...prev, type: e.target.value as any }))
                                          }
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="text">Text</option>
                                          <option value="email">Email</option>
                                          <option value="number">Number</option>
                                          <option value="date">Date</option>
                                          <option value="tel">Phone</option>
                                          <option value="textarea">Textarea</option>
                                          <option value="list">Bullet List</option>
                                          <option value="ordered-list">Numbered List</option>
                                        </select>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="checkbox"
                                          id="field-required"
                                          checked={newFieldData.required}
                                          onChange={(e) =>
                                            setNewFieldData((prev) => ({ ...prev, required: e.target.checked }))
                                          }
                                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="field-required" className="text-sm text-gray-700">
                                          Required field
                                        </label>
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <button
                                          onClick={() => setShowNewFieldDialog(false)}
                                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={handleAddField}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                          Add Field
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <button
                                onClick={() => {
                                  setNewFieldData((prev) => ({ ...prev, sectionId: section.id }))
                                  setShowNewFieldDialog(true)
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                Add Field
                              </button>
                              <button
                                onClick={() => handleRemoveSection(section.id)}
                                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={getFieldGridStyles()}>
                        {section.fields.map((field) => (
                          <div
                            key={field.id}
                            draggable={!previewMode}
                            onDragStart={(e) => handleDragStart(e, field.id, section.id)}
                            onDragOver={(e) => handleDragOver(e, field.id, section.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, field.id, section.id)}
                            className={`
                              ${
                                !previewMode && selectedFieldId === field.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
                              } 
                              ${field.type === "textarea" || field.type === "list" || field.type === "ordered-list" ? "col-span-full" : ""}
                              ${!previewMode ? "cursor-move hover:bg-gray-50 transition-colors" : ""}
                              ${dragOverField?.fieldId === field.id ? "ring-2 ring-blue-400 ring-offset-2" : ""}
                              ${draggedField?.fieldId === field.id ? "opacity-50" : ""}
                              relative group rounded-lg p-2
                            `}
                            onClick={() => !previewMode && setSelectedFieldId(field.id)}
                          >
                            {!previewMode && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveField(field.id, section.id)
                                  }}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded flex items-center justify-center"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <GripVertical className="w-4 h-4 text-gray-400" />
                              </div>
                            )}

                            <FieldRenderer
                              field={field}
                              value={
                                invoiceData[field.id] ||
                                (field.type === "list" || field.type === "ordered-list" ? [] : "")
                              }
                              onChange={handleDataChange}
                              readonly={previewMode}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!previewMode && (
              <div className="w-full">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-4 border-b border-gray-200">
                    {["templates", "themes", "layout", "styles"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 text-sm font-medium capitalize transition-colors border-b-2 ${
                          activeTab === tab
                            ? "bg-blue-50 text-blue-700 border-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {activeTab === "templates" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <h3 className="font-semibold text-gray-900">Invoice Templates</h3>
                        </div>

                        <select
                          value={template.id}
                          onChange={(e) => handleTemplateSelect(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {allInvoiceTemplates.map((tmpl) => (
                            <option key={tmpl.id} value={tmpl.id}>
                              {tmpl.name}
                            </option>
                          ))}
                        </select>

                        {showNewTemplateDialog && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                              <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                                  <input
                                    type="text"
                                    value={newTemplateData.name}
                                    onChange={(e) => setNewTemplateData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter template name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={newTemplateData.description}
                                    onChange={(e) =>
                                      setNewTemplateData((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    placeholder="Enter template description"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setShowNewTemplateDialog(false)}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleCreateTemplate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                  >
                                    Create Template
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => setShowNewTemplateDialog(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Create New Template
                        </button>

                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          <p className="font-medium mb-2">Current Template:</p>
                          <p>{template.name}</p>
                          <p className="text-xs mt-1">
                            {template.sections.reduce((acc, section) => acc + section.fields.length, 0)} fields across{" "}
                            {template.sections.length} sections
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "themes" && (
                      <ThemeSelector
                        selectedThemeId={selectedTheme.id}
                        onThemeSelect={handleThemeSelect}
                        type="template"
                      />
                    )}

                    {activeTab === "layout" && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <h3 className="font-semibold text-gray-900">Template Layout</h3>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-sm text-gray-700">Section Layout</h4>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Sections Per Row</label>
                              <select
                                value={templateLayoutStyle.gridColumns}
                                onChange={(e) => handleTemplateLayoutUpdate("gridColumns", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="1">1 Column</option>
                                <option value="2">2 Columns</option>
                                <option value="3">3 Columns</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Section Spacing</label>
                              <select
                                value={templateLayoutStyle.sectionSpacing}
                                onChange={(e) => handleTemplateLayoutUpdate("sectionSpacing", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="16px">Small (16px)</option>
                                <option value="24px">Medium (24px)</option>
                                <option value="32px">Large (32px)</option>
                                <option value="48px">Extra Large (48px)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Grid Gap</label>
                              <select
                                value={templateLayoutStyle.gridGap}
                                onChange={(e) => handleTemplateLayoutUpdate("gridGap", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="8px">Small (8px)</option>
                                <option value="16px">Medium (16px)</option>
                                <option value="24px">Large (24px)</option>
                                <option value="32px">Extra Large (32px)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-sm text-gray-700">Field Layout</h4>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Field Layout Type</label>
                              <select
                                value={templateLayoutStyle.fieldLayout}
                                onChange={(e) => handleTemplateLayoutUpdate("fieldLayout", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="grid">Grid Layout</option>
                                <option value="flex">Stack Layout</option>
                              </select>
                            </div>

                            {templateLayoutStyle.fieldLayout === "grid" && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Fields Per Row</label>
                                <select
                                  value={templateLayoutStyle.fieldColumns}
                                  onChange={(e) => handleTemplateLayoutUpdate("fieldColumns", e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="1">1 Column</option>
                                  <option value="2">2 Columns</option>
                                  <option value="3">3 Columns</option>
                                  <option value="4">4 Columns</option>
                                </select>
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Field Gap</label>
                              <select
                                value={templateLayoutStyle.fieldGap}
                                onChange={(e) => handleTemplateLayoutUpdate("fieldGap", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="8px">Small (8px)</option>
                                <option value="12px">Medium (12px)</option>
                                <option value="16px">Large (16px)</option>
                                <option value="24px">Extra Large (24px)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Layout changes apply to the entire template and affect how sections and fields are arranged.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "styles" && (
                      <>
                        {selectedField ? (
                          <FieldStyleEditor
                            field={selectedField}
                            onStyleUpdate={handleFieldStyleUpdate}
                            onFieldUpdate={handleFieldUpdate}
                          />
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Select a field to customize its styling</p>
                            <p className="text-xs mt-2">Drag fields to reorder them</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {previewMode && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice Summary</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Template:</span>
                      <span className="font-medium text-gray-900">{template.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Theme:</span>
                      <span className="font-medium text-gray-900">{selectedTheme.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fields Completed:</span>
                      <span className="font-medium text-gray-900">
                        {Object.keys(invoiceData).length} /{" "}
                        {template.sections.reduce((acc, section) => acc + section.fields.length, 0)}
                      </span>
                    </div>
                    {invoiceData.amount && (
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-blue-600">${invoiceData.amount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
