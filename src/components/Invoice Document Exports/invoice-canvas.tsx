"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  GripVertical,
  Trash2,
  Settings,
  Calendar,
  Hash,
  Grid3X3,
  FileText,
  Plus,
  Edit,
  Loader2,
  User,
  Building,
  CreditCard,
} from "lucide-react";
import BillingTable from "./billing-table";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { fetchTemplateFieldMap } from "../../api/invoice/templatefieldmap";
import {
  fetchAllInvoiceSections,
  createInvoiceSection,
  updateInvoiceSection,
  deleteInvoiceSection,
} from "../../api/invoice/invoice-section-master";
import {
  fetchAllLayoutConfigs,
  createLayoutConfig,
  updateLayoutConfig,
} from "../../api/invoice/layoutconfig";
import { fetchAllTemplates } from "../../api/invoice/templatestyling";
import { imgHelper } from "@/lib/image-helper";

interface InvoiceCanvasProps {
  template: string;
  theme: string;
  previewMode: boolean;
  fields: InvoiceField[];
  onFieldsChange?: (fields: any[]) => void;
  isNewTemplate?: boolean;
  onTemplateReset?: () => void;
  showGrid?: boolean;
  fieldLibraryData?: TemplateFieldMap[];
  snapToGrid?: boolean;
  currentTemplateId?: number;
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

interface InvoiceTemplate {
  templateId: number;
  templateName: string;
  billingType: BillingType;
  themeStyle: Theme;
  description: string;
  isActive: boolean;
  createdOn: string;
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

interface BillingItem {
  id: string;
  description: string;
  totalValue: number;
  percentageBilled: number;
  invoiceValue: number;
}

interface LayoutConfig {
  layoutConfigId?: number;
  gridColumns: string;
  gridRows: string;
  gridGap: string;
}

interface Section {
  id: string;
  sectionID?: number;
  sectionName: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  layoutConfig: LayoutConfig;
  icon?: any;
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

interface FieldGroup {
  id: string;
  name: string;
  icon: any;
  fields: InvoiceField[];
  position?: { row: number; col: number };
}

const getDefaultBillingItems = (): BillingItem[] => {
  return [
    {
      id: "1",
      description: "XXX",
      totalValue: 0,
      percentageBilled: 100,
      invoiceValue: 0,
    },
  ];
};

const getBaseSections = async (): Promise<Section[]> => {
  try {
    const response = await fetchAllInvoiceSections();
    if (response && Array.isArray(response.content)) {
      return response.content.map(
        (section: InvoiceSectionMaster, index: number) => ({
          id: `section-${section.sectionId}`,
          sectionID: section.sectionId,
          sectionName: section.sectionName,
          description: section.description,
          isActive: section.isActive,
          displayOrder: section.displayOrder || index + 1,
          layoutConfig: section.layoutConfig,
          icon: getSectionIcon(section.sectionName),
        })
      );
    }
  } catch (error) {
    console.error("Error fetching sections from database:", error);
  }

  return [];
};

const getSectionIcon = (sectionName: string) => {
  const iconMap: Record<string, any> = {
    details: Hash,
    billing: FileText,
    terms: Calendar,
    header: FileText,
    footer: FileText,
    summary: FileText,
    client: FileText,
    invoice: Hash,
  };
  return iconMap[sectionName.toLowerCase()] || FileText;
};

const getThemeColors = async (themeName: string) => {
  try {
    const response = await fetchAllTemplates();
    if (response && Array.isArray(response.content)) {
      const theme = response.content.find(
        (t: any) => t.themeName === themeName
      );
      if (theme) {
        return {
          primary: theme.primaryColor,
          secondary: theme.secondaryColor,
          background: theme.backgroundColor,
          text: theme.textColor,
          accent: `${theme.primaryColor}20`,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching theme colors from database:", error);
  }

  return {
    primary: "#1e40af",
    secondary: "#3b82f6",
    background: "#ffffff",
    text: "#1f2937",
    accent: "#eff6ff",
  };
};

const getGridColumnsCount = (gridColumns: string): number => {
  if (gridColumns.includes("1fr")) {
    return gridColumns.split(" ").length;
  }

  return Number.parseInt(gridColumns) || 2;
};

const getGridRowsCount = (gridRows: string): number => {
  if (gridRows.includes("1fr")) {
    return gridRows.split(" ").length;
  }
  return Number.parseInt(gridRows) || 1;
};

// Field grouping logic based on field names
const groupFieldsByCategory = (fields: InvoiceField[]): FieldGroup[] => {
  const groups: FieldGroup[] = [];
  
  // Define field category patterns
  const categoryPatterns = [
    {
      id: 'invoice-info',
      name: 'Invoice Info',
      icon: FileText,
      patterns: ['invoice', 'number', 'invoicedate'],
      defaultPosition: { row: 0, col: 0 }
    },
    {
      id: 'client-info',
      name: 'Client Info',
      icon: User,
      patterns: ['client name', 'address','gst'],
      defaultPosition: { row: 0, col: 1 }
    },
    {
      id:'description',
      name: 'Description',
      icon: FileText,
      patterns: ['description', 'job', 'title', 'hiring','candidate name'],
      defaultPosition: { row: 1, col: 0 }
    },
    {
      id: 'billing-info',
      name: 'Bank Details',
      icon: FileText,
      patterns: ['account', 'bank', 'holder', 'branch','ifsc','gstnumber'],
      defaultPosition: { row: 1, col: 1 }
    }
  ];

  // Initialize groups
  categoryPatterns.forEach(category => {
    groups.push({
      id: category.id,
      name: category.name,
      icon: category.icon,
      fields: [],
      position: category.defaultPosition
    });
  });

  // Default group for uncategorized fields
  const defaultGroup: FieldGroup = {
    id: 'other',
    name: 'Bank Details',
    icon: FileText,
    fields: [],
    position: { row: 1, col: 0 }
  };

  // Categorize fields
  fields.forEach(field => {
    const fieldName = field.name.toLowerCase();
    let categorized = false;

    for (const group of groups) {
      const category = categoryPatterns.find(cat => cat.id === group.id);
      if (category && category.patterns.some(pattern => fieldName.includes(pattern))) {
        group.fields.push(field);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      defaultGroup.fields.push(field);
    }
  });

  // Filter out empty groups and add default group if it has fields
  const result = groups.filter(group => group.fields.length > 0);
  if (defaultGroup.fields.length > 0) {
    result.push(defaultGroup);
  }

  return result;
};

export default function InvoiceCanvas({
  template,
  theme,
  previewMode,
  fields,
  onFieldsChange,
  isNewTemplate = false,
  onTemplateReset,
  showGrid = true,
  fieldLibraryData = [],
  snapToGrid = true,
  currentTemplateId,
}: InvoiceCanvasProps) {
  const [localFields, setLocalFields] = useState<InvoiceField[]>(fields || []);
  const [billingItems, setBillingItems] = useState<BillingItem[]>(
    getDefaultBillingItems()
  );
  const [sections, setSections] = useState<Section[]>([]);
  const [draggedField, setDraggedField] = useState<InvoiceField | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nextSectionId, setNextSectionId] = useState(1);
  const [hasBeenReset, setHasBeenReset] = useState(false);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [gstRate, setGstRate] = useState<number>(18);
  const [newSection, setNewSection] = useState({
    sectionName: "",
    description: "",
    gridColumns: 2,
    gridRows: 1,
    gridGap: "20px",
    displayOrder: 1,
  });
  const [loading, setLoading] = useState(false);
  const [templateFieldMaps, setTemplateFieldMaps] = useState<
    TemplateFieldMap[]
  >([]);
  const [availableSections, setAvailableSections] = useState<
    InvoiceSectionMaster[]
  >([]);
  const [availableLayoutConfigs, setAvailableLayoutConfigs] = useState<
    LayoutConfig[]
  >([]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [themeColors, setThemeColors] = useState<any>({});

  const subtotal = billingItems.reduce(
    (sum, item) => sum + item.invoiceValue,
    0
  );
  const taxRate = template.includes("us-contract") ? 0 : gstRate / 100;
  const taxAmount = subtotal * taxRate;
  const [cgstRate, setCgstRate] = useState(0);
  const [sgstRate, setSgstRate] = useState(0);

  const cgstAmount = (subtotal * (cgstRate || 0)) / 100;
  const sgstAmount = (subtotal * (sgstRate || 0)) / 100;

  const totalAmount = template.includes("us-contract")
    ? subtotal
    : subtotal + taxAmount + cgstAmount + sgstAmount;

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [colors, baseSections] = await Promise.all([
          getThemeColors(theme),
          getBaseSections(),
        ]);
        setThemeColors(colors);
        setSections(baseSections);
        await loadAvailableSections();
        await loadAvailableLayoutConfigs();
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [theme]);

  useEffect(() => {
    if (currentTemplateId) {
      loadTemplateFieldMaps(currentTemplateId);
    }
  }, [currentTemplateId]);

  useEffect(() => {
    if (fields) {
      setLocalFields(fields);
    }
  }, [fields]);

  useEffect(() => {
    if (isNewTemplate && !hasBeenReset) {
      resetCanvas();
      setHasBeenReset(true);
      onTemplateReset?.();
    }
  }, [isNewTemplate, hasBeenReset, onTemplateReset]);

  const loadAvailableSections = async () => {
    try {
      const response = await fetchAllInvoiceSections();
      if (response && Array.isArray(response.content)) {
        setAvailableSections(response.content);
      }
    } catch (error) {
      console.error("Error loading available sections:", error);
    }
  };

  const loadAvailableLayoutConfigs = async () => {
    try {
      const response = await fetchAllLayoutConfigs();
      if (response && Array.isArray(response.content)) {
        setAvailableLayoutConfigs(response.content);
      }
    } catch (error) {
      console.error("Error loading layout configs:", error);
    }
  };

  const loadTemplateFieldMaps = async (templateId: number) => {
    setLoading(true);
    try {
      const response: TemplateFieldMapsResponse = await fetchTemplateFieldMap(
        templateId
      );

      if (response && Array.isArray(response.content)) {
        setTemplateFieldMaps(response.content);

        const canvasFields: InvoiceField[] = response.content.map(
          (fieldMap: TemplateFieldMap) => {
            const gridColumns = getGridColumnsCount(
              fieldMap.invoiceSectionMaster.layoutConfig.gridColumns
            );

            const index = fieldMap.displayOrder - 1;
            const row = Math.floor(index / gridColumns);
            const col = index % gridColumns;

            return {
              id: `field-${fieldMap.templateFieldMapId}`,
              name: fieldMap.displayLabel,
              type: fieldMap.controlType.toLowerCase(),
              value: "XXX",
              position: {
                section: `section-${fieldMap.invoiceSectionMaster.sectionId}`,
                row: row,
                col: col,
              },
              style: {
                fontSize: "14px",
                color: themeColors.text,
              },
              fieldData: fieldMap,
            };
          }
        );

        setLocalFields(canvasFields);
        onFieldsChange?.(canvasFields);

        const apiSections = response.content.reduce(
          (acc: Section[], fieldMap) => {
            const sectionId = `section-${fieldMap.invoiceSectionMaster.sectionId}`;
            const existingSection = acc.find(
              (s) => s.sectionID === fieldMap.invoiceSectionMaster.sectionId
            );

            if (!existingSection) {
              acc.push({
                id: sectionId,
                sectionID: fieldMap.invoiceSectionMaster.sectionId,
                sectionName: fieldMap.invoiceSectionMaster.sectionName,
                description: fieldMap.invoiceSectionMaster.description,
                isActive: fieldMap.invoiceSectionMaster.isActive,
                displayOrder: fieldMap.invoiceSectionMaster.displayOrder,
                layoutConfig: fieldMap.invoiceSectionMaster.layoutConfig,
                icon: getSectionIcon(fieldMap.invoiceSectionMaster.sectionName),
              });
            }
            return acc;
          },
          []
        );

        if (apiSections.length > 0) {
          const mergedSections = [
            ...sections.map((section) => {
              const apiSection = apiSections.find(
                (s) => s.sectionID === section.sectionID
              );
              return apiSection || section;
            }),
            ...apiSections.filter(
              (apiSection) =>
                !sections.some(
                  (section) => section.sectionID === apiSection.sectionID
                )
            ),
          ].sort((a, b) => a.displayOrder - b.displayOrder);

          setSections(mergedSections);
        }
      }
    } catch (error) {
      console.error("Error loading template field maps:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetCanvas = () => {
    setLocalFields([]);
    onFieldsChange?.([]);
    setBillingItems(getDefaultBillingItems());
    setSections([]);
    setNextSectionId(1);
    setGstRate(18);
    setTemplateFieldMaps([]);
  };

  const handleDrop = (
    e: React.DragEvent,
    section: string,
    row: number,
    col: number
  ) => {
    e.preventDefault();

    if (draggedField) {
      const updatedFields = localFields.map((field) =>
        field.id === draggedField.id
          ? { ...field, position: { section, row, col } }
          : field
      );
      setLocalFields(updatedFields);
      onFieldsChange?.(updatedFields);
      setDraggedField(null);
      return;
    }

    try {
      const fieldData = JSON.parse(e.dataTransfer.getData("application/json"));

      const existingField = localFields.find(
        (f) =>
          f.position.section === section &&
          f.position.row === row &&
          f.position.col === col
      );

      if (existingField) {
        return;
      }

      const apiFieldData = fieldLibraryData.find(
        (f) => f.invoiceFieldMaster.fieldName === fieldData.id
      );

      let newField: InvoiceField;

      if (apiFieldData) {
        newField = {
          id: `${apiFieldData.invoiceFieldMaster.fieldName}-${Date.now()}`,
          name: apiFieldData.displayLabel,
          type: apiFieldData.controlType.toLowerCase(),
          value: "XXX",
          position: { section, row, col },
          style: {
            fontSize: "14px",
            color: themeColors.text,
          },
          fieldData: apiFieldData,
        };
      } else {
        newField = {
          id: `${fieldData.id}-${Date.now()}`,
          name: fieldData.name,
          type: fieldData.type,
          value: "XXX",
          position: { section, row, col },
          style: { fontSize: "14px", color: themeColors.text },
        };
      }

      const updatedFields = [...localFields, newField];
      setLocalFields(updatedFields);
      onFieldsChange?.(updatedFields);
    } catch (error) {
      console.error("Error parsing dropped field:", error);
    }
  };

  const getFieldValue = (fieldName: string): string => {
    if (!fields || !Array.isArray(fields)) return "";

    const field = fields.find((f) => {
      const fieldNameMatch = f.name
        ?.toLowerCase()
        .includes(fieldName.toLowerCase());
      const fieldIdMatch = f.id
        ?.toLowerCase()
        .includes(fieldName.toLowerCase());

      return fieldNameMatch || fieldIdMatch;
    });

    return field?.value?.toString() || "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFieldDragStart = (e: React.DragEvent, field: InvoiceField) => {
    setDraggedField(field);
    e.dataTransfer.effectAllowed = "move";
  };

  const updateFieldValue = (fieldId: string, value: string) => {
    const updatedFields = localFields.map((field) => {
      if (field.id === fieldId) {
        const updatedField = { ...field, value };
        return updatedField;
      }
      return field;
    });

    setLocalFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const updateFieldColSpan = (fieldId: string, colSpan: number) => {
    const updatedFields = localFields.map((field) =>
      field.id === fieldId ? { ...field, colSpan } : field
    );
    setLocalFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const removeField = (fieldId: string) => {
    const fieldToRemove = localFields.find((field) => field.id === fieldId);
    const updatedFields = localFields.filter((field) => field.id !== fieldId);
    setLocalFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const updateBillingItems = (items: BillingItem[]) => {
    setBillingItems(items);
  };

  const getFieldAt = (
    section: string,
    row: number,
    col: number
  ): InvoiceField | undefined => {
    return localFields.find(
      (field) =>
        field.position.section === section &&
        field.position.row === row &&
        field.position.col === col
    );
  };

  const isCellOccupied = (
    section: string,
    row: number,
    col: number
  ): boolean => {
    const exactField = getFieldAt(section, row, col);
    if (exactField) return true;

    const fieldWithColspan = localFields.find(
      (field) =>
        field.position.section === section &&
        field.position.row === row &&
        field.position.col < col &&
        field.colSpan &&
        field.position.col + field.colSpan > col
    );

    return !!fieldWithColspan;
  };

  const addNewSection = async () => {
    if (!selectedSection) {
      return;
    }

    const selectedSectionData = availableSections.find(
      (s) => s.sectionId.toString() === selectedSection
    );
    if (!selectedSectionData) {
      return;
    }

    const existingSection = sections.find(
      (s) => s.sectionID === selectedSectionData.sectionId
    );
    if (existingSection) {
      return;
    }

    try {
      const newSectionData: Section = {
        id: `section-${selectedSectionData.sectionId}`,
        sectionID: selectedSectionData.sectionId,
        sectionName: selectedSectionData.sectionName,
        description: selectedSectionData.description,
        isActive: selectedSectionData.isActive,
        displayOrder: newSection.displayOrder,
        layoutConfig: selectedSectionData.layoutConfig,
        icon: getSectionIcon(selectedSectionData.sectionName),
      };

      const updatedSections = [...sections];
      updatedSections.splice(newSection.displayOrder - 1, 0, newSectionData);

      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        displayOrder: index + 1,
      }));

      setSections(reorderedSections);
      setShowAddSectionDialog(false);
      setSelectedSection("");
      setNewSection({
        sectionName: "",
        description: "",
        gridColumns: 2,
        gridRows: 1,
        gridGap: "20px",
        displayOrder: reorderedSections.length + 1,
      });
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const updateSection = async () => {
    if (!editingSection) return;

    try {
      if (editingSection.sectionID) {
        const updateData = {
          sectionName: editingSection.sectionName,
          description: editingSection.description,
          displayOrder: editingSection.displayOrder,
          isActive: editingSection.isActive,
          layoutConfig: editingSection.layoutConfig,
        };

        await updateInvoiceSection(editingSection.sectionID, updateData);
      }

      if (editingSection.layoutConfig.layoutConfigId) {
        const layoutUpdateData = {
          gridColumns: editingSection.layoutConfig.gridColumns,
          gridRows: editingSection.layoutConfig.gridRows,
          gridGap: editingSection.layoutConfig.gridGap,
        };

        await updateLayoutConfig(
          editingSection.layoutConfig.layoutConfigId,
          layoutUpdateData
        );
      }

      const updatedSections = sections.map((section) =>
        section.id === editingSection.id ? editingSection : section
      );
      setSections(updatedSections);
      setEditingSection(null);
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const removeSection = async (sectionId: string) => {
    const sectionToRemove = sections.find((s) => s.id === sectionId);
    if (!sectionToRemove) return;

    try {
      if (sectionToRemove.sectionID) {
        await deleteInvoiceSection(sectionToRemove.sectionID);
      }

      const updatedSections = sections
        .filter((s) => s.id !== sectionId)
        .map((section, index) => ({
          ...section,
          displayOrder: index + 1,
        }));

      setSections(updatedSections);
      const updatedFields = localFields.filter(
        (f) => f.position.section !== sectionId
      );
      setLocalFields(updatedFields);
      onFieldsChange?.(updatedFields);
    } catch (error) {
      console.error("Error removing section:", error);
    }
  };

  const createCustomSection = async () => {
    if (!newSection.sectionName.trim()) {
      return;
    }

    try {
      const layoutConfigData = {
        gridColumns: `${newSection.gridColumns}fr`,
        gridRows: `${newSection.gridRows}fr`,
        gridGap: newSection.gridGap,
      };

      const layoutResponse = await createLayoutConfig(layoutConfigData);

      if (layoutResponse && layoutResponse.layoutConfigId) {
        const sectionData = {
          sectionName: newSection.sectionName,
          description: newSection.description,
          displayOrder: newSection.displayOrder,
          isActive: true,
          layoutConfig: {
            layoutConfigId: layoutResponse.layoutConfigId,
          },
        };

        const sectionResponse = await createInvoiceSection(sectionData);

        if (sectionResponse && sectionResponse.sectionId) {
          const newSectionData: Section = {
            id: `section-${sectionResponse.sectionId}`,
            sectionID: sectionResponse.sectionId,
            sectionName: newSection.sectionName,
            description: newSection.description,
            isActive: true,
            displayOrder: newSection.displayOrder,
            layoutConfig: {
              layoutConfigId: layoutResponse.layoutConfigId,
              gridColumns: `${newSection.gridColumns}fr`,
              gridRows: `${newSection.gridRows}fr`,
              gridGap: newSection.gridGap,
            },
            icon: FileText,
          };

          const updatedSections = [...sections];
          updatedSections.splice(
            newSection.displayOrder - 1,
            0,
            newSectionData
          );

          const reorderedSections = updatedSections.map((section, index) => ({
            ...section,
            displayOrder: index + 1,
          }));

          setSections(reorderedSections);
          setShowAddSectionDialog(false);
          setNewSection({
            sectionName: "",
            description: "",
            gridColumns: 2,
            gridRows: 1,
            gridGap: "20px",
            displayOrder: reorderedSections.length + 1,
          });

          await loadAvailableSections();
        }
      }
    } catch (error) {
      console.error("Error creating custom section:", error);
    }
  };

  const renderField = (field: InvoiceField) => {
    if (previewMode) {
      return (
        <div
          key={field.id}
          className="mb-3"
        >
          <div className="flex items-start">
            <span
              className="font-medium text-sm min-w-[140px] mr-3"
              style={{ color: themeColors.primary }}
            >
              {field.name}:
            </span>
            {field.type === "textarea" ? (
              <div
                className="whitespace-pre-line text-sm flex-1"
                style={{ color: themeColors.text }}
              >
                {field.value || "XXX"}
              </div>
            ) : (
              <div className="text-sm flex-1" style={{ color: themeColors.text }}>
                {field.value || "XXX"}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={field.id}
        className={`p-3 border rounded group cursor-move ${
          field.colSpan === 2 ? "col-span-2" : ""
        }`}
        style={{
          borderColor: themeColors.secondary,
          backgroundColor: themeColors.accent,
          gridColumn: field.colSpan === 2 ? `span 2` : "auto",
        }}
        draggable
        onDragStart={(e) => handleFieldDragStart(e, field)}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-gray-400 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span
                className="px-2 py-0.5 text-xs rounded"
                style={{ backgroundColor: themeColors.primary, color: "white" }}
              >
                {field.name}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="h-6 w-6 p-0 text-red-600 hover:bg-red-50 rounded flex items-center justify-center"
                  onClick={() => removeField(field.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {field.type === "textarea" ? (
              <textarea
                value={field.value}
                onChange={(e) => updateFieldValue(field.id, e.target.value)}
                placeholder="XXX"
                className="w-full min-h-[60px] px-3 py-2 border rounded text-sm"
                style={{ borderColor: themeColors.secondary }}
              />
            ) : (
              <input
                type={field.type === "date" ? "date" : "text"}
                value={field.value}
                onChange={(e) => updateFieldValue(field.id, e.target.value)}
                placeholder="XXX"
                className="w-full px-3 py-2 border rounded text-sm"
                style={{ borderColor: themeColors.secondary }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFieldGroup = (group: FieldGroup) => {
    return (
      <div
        key={group.id}
        className="h-full"
      >
        <div className="flex items-center gap-2 mb-4">
          <group.icon className="h-4 w-4" style={{ color: themeColors.primary }} />
          <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: themeColors.primary }}>
            {group.name}
          </h4>
        </div>
        
        <div className="space-y-1">
          {group.fields.map(field => renderField(field))}
        </div>
      </div>
    );
  };

  const renderSection = (section: Section) => {
    const IconComponent = section.icon || FileText;
    const gridColumnsCount = getGridColumnsCount(
      section.layoutConfig.gridColumns
    );
    const gridRowsCount = getGridRowsCount(section.layoutConfig.gridRows);

    // Get all fields for this section and sort by displayOrder
    const sectionFields = localFields
      .filter((field) => field.position.section === section.id)
      .sort((a, b) => {
        const aOrder = a.fieldData?.displayOrder || 0;
        const bOrder = b.fieldData?.displayOrder || 0;
        return aOrder - bOrder;
      });

    // Group fields for preview mode
    const fieldGroups = previewMode ? groupFieldsByCategory(sectionFields) : [];

    return (
      <div key={section.id} className="mb-8 relative">
        {/* Section Header with Horizontal Line - Only show in preview mode for certain sections */}
        {previewMode && !['header', 'footer', 'billing'].includes(section.sectionName.toLowerCase()) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-lg font-bold uppercase tracking-wide"
                style={{ color: themeColors.primary }}
              >
                {section.sectionName}
              </h3>
            </div>
            <div 
              className="w-full h-px mb-4"
              style={{ backgroundColor: themeColors.primary }}
            ></div>
          </div>
        )}

        {/* Special handling for header section in preview mode */}
        {previewMode && section.sectionName.toLowerCase() === 'header' && (
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                  {getFieldValue("company-name") || "SEERTECH SYSTEMS"}
                </h1>
                <div className="w-full h-1 bg-gray-300 mt-1 mb-2"></div>
                <div className="text-sm space-y-1">
                  <div>{getFieldValue("company-address-line1") || "Ramaniyam Marvel, No B27, Seshadripuram,"}</div>
                  <div>{getFieldValue("company-address-line2") || "1st Main Road, Velachery, Chennai 42."}</div>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold" style={{ color: themeColors.primary }}>INVOICE</h2>
              </div>
            </div>
          </div>
        )}

        {/* Special handling for billing section */}
        {section.sectionName === "BILLING" && (
          <div className="mb-8">
            {previewMode && (
              <div className="mb-6">
                <h3
                  className="text-lg font-bold uppercase tracking-wide mb-3"
                  style={{ color: themeColors.primary }}
                >
                  {section.sectionName}
                </h3>
                <div 
                  className="w-full h-px mb-4"
                  style={{ backgroundColor: themeColors.primary }}
                ></div>
              </div>
            )}
            <BillingTable
              theme={theme}
              items={billingItems}
              onItemsChange={updateBillingItems}
              previewMode={previewMode}
            />
          </div>
        )}

        {/* Regular section rendering for non-billing sections */}
        {section.sectionName !== "BILLING" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridColumnsCount}, 1fr)`,
              gap: "2rem",
              minHeight: !previewMode ? "200px" : "auto",
              ...(showGrid && !previewMode
                ? {
                    backgroundImage: `linear-gradient(${themeColors.secondary}20 1px, transparent 1px), linear-gradient(90deg, ${themeColors.secondary}20 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }
                : {}),
            }}
          >
            {/* Preview mode - render groups in grid columns */}
            {previewMode ? (
              fieldGroups.map((group, index) => (
                <div
                  key={group.id}
                  className="h-full"
                  style={{
                    gridColumn: `span 1`,
                    gridRow: `span 1`
                  }}
                >
                  {renderFieldGroup(group)}
                </div>
              ))
            ) : (
              // Edit mode - render fields individually with empty cells
              <>
                {sectionFields.map((field, index) => {
                  const row = Math.floor(index / gridColumnsCount);
                  const col = index % gridColumnsCount;

                  return (
                    <div
                      key={field.id}
                      style={{
                        gridColumn: field.colSpan === 2 ? `span 2` : `span 1`,
                      }}
                    >
                      {renderField(field)}
                    </div>
                  );
                })}

                {/* Empty cells for editing */}
                {!previewMode &&
                  Array.from(
                    {
                      length: gridRowsCount * gridColumnsCount - sectionFields.length,
                    },
                    (_, index) => {
                      const overallIndex = sectionFields.length + index;
                      const row = Math.floor(overallIndex / gridColumnsCount);
                      const col = overallIndex % gridColumnsCount;

                      const wouldBeOccupied = sectionFields.some((field) => {
                        const fieldRow = Math.floor(
                          (field.fieldData?.displayOrder || 0 - 1) / gridColumnsCount
                        );
                        const fieldCol =
                          (field.fieldData?.displayOrder || 0 - 1) % gridColumnsCount;
                        return (
                          fieldRow === row &&
                          field.colSpan === 2 &&
                          (fieldCol === col || fieldCol === col - 1)
                        );
                      });

                      if (wouldBeOccupied) return null;

                      return (
                        <div
                          key={`empty-${section.id}-${row}-${col}`}
                          className="border-2 border-dashed rounded-lg p-4 min-h-[80px] flex items-center justify-center hover:border-blue-400 transition-colors"
                          style={{
                            borderColor: themeColors.secondary,
                          }}
                          onDrop={(e) => handleDrop(e, section.id, row, col)}
                          onDragOver={handleDragOver}
                        >
                          <div
                            className="text-center"
                            style={{ color: themeColors.secondary }}
                          >
                            <Grid3X3 className="h-6 w-6 mx-auto mb-1 opacity-50" />
                            <p className="text-xs">
                              Row {row + 1}, Col {col + 1}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
              </>
            )}
          </div>
        )}

        {/* Section controls for edit mode */}
        {!previewMode && (
          <div className="flex items-center justify-between mt-4">
            <h3
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: themeColors.primary }}
            >
              <IconComponent className="h-4 w-4" />
              {section.sectionName}
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Master
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: themeColors.accent,
                  color: themeColors.text,
                }}
              >
                {gridRowsCount}×{gridColumnsCount} Grid
              </span>
              <button
                onClick={() => setEditingSection({ ...section })}
                className="text-blue-600 hover:text-blue-800 p-1 rounded"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeSection(section.id)}
                className="text-red-600 hover:text-red-800 p-1 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ... rest of the component (return statement and dialogs remain the same)
  return (
    <div className="max-w-4xl mx-auto">
      {loading && (
        <div className="flex justify-center items-center p-4 mb-4 bg-blue-50 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-600" />
          <span className="text-blue-800">Loading template...</span>
        </div>
      )}

      {isNewTemplate && localFields.length === 0 && !currentTemplateId && (
        <div
          className="mb-6 p-6 rounded-lg text-center"
          style={{
            backgroundColor: themeColors.accent,
            border: `1px solid ${themeColors.secondary}`,
          }}
        >
          <h3
            className="text-lg font-medium mb-2"
            style={{ color: themeColors.primary }}
          >
            New Template Created
          </h3>
          <p style={{ color: themeColors.text }}>
            Drag and drop fields from the sidebar to build your custom invoice
            template.
          </p>
        </div>
      )}

      <div
        className="min-h-[800px] shadow-lg border rounded-lg"
        style={{
          backgroundColor: themeColors.background,
          borderColor: themeColors.secondary,
          color: themeColors.text,
        }}
      >
        <div className="p-0" ref={canvasRef}>
          <div
            className="text-white p-6"
            style={{ backgroundColor: themeColors.primary }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={imgHelper.seertechsystemsLogo || "/placeholder.svg"}
                  alt="SEERTECH SYSTEMS Logo"
                  className="w-16 h-16 object-contain bg-white rounded p-1"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    SEERTECH SYSTEMS
                  </h1>
                  <div className="w-full h-1 bg-white/30 mt-1 mb-2"></div>
                  <p className="text-sm text-white/90">
                    Ramaniyam Marvel, No B27, Seshadripuram,
                  </p>
                  <p className="text-sm text-white/90">
                    1st Main Road, Velachery, Chennai 42.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-white">INVOICE</h2>
              </div>
            </div>
          </div>

          <div className="p-8">
            {sections
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .filter((section) => section.id !== "terms")
              .map((section) => {
                if (section.sectionName === "BILLING") {
                  return (
                    <div key={section.id} className="mb-8">
                      <BillingTable
                        theme={theme}
                        items={billingItems}
                        onItemsChange={updateBillingItems}
                        previewMode={previewMode}
                      />
                    </div>
                  );
                }
                return renderSection(section);
              })}

            <div className="mb-8 flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-1 text-sm">
                  <span className="font-medium">Sub Total:</span>
                  <span className="font-medium">
                    {template.includes("us-contract") ? "$" : "₹"}
                    {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {!template.includes("us-contract") && (
                  <>
                    <div className="flex justify-between py-1 text-sm items-center">
                      <span className="font-medium">IGST:</span>
                      <div className="flex items-center gap-2">
                        {previewMode ? (
                          <span className="font-medium">
                            ({gstRate}%) ₹{taxAmount.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <>
                            <span>(</span>
                            <input
                              type="number"
                              value={gstRate}
                              onChange={(e) =>
                                setGstRate(Number(e.target.value) || 0)
                              }
                              className="w-12 px-1 py-0.5 border rounded text-xs text-center"
                              style={{ borderColor: themeColors.secondary }}
                              min="0"
                              max="100"
                            />
                            <span>%) ₹{taxAmount.toLocaleString("en-IN")}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between py-1 text-sm items-center">
                      <span className="font-medium">CGST:</span>
                      <div className="flex items-center gap-2">
                        {previewMode ? (
                          <span className="font-medium">
                            ({cgstRate || 0}%) ₹
                            {cgstAmount.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <>
                            <span>(</span>
                            <input
                              type="number"
                              value={cgstRate || 0}
                              onChange={(e) =>
                                setCgstRate(Number(e.target.value) || 0)
                              }
                              className="w-12 px-1 py-0.5 border rounded text-xs text-center"
                              style={{ borderColor: themeColors.secondary }}
                              min="0"
                              max="100"
                            />
                            <span>
                              %) ₹{cgstAmount.toLocaleString("en-IN")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between py-1 text-sm items-center">
                      <span className="font-medium">SGST:</span>
                      <div className="flex items-center gap-2">
                        {previewMode ? (
                          <span className="font-medium">
                            ({sgstRate || 0}%) ₹
                            {sgstAmount.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <>
                            <span>(</span>
                            <input
                              type="number"
                              value={sgstRate || 0}
                              onChange={(e) =>
                                setSgstRate(Number(e.target.value) || 0)
                              }
                              className="w-12 px-1 py-0.5 border rounded text-xs text-center"
                              style={{ borderColor: themeColors.secondary }}
                              min="0"
                              max="100"
                            />
                            <span>
                              %) ₹{sgstAmount.toLocaleString("en-IN")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="flex justify-between py-2 border-t font-bold text-base"
                  style={{ borderColor: themeColors.secondary }}
                >
                  <span>Total Amount:</span>
                  <span>
                    {template.includes("us-contract") ? "$" : "₹"}
                    {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {sections
              .filter((section) => section.id === "terms")
              .map((section: any) => renderSection(section))}

            {!previewMode && (
              <div className="mb-8 flex justify-center gap-4">
                <button
                  onClick={() => setShowAddSectionDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Section
                </button>
              </div>
            )}

            <div className="mt-16 flex justify-between items-end">
              <div className="flex-1">
                <div className="mb-4 flex justify-center">
                  {previewMode ? (
                    getFieldValue("company-signature") ? (
                      <img
                        src="/images/company-signature.png"
                        alt="Company Signature"
                        className="w-24 h-16 object-contain"
                      />
                    ) : (
                      <div className="w-24 h-16 mr-64 border border-dashed border-gray-300 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          No Signature
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col mr-24 items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full max-w-xs text-sm"
                      />
                      {getFieldValue("Company Signature") && (
                        <img
                          src={
                            getFieldValue("company-signature") ||
                            "/placeholder.svg"
                          }
                          alt="Company Signature Preview"
                          className="w-24 h-16 object-contain border rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium">
                  Issued by Seertech Systems
                </p>
              </div>
              <div className="flex-1 text-right">
                <div className="mb-16"></div>
                <p className="text-sm font-medium">Accepted By XXXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the dialogs remain exactly the same */}
      <Transition appear show={showAddSectionDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowAddSectionDialog(false)}
        >
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Add New Section
                  </Dialog.Title>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="sectionSelect"
                        className="text-right text-sm font-medium"
                      >
                        Select Section
                      </label>
                      <select
                        id="sectionSelect"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose from existing sections</option>
                        <option value="custom">
                          -- Create Custom Section --
                        </option>
                        {availableSections
                          .filter(
                            (section) =>
                              !sections.find(
                                (s) => s.sectionID === section.sectionId
                              )
                          )
                          .map((section) => (
                            <option
                              key={section.sectionId}
                              value={section.sectionId.toString()}
                            >
                              {section.sectionName}
                            </option>
                          ))}
                      </select>
                    </div>

                    {selectedSection === "custom" ? (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="sectionName"
                            className="text-right text-sm font-medium"
                          >
                            Section Name *
                          </label>
                          <input
                            id="sectionName"
                            type="text"
                            value={newSection.sectionName}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                sectionName: e.target.value,
                              })
                            }
                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new section name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="description"
                            className="text-right text-sm font-medium"
                          >
                            Description
                          </label>
                          <input
                            id="description"
                            type="text"
                            value={newSection.description}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                description: e.target.value,
                              })
                            }
                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter description (optional)"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="gridLayout"
                            className="text-right text-sm font-medium"
                          >
                            Grid Layout
                          </label>
                          <select
                            id="gridLayout"
                            value={`${newSection.gridRows}x${newSection.gridColumns}`}
                            onChange={(e) => {
                              const [rows, columns] = e.target.value
                                .split("x")
                                .map(Number);
                              setNewSection({
                                ...newSection,
                                gridRows: rows,
                                gridColumns: columns,
                              });
                            }}
                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="1x1">1 × 1</option>
                            <option value="1x2">1 × 2</option>
                            <option value="1x3">1 × 3</option>
                            <option value="1x4">1 × 4</option>
                            <option value="2x1">2 × 1</option>
                            <option value="2x2">2 × 2</option>
                            <option value="2x3">2 × 3</option>
                            <option value="2x4">2 × 4</option>
                            <option value="3x1">3 × 1</option>
                            <option value="3x2">3 × 2</option>
                            <option value="3x3">3 × 3</option>
                            <option value="3x4">3 × 4</option>
                            <option value="4x1">4 × 1</option>
                            <option value="4x2">4 × 2</option>
                            <option value="4x3">4 × 3</option>
                            <option value="4x4">4 × 4</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="gridGap"
                            className="text-right text-sm font-medium"
                          >
                            Grid Gap
                          </label>
                          <select
                            id="gridGap"
                            value={newSection.gridGap}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                gridGap: e.target.value,
                              })
                            }
                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="10px">Small</option>
                            <option value="20px">Medium</option>
                            <option value="30px">Large</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="displayOrder"
                            className="text-right text-sm font-medium"
                          >
                            Display Order
                          </label>
                          <select
                            id="displayOrder"
                            value={newSection.displayOrder.toString()}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                displayOrder: Number.parseInt(e.target.value),
                              })
                            }
                            className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {sections.map((_, index) => (
                              <option
                                key={index + 1}
                                value={(index + 1).toString()}
                              >
                                Position {index + 1}
                              </option>
                            ))}
                            <option value={(sections.length + 1).toString()}>
                              Position {sections.length + 1} (End)
                            </option>
                          </select>
                        </div>
                      </>
                    ) : selectedSection ? (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor="displayOrder"
                          className="text-right text-sm font-medium"
                        >
                          Display Order
                        </label>
                        <select
                          id="displayOrder"
                          value={newSection.displayOrder.toString()}
                          onChange={(e) =>
                            setNewSection({
                              ...newSection,
                              displayOrder: Number.parseInt(e.target.value),
                            })
                          }
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {sections.map((_, index) => (
                            <option
                              key={index + 1}
                              value={(index + 1).toString()}
                            >
                              Position {index + 1}
                            </option>
                          ))}
                          <option value={(sections.length + 1).toString()}>
                            Position {sections.length + 1} (End)
                          </option>
                        </select>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setShowAddSectionDialog(false)}
                    >
                      Cancel
                    </button>
                    {selectedSection === "custom" ? (
                      <button
                        type="button"
                        onClick={createCustomSection}
                        disabled={!newSection.sectionName.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create & Add Section
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={addNewSection}
                        disabled={!selectedSection}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Section
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={!!editingSection} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setEditingSection(null)}
        >
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Edit Section
                  </Dialog.Title>

                  {editingSection && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor="editSectionName"
                          className="text-right text-sm font-medium"
                        >
                          Section Name
                        </label>
                        <input
                          id="editSectionName"
                          type="text"
                          value={editingSection.sectionName}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              sectionName: e.target.value,
                            })
                          }
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor="editDescription"
                          className="text-right text-sm font-medium"
                        >
                          Description
                        </label>
                        <input
                          id="editDescription"
                          type="text"
                          value={editingSection.description || ""}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              description: e.target.value,
                            })
                          }
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor="editGridLayout"
                          className="text-right text-sm font-medium"
                        >
                          Grid Layout
                        </label>
                        <select
                          id="editGridLayout"
                          value={`${getGridRowsCount(
                            editingSection.layoutConfig.gridRows
                          )}x${getGridColumnsCount(
                            editingSection.layoutConfig.gridColumns
                          )}`}
                          onChange={(e) => {
                            const [rows, columns] = e.target.value
                              .split("x")
                              .map(Number);
                            setEditingSection({
                              ...editingSection,
                              layoutConfig: {
                                ...editingSection.layoutConfig,
                                gridRows: `${rows}fr`,
                                gridColumns: `${columns}fr`,
                              },
                            });
                          }}
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="1x1">1 × 1</option>
                          <option value="1x2">1 × 2</option>
                          <option value="1x3">1 × 3</option>
                          <option value="1x4">1 × 4</option>
                          <option value="2x1">2 × 1</option>
                          <option value="2x2">2 × 2</option>
                          <option value="2x3">2 × 3</option>
                          <option value="2x4">2 × 4</option>
                          <option value="3x1">3 × 1</option>
                          <option value="3x2">3 × 2</option>
                          <option value="3x3">3 × 3</option>
                          <option value="3x4">3 × 4</option>
                          <option value="4x1">4 × 1</option>
                          <option value="4x2">4 × 2</option>
                          <option value="4x3">4 × 3</option>
                          <option value="6x2">6 × 2</option>
                          <option value="7x2">7 × 2</option>
                          <option value="8x2">8 × 2</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor="editGridGap"
                          className="text-right text-sm font-medium"
                        >
                          Grid Gap
                        </label>
                        <select
                          id="editGridGap"
                          value={editingSection.layoutConfig.gridGap}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              layoutConfig: {
                                ...editingSection.layoutConfig,
                                gridGap: e.target.value,
                              },
                            })
                          }
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="10px">Small</option>
                          <option value="20px">Medium</option>
                          <option value="30px">Large</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label
                          htmlFor="editDisplayOrder"
                          className="text-right text-sm font-medium"
                        >
                          Display Order
                        </label>
                        <select
                          id="editDisplayOrder"
                          value={editingSection.displayOrder.toString()}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              displayOrder: Number.parseInt(e.target.value),
                            })
                          }
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {sections.map((_, index) => (
                            <option
                              key={index + 1}
                              value={(index + 1).toString()}
                            >
                              Position {index + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setEditingSection(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={updateSection}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Section
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}