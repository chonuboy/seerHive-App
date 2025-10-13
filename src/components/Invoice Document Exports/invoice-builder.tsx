"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Eye, Settings, Database, Map, Loader2 } from "lucide-react";
import TemplateSelector from "../Invoice Document Exports/template-selector";
import InvoiceCanvas from "./invoice-canvas";
import FieldLibrary from "./field-library";
import PDFExport from "./pdf-export";
import { fetchAllInvoiceTemplates } from "../../api/invoice/invoicetemplate";
import { fetchTemplateFieldMapsByTemplate } from "../../api/invoice/templatefieldmap";

// Types
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

export default function InvoiceBuilder() {
  const [activeTemplate, setActiveTemplate] = useState<InvoiceTemplate | null>(null);
  const [activeTheme, setActiveTheme] = useState<string>("professional-blue");
  const [previewMode, setPreviewMode] = useState(true);
  const [invoiceFields, setInvoiceFields] = useState<InvoiceField[]>([]);
  const [templateFieldMaps, setTemplateFieldMaps] = useState<TemplateFieldMap[]>([]);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [loading, setLoading] = useState({
    templates: false,
    fieldMaps: false,
  });
  const [activeTab, setActiveTab] = useState<"templates" | "fields">("templates");

  // Load templates on component mount
  const loadTemplates = useCallback(async () => {
    setLoading((prev) => ({ ...prev, templates: true }));
    try {
      const response = await fetchAllInvoiceTemplates();
      // console.log("Templates response:", response);
      if (response && Array.isArray(response.content)) {
        setTemplates(response.content);
        // Set first template as active if available
        if (response.content.length > 0 && !activeTemplate) {
          const firstTemplate = response.content[0];
          setActiveTemplate(firstTemplate);
          setActiveTheme(firstTemplate.themeStyle.themeName);
          // Load field mappings for the first template
          await loadTemplateFieldMaps(firstTemplate.templateId);
        }
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading((prev) => ({ ...prev, templates: false }));
    }
  }, [activeTemplate]);

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

        // console.log("Converted canvas fields:", canvasFields);
        setInvoiceFields(canvasFields);
      }
    } catch (error) {
      // console.error("Error fetching template field maps:", error);
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
    loadTemplates();
  }, [loadTemplates]);

  const handleTemplateChange = async (template: InvoiceTemplate, theme?: string) => {
    setActiveTemplate(template);
    setActiveTheme(theme || template.themeStyle.themeName);

    // Load field mappings for the selected template
    await loadTemplateFieldMaps(template.templateId);
  };

  const handleFieldMappingUpdate = (mappings: TemplateFieldMap[]) => {
    setTemplateFieldMaps(mappings);
  };

  const handleFieldsChange = (fields: any[]) => {
    setInvoiceFields(fields);
  };

  if (loading.templates && templates.length === 0) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (!activeTemplate) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No templates available</p>
          <button 
            onClick={loadTemplates}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
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
          <div className="px-4 pb-4 flex-1 overflow-y-auto">
            {activeTab === "templates" && (
              <div className="space-y-4">
                <TemplateSelector
                  activeTemplate={activeTemplate}
                  onTemplateChange={handleTemplateChange}
                  activeTheme={activeTheme}
                  onThemeChange={setActiveTheme}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PDFExport fields={invoiceFields} template={activeTemplate} theme={activeTheme} />
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