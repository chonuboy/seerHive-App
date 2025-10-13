"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { fetchTemplateFieldMapsByTemplate } from "../../../api/invoice/templatefieldmap";
import InvoiceCanvas from "@/components/Invoice/invoice-canvas";

interface InvoicePreviewerProps {
  templateId: number;
  isOpen: boolean;
  onClose: () => void;
}

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

export default function InvoicePreviewer({ templateId, isOpen, onClose }: InvoicePreviewerProps) {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<InvoiceField[]>([]);
  const [template, setTemplate] = useState<InvoiceTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get grid columns count (same as in InvoiceBuilder)
  const getGridColumnsCount = (gridColumns: string): number => {
    if (gridColumns.includes("fr")) {
      return gridColumns.split(" ").length;
    }
    return Number.parseInt(gridColumns) || 2;
  };

  useEffect(() => {
    if (isOpen && templateId) {
      loadTemplateData();
    }
  }, [isOpen, templateId]);

  const loadTemplateData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: TemplateFieldMapsResponse = await fetchTemplateFieldMapsByTemplate(templateId);

      if (response && Array.isArray(response.content) && response.content.length > 0) {
        // Extract template info from the first field map
        const firstFieldMap = response.content[0];
        setTemplate(firstFieldMap.template);

        // Group fields by section and calculate positions (same logic as InvoiceBuilder)
        const sectionFields: Record<string, TemplateFieldMap[]> = {};
        
        response.content.forEach((fieldMap) => {
          const sectionId = `section-${fieldMap.invoiceSectionMaster.sectionId}`;
          if (!sectionFields[sectionId]) {
            sectionFields[sectionId] = [];
          }
          sectionFields[sectionId].push(fieldMap);
        });

        // Convert to canvas fields with proper positioning (same logic as InvoiceBuilder)
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

        setFields(canvasFields);
      } else {
        setError("No template data found");
      }
    } catch (error) {
      console.error("Error loading template data:", error);
      setError("Failed to load template preview");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFields([]);
    setTemplate(null);
    setError(null);
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      Template Preview - {template?.templateName || "Loading..."}
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-500 mt-1">
                      {template?.billingType?.billingTypeName && (
                        <span className="inline-block px-2 py-1 text-xs border border-gray-300 rounded bg-white mr-2">
                          {template.billingType.billingTypeName}
                        </span>
                      )}
                      {template?.themeStyle?.themeName && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                          {template.themeStyle.themeName
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")} Theme
                        </span>
                      )}
                    </Dialog.Description>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  {loading && (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading template preview...</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                          <p className="text-red-800 font-medium">Error</p>
                          <p className="text-red-600 text-sm mt-1">{error}</p>
                          <button
                            onClick={loadTemplateData}
                            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!loading && !error && template && (
                    <div className="bg-white rounded-lg">
                      <InvoiceCanvas
                        template={template.billingType.billingTypeName}
                        theme={template.themeStyle.themeName}
                        previewMode={true} // Force preview mode
                        fields={fields}
                        onFieldsChange={() => {}} // Empty handler since we're in preview mode
                        showGrid={false} // No grid in preview mode
                        fieldLibraryData={[]} // No field library data needed
                        currentTemplateId={templateId}
                        isNewTemplate={false}
                      />
                    </div>
                  )}

                  {!loading && !error && !template && (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <p className="text-gray-600">No template data available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close Preview
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}