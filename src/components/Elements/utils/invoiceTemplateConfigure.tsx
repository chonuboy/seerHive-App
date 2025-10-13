"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Eye, Database, Loader2, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import ThemeCustomizer from "@/components/Invoice/theme-customizer";
import InvoiceCanvas from "@/components/Invoice/invoice-canvas";
import FieldLibrary from "@/components/Invoice/field-library";
import PDFExport from "@/components/Invoice/pdf-export";
import { fetchInvoiceTemplate } from "@/api/invoice/invoicetemplate";
import { fetchTemplateFieldMapsByTemplate } from "../../../api/invoice/templatefieldmap";

// Types (keep the same interfaces)
interface BillingType {
  billingTypeId: number;
  billingTypeName: string;
  updatedBy?: string | null;
  updatedOn?: string | null;
}

interface Theme {
  themeId: number;
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface LayoutConfig {
  layoutConfigId: number;
  gridColumns: string;
  gridGap: string;
  gridRows: string;
}

interface InvoiceSectionMaster {
  sectionId: number;
  sectionName: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  layoutConfig: LayoutConfig;
}

interface InvoiceFieldMaster {
  invoiceFieldId: number;
  fieldName: string;
  dataType: string;
  description?: string;
  maxLengthOfField?: number;
  inputMask?: string;
  isActive: boolean;
  insertedBy?: string;
  insertedOn?: string;
  updatedBy?: string;
  updatedOn?: string;
}

interface InvoiceTemplate {
  templateId: number;
  templateName: string;
  billingType: BillingType;
  themeStyle: Theme;
  description: string;
  isActive: boolean;
  createdOn: string;
}

interface TemplateFieldMap {
  templateFieldMapId: number;
  template: InvoiceTemplate;
  invoiceFieldMaster: InvoiceFieldMaster;
  invoiceSectionMaster: InvoiceSectionMaster;
  displayLabel: string;
  controlType: string;
  displayOrder: number;
  isRequired: boolean;
  isEditable: boolean;
  isVisible: boolean;
  defaultValue?: string;
  maxLength?: number;
  decimalPlaces?: number;
  dropdownOptions?: string;
  validationRegex?: string;
  tooltipText?: string;
  updatedBy?: string;
  updatedDate?: string;
  insertedBy?: string;
  insertedDate?: string;
}

interface TemplateFieldMapsResponse {
  content: TemplateFieldMap[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

interface InvoiceField {
  id: string;
  name: string;
  type: string;
  value: string;
  position: { section: string; row: number; col: number };
  style: any;
  colSpan?: number;
  fieldData?: TemplateFieldMap;
}

export default function InvoiceTemplateConfigure() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id ? parseInt(params.id as string) : null;

  const [activeTemplate, setActiveTemplate] = useState<InvoiceTemplate | null>(null);
  const [activeTheme, setActiveTheme] = useState<string>("professional-blue");
  const [previewMode, setPreviewMode] = useState(false);
  const [invoiceFields, setInvoiceFields] = useState<InvoiceField[]>([]);
  const [templateFieldMaps, setTemplateFieldMaps] = useState<TemplateFieldMap[]>([]);
  const [loading, setLoading] = useState({
    template: false,
    fieldMaps: false,
  });
  const [activeTab, setActiveTab] = useState<"theme" | "fields">("theme");

  // Load specific template by ID
  const loadTemplate = useCallback(async () => {
    if (!templateId) return;

    setLoading((prev) => ({ ...prev, template: true }));
    try {
      const response = await fetchInvoiceTemplate(templateId);
      if (response) {
        setActiveTemplate(response);
        setActiveTheme(response.themeStyle.themeName);
        // Load field mappings for the template
        await loadTemplateFieldMaps(response.templateId);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    } finally {
      setLoading((prev) => ({ ...prev, template: false }));
    }
  }, [templateId]);

  // Load template field maps and convert to canvas fields
  const loadTemplateFieldMaps = useCallback(async (templateId: number) => {
    setLoading((prev) => ({ ...prev, fieldMaps: true }));
    try {
      const response: TemplateFieldMapsResponse = await fetchTemplateFieldMapsByTemplate(templateId);
      
      if (response && Array.isArray(response.content)) {
        setTemplateFieldMaps(response.content);

        // Group fields by section and calculate positions
        const sectionFields: Record<string, TemplateFieldMap[]> = {};
        
        response.content.forEach((fieldMap) => {
          const sectionId = `section-${fieldMap.invoiceSectionMaster.sectionId}`;
          if (!sectionFields[sectionId]) {
            sectionFields[sectionId] = [];
          }
          sectionFields[sectionId].push(fieldMap);
        });

        // Convert to canvas fields with proper positioning
        const canvasFields: InvoiceField[] = [];
        
        Object.keys(sectionFields).forEach((sectionId) => {
          const fieldsInSection = sectionFields[sectionId];
          const section = fieldsInSection[0].invoiceSectionMaster;
          const gridColumns = getGridColumnsCount(section.layoutConfig.gridColumns);
          
          // Sort fields by displayOrder
          const sortedFields = fieldsInSection.sort((a, b) => a.displayOrder - b.displayOrder);
          
          sortedFields.forEach((fieldMap, index) => {
            const row = Math.floor(index / gridColumns);
            const col = index % gridColumns;
            
            canvasFields.push({
              id: `field-${fieldMap.templateFieldMapId}`,
              name: fieldMap.displayLabel,
              type: fieldMap.controlType.toLowerCase(),
              value: fieldMap.defaultValue || "XXX",
              position: {
                section: sectionId,
                row: row,
                col: col,
              },
              style: {
                fontSize: "14px",
              },
              fieldData: fieldMap,
            });
          });
        });

        setInvoiceFields(canvasFields);
      }
    } catch (error) {
      console.error("Error fetching template field maps:", error);
    } finally {
      setLoading((prev) => ({ ...prev, fieldMaps: false }));
    }
  }, []);

  // Helper function to get grid columns count
  const getGridColumnsCount = (gridColumns: string): number => {
    if (gridColumns.includes("fr")) {
      return gridColumns.split(" ").length;
    }
    return Number.parseInt(gridColumns) || 2;
  };

  useEffect(() => {
    if (router.isReady && templateId) {
      loadTemplate();
    }
  }, [templateId, loadTemplate]);

  const handleFieldMappingUpdate = (mappings: TemplateFieldMap[]) => {
    setTemplateFieldMaps(mappings);
  };

  const handleFieldsChange = (fields: any[]) => {
    setInvoiceFields(fields);
  };

  const handleThemeUpdate = async (themeId: string, themeData: any) => {
    try {
      // Handle theme updates here
      console.log("Theme updated:", themeId, themeData);
    } catch (error) {
      console.error("Error handling theme update:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading.template && !activeTemplate) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!activeTemplate) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Template not found</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* Back Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 gap-2 m-4">
            <button
              onClick={() => setActiveTab("theme")}
              className={`flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === "theme" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FileText className="h-4 w-4" />
              Theme
            </button>
            <button
              onClick={() => setActiveTab("fields")}
              className={`flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === "fields" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Database className="h-4 w-4" />
              Fields
            </button>
          </div>

          <div className="px-4 pb-4 flex-1 overflow-y-auto">
            {activeTab === "theme" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{activeTemplate.templateName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{activeTemplate.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {activeTemplate.billingType.billingTypeName}
                    </span>
                  </div>
                </div>

                <ThemeCustomizer
                  activeTheme={activeTheme}
                  onThemeChange={setActiveTheme}
                  currentTemplate={activeTemplate}
                  onThemeUpdate={handleThemeUpdate}
                />
              </div>
            )}

            {activeTab === "fields" && (
              <FieldLibrary
                currentTemplateId={activeTemplate.templateId}
                onFieldMappingUpdate={handleFieldMappingUpdate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>

            <PDFExport templateId={activeTemplate.templateId} />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="inline-block px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                {activeTemplate.templateName}
              </span>
              <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded mt-1 ml-2">
                {activeTheme
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}{" "}
                Theme
              </span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          {loading.fieldMaps ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading template fields...</p>
              </div>
            </div>
          ) : (
            <InvoiceCanvas
              template={activeTemplate.billingType.billingTypeName}
              theme={activeTheme}
              previewMode={previewMode}
              fields={invoiceFields}
              onFieldsChange={handleFieldsChange}
              fieldLibraryData={templateFieldMaps}
              currentTemplateId={activeTemplate.templateId}
            />
          )}
        </div>
      </div>
    </div>
  );
}