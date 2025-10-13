"use client"

import { Check, Plus, Loader2, X } from "lucide-react"
import { useState, useEffect, useCallback, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { fetchAllInvoiceTemplates, createInvoiceTemplate } from "../../api/invoice/invoicetemplate"
import { fetchAllBillingTypes } from "../../api/invoice/billing-type"
import { fetchAllTemplates } from "../../api/invoice/templatestyling"

interface BillingType {
  billingTypeId: number
  billingTypeName: string
  updatedBy?: string | null
  updatedOn?: string | null
}

interface Theme {
  themeId: number
  themeName: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
}

interface InvoiceTemplate {
  templateId: number
  templateName: string
  billingType: BillingType
  themeStyle: Theme
  description: string
  isActive: boolean
  createdOn: string
}

interface BillingTypesResponse {
  content: BillingType[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  lastPage: boolean
}

interface ThemesResponse {
  content: Theme[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  lastPage: boolean
}

interface TemplatesResponse {
  content: InvoiceTemplate[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  lastPage: boolean
}

interface TemplateSelectorProps {
  activeTemplate: InvoiceTemplate
  onTemplateChange: (template: InvoiceTemplate, theme?: string) => void
  activeTheme: string
  onThemeChange: (theme: string) => void
}

export default function TemplateSelector({
  activeTemplate,
  onTemplateChange,
  activeTheme,
  onThemeChange,
}: TemplateSelectorProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([])
  const [billingTypes, setBillingTypes] = useState<BillingType[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [activeTab, setActiveTab] = useState<"basic" | "theme">("basic")
  const [loading, setLoading] = useState({
    templates: false,
    billingTypes: false,
    themes: false,
    creating: false,
  })

  const [newTemplate, setNewTemplate] = useState({
    templateName: "",
    description: "",
    billingTypeId: 1,
    themeName: "professional-blue",
  })

  const fetchTemplates = useCallback(async () => {
    setLoading((prev) => ({ ...prev, templates: true }))
    try {
      const response: TemplatesResponse = await fetchAllInvoiceTemplates()
      if (response && Array.isArray(response.content)) {
        setTemplates(response.content)
        if (response.content.length > 0 && !activeTemplate.templateId) {
          onTemplateChange(response.content[0], response.content[0].themeStyle.themeName)
        }
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading((prev) => ({ ...prev, templates: false }))
    }
  }, [activeTemplate.templateId, onTemplateChange])

  const fetchBillingTypes = useCallback(async () => {
    setLoading((prev) => ({ ...prev, billingTypes: true }))
    try {
      const response: BillingTypesResponse = await fetchAllBillingTypes()
      if (response && Array.isArray(response.content)) {
        setBillingTypes(response.content)
        if (response.content.length > 0 && !newTemplate.billingTypeId) {
          setNewTemplate((prev) => ({
            ...prev,
            billingTypeId: response.content[0].billingTypeId,
          }))
        }
      }
    } catch (error) {
      console.error("Error fetching billing types:", error)
    } finally {
      setLoading((prev) => ({ ...prev, billingTypes: false }))
    }
  }, [newTemplate.billingTypeId])

  const fetchThemes = useCallback(async () => {
    setLoading((prev) => ({ ...prev, themes: true }))
    try {
      const response: ThemesResponse = await fetchAllTemplates()
      if (response && Array.isArray(response.content)) {
        setThemes(response.content)
      }
    } catch (error) {
      console.error("Error fetching themes:", error)
    } finally {
      setLoading((prev) => ({ ...prev, themes: false }))
    }
  }, [newTemplate.themeName])

  useEffect(() => {
    fetchTemplates()
    fetchBillingTypes()
    fetchThemes()
  }, [fetchTemplates, fetchBillingTypes, fetchThemes])

  const handleAddNewTemplate = async () => {
    if (!newTemplate.templateName?.trim()) {
      alert("Template name is required")
      return
    }

    setLoading((prev) => ({ ...prev, creating: true }))

    try {
      const selectedBillingType = billingTypes.find((bt) => bt.billingTypeId === newTemplate.billingTypeId)
      const selectedTheme = themes.find((t) => t.themeName === newTemplate.themeName)

      const templateData = {
        templateName: newTemplate.templateName.trim(),
        description: newTemplate.description?.trim() || `Custom ${selectedBillingType?.billingTypeName || "template"}`,
        billingType: { billingTypeId: selectedBillingType?.billingTypeId || 1 },
        themeStyle: { themeId: selectedTheme?.themeId || 1 },
      }

      const response = await createInvoiceTemplate(templateData)

      if (response.templateId && response.content && response.content.length > 0) {
        const createdTemplate = response.content[0]
        await fetchTemplates()
        onTemplateChange(createdTemplate, createdTemplate.themeStyle.themeName)
        setShowDialog(false)
        setNewTemplate({
          templateName: "",
          description: "",
          billingTypeId: billingTypes[0]?.billingTypeId || 1,
          themeName: themes[0]?.themeName || "professional-blue",
        })
      }
      if (response.message) {
        alert(response.message)
      }
    } catch (error) {
      console.error("Error creating template:", error)
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }))
    }
  }

  const handleBillingTypeChange = (billingTypeId: number) => {
    setNewTemplate({
      ...newTemplate,
      billingTypeId: billingTypeId,
    })
  }

  const getSelectedTheme = () => {
    return themes.find((t) => t.themeName === newTemplate.themeName)
  }

  const formatThemeName = (themeName: string) => {
    return themeName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading.templates && templates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Invoice Templates</h3>
          <button disabled className="p-2 text-gray-400 cursor-not-allowed">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Invoice Templates</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDialog(true)}
            disabled={loading.billingTypes || loading.themes}
            className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <div
            key={template.templateId}
            onClick={() => onTemplateChange(template, template.themeStyle.themeName)}
            className={`bg-white rounded-lg p-5 cursor-pointer transition-all ${
              activeTemplate.templateId === template.templateId
                ? "border-2 border-blue-500 shadow-md"
                : "border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900">{template.templateName}</h3>
              {activeTemplate.templateId === template.templateId && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Billing Type : {template.billingType.billingTypeName}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                Theme : {formatThemeName(template.themeStyle.themeName)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Transition show={showDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* Dialog Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Create New Template
                      </Dialog.Title>
                      <button
                        onClick={() => setShowDialog(false)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <Dialog.Description className="text-sm text-gray-500">
                      Configure your new invoice template with name, billing type, and theme.
                    </Dialog.Description>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab("basic")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "basic"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Basic Info
                      </button>
                      <button
                        onClick={() => setActiveTab("theme")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === "theme"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        Theme
                      </button>
                    </nav>
                  </div>

                  {activeTab === "basic" && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={newTemplate.templateName}
                          onChange={(e) =>
                            setNewTemplate({
                              ...newTemplate,
                              templateName: e.target.value,
                            })
                          }
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Template name"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="description" className="text-right text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          id="description"
                          type="text"
                          value={newTemplate.description}
                          onChange={(e) =>
                            setNewTemplate({
                              ...newTemplate,
                              description: e.target.value,
                            })
                          }
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Template description"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="billingType" className="text-right text-sm font-medium text-gray-700">
                          Billing Type
                        </label>
                        <select
                          id="billingType"
                          value={newTemplate.billingTypeId?.toString()}
                          onChange={(e) => handleBillingTypeChange(Number.parseInt(e.target.value))}
                          disabled={loading.billingTypes}
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select billing type</option>
                          {billingTypes.map((billingType) => (
                            <option key={billingType.billingTypeId} value={billingType.billingTypeId.toString()}>
                              {billingType.billingTypeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {activeTab === "theme" && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right text-sm font-medium text-gray-700">Select Theme</label>
                        <select
                          value={newTemplate.themeName}
                          onChange={(e) => setNewTemplate({ ...newTemplate, themeName: e.target.value })}
                          disabled={loading.themes}
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select a theme</option>
                          {themes.map((theme) => (
                            <option key={theme.themeId} value={theme.themeName}>
                              {formatThemeName(theme.themeName)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-4 items-start gap-4">
                        <label className="text-right pt-2 text-sm font-medium text-gray-700">Preview</label>
                        <div className="col-span-3">
                          {getSelectedTheme() && (
                            <div className="p-3 border border-gray-300 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium">
                                  {formatThemeName(getSelectedTheme()!.themeName)}
                                </h4>
                              </div>
                              <div className="flex gap-2">
                                <div
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{
                                    backgroundColor: getSelectedTheme()!.primaryColor,
                                  }}
                                  title="Primary Color"
                                />
                                <div
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{
                                    backgroundColor: getSelectedTheme()!.secondaryColor,
                                  }}
                                  title="Secondary Color"
                                />
                                <div
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{
                                    backgroundColor: getSelectedTheme()!.backgroundColor,
                                  }}
                                  title="Background Color"
                                />
                                <div
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{
                                    backgroundColor: getSelectedTheme()!.textColor,
                                  }}
                                  title="Text Color"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dialog Footer */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDialog(false)}
                      disabled={loading.creating}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewTemplate}
                      disabled={!newTemplate.templateName?.trim() || loading.creating}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading.creating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Template"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
