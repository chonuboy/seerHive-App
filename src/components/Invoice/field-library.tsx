"use client";

import type React from "react";
import {
  Search,
  Type,
  Calendar,
  Hash,
  DollarSign,
  FileText,
  GripVertical,
  Edit,
  Trash2,
  Settings,
  Loader2,
  Plus,
  Database,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

// API imports
import { fetchAllInvoiceFields } from "../../api/invoice/invoice-field-master";
import {
  fetchTemplateFieldMapsByTemplate,
  createTemplateFieldMap,
  updateTemplateFieldMap,
  deleteTemplateFieldMap,
} from "../../api/invoice/templatefieldmap";
import { fetchAllInvoiceTemplates } from "../../api/invoice/invoicetemplate";
import { fetchAllInvoiceSections } from "../../api/invoice/invoice-section-master";

// Field Attributes APIs
import {
  fetchAllFieldAttributesSets,
  createFieldAttributesSet,
  updateFieldAttributesSet,
  deleteFieldAttributesSet,
  fetchFieldAttributesSet,
} from "../../api/invoice/attributes-set";
import {
  fetchAllFieldAttributes,
  createFieldAttribute,
  updateFieldAttribute,
  deleteFieldAttribute,
  fetchFieldAttributesBySetId,
  fetchFieldAttribute,
} from "../../api/invoice/attributes";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { toast } from "react-toastify";

// Types based on your actual database schema
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

interface InvoiceSectionMaster {
  sectionId: number;
  sectionName: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  layoutConfig: {
    layoutConfigId: number;
    gridColumns: string;
    gridGap: string;
    gridRows: string;
  };
}

interface BillingType {
  billingTypeId: number;
  billingTypeName: string;
  updatedBy?: string;
  updatedOn?: string;
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

interface FieldAttributesSet {
  attributesSetId: number;
  category: string;
  templateFieldMap: TemplateFieldMap;
}

interface FieldAttribute {
  fieldAttributeId: number;
  attributesSet: FieldAttributesSet;
  attributeName: string;
  attributeValue: string;
}

// Props for the component
interface FieldLibraryProps {
  currentTemplateId: number;
  onFieldMappingUpdate: (mappings: TemplateFieldMap[]) => void;
}

export default function FieldLibrary({
  currentTemplateId,
  onFieldMappingUpdate,
}: FieldLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"available" | "mapped">(
    "mapped"
  );
  const [isLoading, setIsLoading] = useState({
    masterFields: false,
    templateMappings: false,
    templates: false,
    sections: false,
    attributes: false,
    saving: false,
  });

  // Data states
  const [masterFields, setMasterFields] = useState<InvoiceFieldMaster[]>([]);
  const [templateMappings, setTemplateMappings] = useState<TemplateFieldMap[]>(
    []
  );
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [attributesSets, setAttributesSets] = useState<FieldAttributesSet[]>(
    []
  );
  const [showAddFromMasterDialog, setShowAddFromMasterDialog] = useState(false);

  const [showStylingDialog, setShowStylingDialog] = useState(false);
  const [editingFieldStyle, setEditingFieldStyle] =
    useState<TemplateFieldMap | null>(null);
  const [fieldAttributes, setFieldAttributes] = useState<FieldAttribute[]>([]);
  const [activeStyleCategory, setActiveStyleCategory] = useState<string>("");

  // New states for attribute set creation
  const [showCreateAttributeSetDialog, setShowCreateAttributeSetDialog] =
    useState(false);
  const [newAttributeSet, setNewAttributeSet] = useState({
    category: "",
    templateFieldMapId: 0,
  });

  // New states for attribute creation
  const [showCreateAttributeDialog, setShowCreateAttributeDialog] =
    useState(false);
  const [newAttribute, setNewAttribute] = useState({
    attributesSetId: 0,
    attributeName: "",
    attributeValue: "",
  });

  // Form states
  const [showMappingForm, setShowMappingForm] = useState(false);
  const [editingMapping, setEditingMapping] = useState<TemplateFieldMap | null>(
    null
  );
  const [sections, setSections] = useState<InvoiceSectionMaster[]>([]);
  const [newMapping, setNewMapping] = useState<{
    template: { templateId: number };
    invoiceFieldMaster: InvoiceFieldMaster | null;
    invoiceSectionMaster: InvoiceSectionMaster | null;
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
  }>({
    template: { templateId: currentTemplateId },
    invoiceFieldMaster: null,
    invoiceSectionMaster: null,
    displayLabel: "",
    controlType: "text",
    displayOrder: 1,
    isRequired: false,
    isEditable: true,
    isVisible: true,
  });

  // Load data on component mount and when template changes
  useEffect(() => {
    loadAllData();
  }, [currentTemplateId]);

  const loadAllData = async () => {
    await Promise.all([
      loadMasterFields(),
      loadTemplateMappings(),
      loadTemplates(),
      loadAttributesSets(),
      loadSections(),
    ]);
  };

  // API calls with proper error handling
  const loadSections = async () => {
    setIsLoading((prev) => ({ ...prev, sections: true }));
    try {
      const response = await fetchAllInvoiceSections();
      console.log("Sections response:", response);

      if (response && !response.error && Array.isArray(response.content)) {
        setSections(response.content);
      } else {
        setSections([]);
        if (response?.error) {
          console.log("err");
        }
      }
    } catch (error) {
      console.error("Error loading sections:", error);
      setSections([]);
      console.log("err");
    } finally {
      setIsLoading((prev) => ({ ...prev, sections: false }));
    }
  };

  const loadMasterFields = async () => {
    setIsLoading((prev) => ({ ...prev, masterFields: true }));
    try {
      const response = await fetchAllInvoiceFields();
      console.log("Master fields response:", response);

      if (response && !response.error && Array.isArray(response.content)) {
        setMasterFields(response.content);
      } else {
        setMasterFields([]);
        if (response?.error) {
          console.log("err");
        }
      }
    } catch (error) {
      console.error("Error loading master fields:", error);
      setMasterFields([]);
      console.log("err");
    } finally {
      setIsLoading((prev) => ({ ...prev, masterFields: false }));
    }
  };

  const loadTemplateMappings = async () => {
    setIsLoading((prev) => ({ ...prev, templateMappings: true }));
    try {
      const response = await fetchTemplateFieldMapsByTemplate(
        currentTemplateId
      );
      console.log("Template mappings response:", response);

      if (response && !response.error && Array.isArray(response.content)) {
        setTemplateMappings(response.content);
        onFieldMappingUpdate(response.content);
      } else {
        setTemplateMappings([]);
        onFieldMappingUpdate([]);
        if (response?.error) {
          console.log("err");
        }
      }
    } catch (error) {
      console.error("Error loading template mappings:", error);
      setTemplateMappings([]);
      onFieldMappingUpdate([]);
      console.log("err");
    } finally {
      setIsLoading((prev) => ({ ...prev, templateMappings: false }));
    }
  };

  const loadTemplates = async () => {
    setIsLoading((prev) => ({ ...prev, templates: true }));
    try {
      const response = await fetchAllInvoiceTemplates();
      console.log("Templates response:", response);

      if (response && !response.error && Array.isArray(response.content)) {
        setTemplates(response.content);
      } else {
        setTemplates([]);
        if (response?.error) {
          console.log("err");
        }
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      setTemplates([]);
      console.log("err");
    } finally {
      setIsLoading((prev) => ({ ...prev, templates: false }));
    }
  };

  const loadAttributesSets = async () => {
    setIsLoading((prev) => ({ ...prev, attributes: true }));
    try {
      const response = await fetchAllFieldAttributesSets();
      console.log("Attributes sets response:", response);

      if (response && !response.error && Array.isArray(response.content)) {
        setAttributesSets(response.content);
      } else {
        setAttributesSets([]);
        if (response?.error) {
          console.log("err");
        }
      }
    } catch (error) {
      console.error("Error loading attributes sets:", error);
      setAttributesSets([]);
      console.log("err");
    } finally {
      setIsLoading((prev) => ({ ...prev, attributes: false }));
    }
  };

  const loadFieldAttributes = async (mappingId: number) => {
    try {
      // First check if attribute set exists for this mapping
      const attributeSet = attributesSets.find(
        (set) => set.templateFieldMap.templateFieldMapId === mappingId
      );

      if (attributeSet) {
        const response = await fetchFieldAttributesBySetId(
          attributeSet.attributesSetId
        );

        console.log(response);
        if (response && !response.error && Array.isArray(response.content)) {
          setFieldAttributes(response.content);
        } else {
          setFieldAttributes([]);
          if (response?.error) {
            console.log("err");
          }
        }
      } else {
        setFieldAttributes([]);
      }
    } catch (error) {
      console.error("Error loading field attributes:", error);
      setFieldAttributes([]);
      console.log("err");
    }
  };

  // Create Attribute Set
  const handleCreateAttributeSet = async () => {
    if (!newAttributeSet.category || !newAttributeSet.templateFieldMapId) {
      console.log("err");
      return;
    }

    if (
      newAttributeSet.category.length < 3 ||
      newAttributeSet.category.length > 100
    ) {
      return;
    }

    setIsLoading((prev) => ({ ...prev, saving: true }));
    try {
      const response = await createFieldAttributesSet({
        category: newAttributeSet.category,
        templateFieldMap: {
          templateFieldMapId: newAttributeSet.templateFieldMapId,
        },
      });

      console.log(response);

      if (response && !response.error) {
        setAttributesSets((prev) => [...prev, response]);
        setShowCreateAttributeSetDialog(false);
        setNewAttributeSet({ category: "", templateFieldMapId: 0 });

        // If we're in styling dialog, reload attributes
        if (editingFieldStyle) {
          await loadFieldAttributes(editingFieldStyle.templateFieldMapId);
        }
      } else {
        throw new Error(response?.error || "Failed to create attribute set");
      }
    } catch (error: any) {
      console.error("Error creating attribute set:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  // Create Attribute
  const handleCreateAttribute = async () => {
    if (
      !newAttribute.attributesSetId ||
      !newAttribute.attributeName ||
      !newAttribute.attributeValue
    ) {
      console.log("err");
      return;
    }

    setIsLoading((prev) => ({ ...prev, saving: true }));
    try {
      const response = await createFieldAttribute({
        attributesSet: {
          attributesSetId: newAttribute.attributesSetId,
        },
        attributeName: newAttribute.attributeName,
        attributeValue: newAttribute.attributeValue,
      });

      console.log(response);

      if (response && !response.error) {
        setFieldAttributes((prev) => [...prev, response]);
        setShowCreateAttributeDialog(false);
        setNewAttribute({
          attributesSetId: 0,
          attributeName: "",
          attributeValue: "",
        });
      } else {
        throw new Error(response?.error || "Failed to create attribute");
      }
    } catch (error: any) {
      console.error("Error creating attribute:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const updateFieldAttributeValue = async (
    attributeId: number,
    attributeName: string,
    attributeValue: string,
    attributesSetId: number
  ) => {
    try {
      const response = await updateFieldAttribute(attributeId, {
        attributesSet: {
          attributesSetId: attributesSetId,
        },
        attributeName: attributeName,
        attributeValue: attributeValue,
      });

      if (response && !response.error) {
        setFieldAttributes((prev) =>
          prev.map((attr) =>
            attr.fieldAttributeId === attributeId
              ? { ...attr, attributeName, attributeValue }
              : attr
          )
        );
      } else {
        throw new Error(response?.error || "Failed to update attribute");
      }
    } catch (error) {
      console.error("Error updating field attribute:", error);
    }
  };

  const removeAttribute = async (attributeId: number) => {
    try {
      const response = await deleteFieldAttribute(attributeId);
      if(response.status === 200){
        toast.success("Attribute removed successfully",{position:"top-right"});
      }
    } catch (error) {
      console.error("Error removing attribute:", error);
    }
  };

  const openStylingDialog = async (mapping: TemplateFieldMap) => {
    setEditingFieldStyle(mapping);
    await loadFieldAttributes(mapping.templateFieldMapId);
    setShowStylingDialog(true);
  };

  const saveStyling = async () => {
    if (!editingFieldStyle) return;

    setIsLoading((prev) => ({ ...prev, saving: true }));
    try {
      // Save all attribute changes
      const savePromises = fieldAttributes.map((attribute) =>
        updateFieldAttribute(attribute.fieldAttributeId, {
          attributesSet: {
            attributesSetId: attribute.attributesSet.attributesSetId,
          },
          attributeName: attribute.attributeName,
          attributeValue: attribute.attributeValue,
        })
      );

      await Promise.all(savePromises);
      setShowStylingDialog(false);
      setEditingFieldStyle(null);
      setFieldAttributes([]);
    } catch (error) {
      console.error("Error saving styling:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const getStyleCategoryAttributes = (category: string) => {
    const attributeSet = attributesSets.find(
      (set) =>
        set.templateFieldMap.templateFieldMapId ===
          editingFieldStyle?.templateFieldMapId && set.category === category
    );

    if (!attributeSet) return [];

    return fieldAttributes.filter(
      (attr) =>
        attr.attributesSet.attributesSetId === attributeSet.attributesSetId
    );
  };

  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      container: "Width, height, padding, background",
      label: "Font, color, spacing for field labels",
      field: "Input styling, borders, colors",
      text: "Text formatting and styling",
      layout: "Positioning and arrangement",
      border: "Border styles and properties",
      animation: "Transitions and animations",
      typography: "Font styles and text properties",
      spacing: "Margins, padding, and gaps",
      effects: "Shadows, filters, and visual effects",
    };

    return descriptions[category.toLowerCase()] || "Custom styling properties";
  };

  const getAttributeSetForCategory = (category: string) => {
    return attributesSets.find(
      (set) =>
        set.templateFieldMap.templateFieldMapId ===
          editingFieldStyle?.templateFieldMapId && set.category === category
    );
  };

  // Helper functions
  const getMappedFieldIds = () => {
    return templateMappings.map(
      (mapping) => mapping.invoiceFieldMaster.invoiceFieldId
    );
  };

  const getAvailableFields = () => {
    const mappedIds = getMappedFieldIds();
    return masterFields.filter(
      (field) =>
        field.isActive &&
        !mappedIds.includes(field.invoiceFieldId) &&
        (field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (field.description &&
            field.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  };

  const getMappedFields = () => {
    return templateMappings
      .filter((mapping) => mapping.invoiceFieldMaster)
      .filter(
        (mapping) =>
          mapping.invoiceFieldMaster.fieldName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          mapping.displayLabel
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (mapping.tooltipText &&
            mapping.tooltipText
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
  };

  const handleCreateMapping = async () => {
    if (
      !newMapping.invoiceFieldMaster ||
      !newMapping.displayLabel ||
      !newMapping.invoiceSectionMaster
    ) {
      console.error("Missing required fields");
      return;
    }

    setIsLoading((prev) => ({ ...prev, saving: true }));
    try {
      // Use the exact same structure as your working Swagger example
      const reqData = {
        template: {
          templateId: currentTemplateId,
        },
        invoiceFieldMaster: {
          invoiceFieldId: newMapping.invoiceFieldMaster.invoiceFieldId,
        },
        invoiceSectionMaster: {
          sectionId: newMapping.invoiceSectionMaster.sectionId,
        },
        displayLabel: newMapping.displayLabel,
        controlType: newMapping.controlType || "text",
        displayOrder: newMapping.displayOrder || templateMappings.length + 1,
        isRequired: newMapping.isRequired || false,
        isEditable: newMapping.isEditable !== false,
        isVisible: newMapping.isVisible !== false,
        defaultValue: newMapping.defaultValue || null,
        maxLength: newMapping.maxLength || null,
        decimalPlaces: newMapping.decimalPlaces || null,
        dropdownOptions: newMapping.dropdownOptions || null,
        validationRegex: newMapping.validationRegex || null,
        tooltipText: newMapping.tooltipText || null,
      };

      console.log(
        "Creating mapping with data:",
        JSON.stringify(reqData, null, 2)
      );

      const response = await createTemplateFieldMap(reqData);
      console.log("Create mapping response:", response);

      if (response && !response.error) {
        // Instead of using the response directly, reload the mappings to get complete data
        await loadTemplateMappings();

        setShowMappingForm(false);
        resetNewMapping();

        console.log("Field mapping created successfully");
      } else {
        throw new Error(
          response?.error ||
            response?.message ||
            response?.toString() ||
            "Failed to create field mapping"
        );
      }
    } catch (error: any) {
      console.error("Error creating field mapping:", error);
      alert(`Failed to create field mapping: ${error.message}`);
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleAddFromMasterData = (field: InvoiceFieldMaster) => {
    setNewMapping({
      ...newMapping,
      invoiceFieldMaster: field,
      displayLabel: field.fieldName,
      maxLength: field.maxLengthOfField,
      controlType:
        field.dataType === "textarea"
          ? "textarea"
          : field.dataType === "number"
          ? "number"
          : "text",
    });
    setShowAddFromMasterDialog(false);
    setShowMappingForm(true);
  };

  const handleUpdateMapping = async () => {
    if (!editingMapping) return;

    setIsLoading((prev) => ({ ...prev, saving: true }));
    try {
      const updateData = {
        templateFieldMapId: editingMapping.templateFieldMapId,
        templateId: currentTemplateId,
        invoiceFieldId: editingMapping.invoiceFieldMaster.invoiceFieldId,
        sectionId: editingMapping.invoiceSectionMaster.sectionId,
        displayLabel: editingMapping.displayLabel,
        controlType: editingMapping.controlType,
        displayOrder: editingMapping.displayOrder,
        isRequired: editingMapping.isRequired,
        isEditable: editingMapping.isEditable,
        isVisible: editingMapping.isVisible,
        defaultValue: editingMapping.defaultValue || "",
        maxLength: editingMapping.maxLength,
        decimalPlaces: editingMapping.decimalPlaces,
        dropdownOptions: editingMapping.dropdownOptions || "",
        validationRegex: editingMapping.validationRegex || "",
        tooltipText: editingMapping.tooltipText || "",
      };

      const response = await updateTemplateFieldMap(
        editingMapping.templateFieldMapId,
        updateData
      );

      if (response && !response.error) {
        const updatedMapping: TemplateFieldMap = response;

        const updatedMappings = templateMappings.map((mapping) =>
          mapping.templateFieldMapId === editingMapping.templateFieldMapId
            ? updatedMapping
            : mapping
        );

        setTemplateMappings(updatedMappings);
        onFieldMappingUpdate(updatedMappings);
        setEditingMapping(null);
      } else {
        throw new Error(
          response?.error ||
            response?.message ||
            "Failed to update field mapping"
        );
      }
    } catch (error: any) {
      console.error("Error updating field mapping:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleDeleteMapping = async (mappingId: number) => {

    setIsLoading((prev) => ({ ...prev, saving: true }));
    try {
      const response: any = await deleteTemplateFieldMap(mappingId);
      console.log(response);
      if(response.status === 204){
        toast.success("Field Deleted Successfully",{
          position:"top-right"
        })
      }

      // if (response && !response.error) {
      //   const updatedMappings = templateMappings.filter(
      //     (mapping) => mapping.templateFieldMapId !== mappingId
      //   );
      //   setTemplateMappings(updatedMappings);
      //   onFieldMappingUpdate(updatedMappings);

      //   // Also delete associated attribute sets
      //   const associatedAttributeSets = attributesSets.filter(
      //     (set) => set.templateFieldMap.templateFieldMapId === mappingId
      //   );
      //   for (const attributeSet of associatedAttributeSets) {
      //     await deleteFieldAttributesSet(attributeSet.attributesSetId);
      //   }
      // } else {
      //   throw new Error(
      //     response?.error ||
      //       response?.message ||
      //       "Failed to delete field mapping"
      //   );
      // }
    } catch (error: any) {
      console.error("Error deleting field mapping:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const resetNewMapping = () => {
    setNewMapping({
      template: { templateId: currentTemplateId },
      invoiceFieldMaster: null,
      invoiceSectionMaster: null,
      displayLabel: "",
      controlType: "text",
      displayOrder: templateMappings.length + 1,
      isRequired: false,
      isEditable: true,
      isVisible: true,
      defaultValue: "",
      maxLength: 255,
      decimalPlaces: 2,
    });
  };

  const getFieldIcon = (dataType: string) => {
    switch (dataType.toLowerCase()) {
      case "text":
        return Type;
      case "textarea":
        return FileText;
      case "date":
        return Calendar;
      case "currency":
        return DollarSign;
      case "number":
        return Hash;
      default:
        return Type;
    }
  };

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    field: InvoiceFieldMaster,
    isMapped = false
  ) => {
    // Determine default value based on field type and current template
    let defaultValue = "";
    if (field.fieldName.includes("GST") || field.fieldName.includes("IGST")) {
      defaultValue = field.fieldName.includes("Percentage") ? "18" : "XXX";
    } else if (
      field.fieldName.includes("Amount") ||
      field.fieldName.includes("Value")
    ) {
      defaultValue = "XXX";
    } else if (field.fieldName.includes("Date")) {
      defaultValue = new Date().toISOString().split("T")[0];
    } else {
      defaultValue = "XXX";
    }

    const fieldData = {
      id: field.fieldName,
      name: field.fieldName,
      type: field.dataType,
      defaultValue: defaultValue,
      isMapped,
      fieldId: field.invoiceFieldId,
      displayLabel: field.fieldName,
      controlType:
        field.dataType === "textarea"
          ? "textarea"
          : field.dataType === "number"
          ? "number"
          : "text",
      maxLength: field.maxLengthOfField,
      description: field.description,
    };

    e.dataTransfer.setData("application/json", JSON.stringify(fieldData));
    e.dataTransfer.effectAllowed = "copy";
  };

  const availableFields = getAvailableFields();
  const mappedFields = getMappedFields();

  // Loading states
  if (isLoading.masterFields || isLoading.templateMappings) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span>Loading field library...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Field Library Manager
        </h3>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => setShowMappingForm(true)}
            disabled={availableFields.length === 0}
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {/* <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "available"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Available Fields ({availableFields.length})
          </button> */}
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "mapped"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("mapped")}
          >
            Template Fields ({mappedFields.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded text-sm"
        />
      </div>

      {/* Mapping Form */}
      {showMappingForm && (
        <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
          <h4 className="text-md font-medium mb-3">Add Field to Template</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Field *
              </label>
              <select
                value={newMapping.invoiceFieldMaster?.invoiceFieldId || ""}
                onChange={(e) => {
                  const fieldId = Number.parseInt(e.target.value);
                  const selectedField = masterFields.find(
                    (f) => f.invoiceFieldId === fieldId
                  );
                  setNewMapping({
                    ...newMapping,
                    invoiceFieldMaster: selectedField || null,
                    displayLabel: selectedField?.fieldName || "",
                    maxLength: selectedField?.maxLengthOfField || 255,
                    controlType: selectedField
                      ? selectedField.dataType === "textarea"
                        ? "textarea"
                        : selectedField.dataType === "number"
                        ? "number"
                        : "text"
                      : "text",
                  });
                }}
                className="w-full px-3 py-2 border rounded text-sm"
                required
              >
                <option value="">Choose a field...</option>
                {availableFields.map((field) => (
                  <option
                    key={field.invoiceFieldId}
                    value={field.invoiceFieldId}
                  >
                    {field.fieldName} ({field.dataType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section *
              </label>
              <select
                value={newMapping.invoiceSectionMaster?.sectionId || ""}
                onChange={(e) => {
                  const sectionId = Number.parseInt(e.target.value);
                  const selectedSection = sections.find(
                    (s) => s.sectionId === sectionId
                  );
                  setNewMapping({
                    ...newMapping,
                    invoiceSectionMaster: selectedSection || null,
                  });
                }}
                className="w-full px-3 py-2 border rounded text-sm"
                required
              >
                <option value="">Choose a section...</option>
                {sections.map((section) => (
                  <option key={section.sectionId} value={section.sectionId}>
                    {section.sectionName}
                    {section.description && ` - ${section.description}`}
                  </option>
                ))}
              </select>
              {sections.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No sections available. Please check if sections are properly
                  configured.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Label *
              </label>
              <input
                type="text"
                value={newMapping.displayLabel || ""}
                onChange={(e) =>
                  setNewMapping({ ...newMapping, displayLabel: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-sm"
                placeholder="Enter display label"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Control Type
              </label>
              <select
                value={newMapping.controlType || "text"}
                onChange={(e) =>
                  setNewMapping({ ...newMapping, controlType: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-sm"
              >
                <option value="text">Text Input</option>
                <option value="textarea">Text Area</option>
                <option value="date">Date Picker</option>
                <option value="number">Number</option>
                <option value="currency">Currency</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={newMapping.displayOrder || templateMappings.length + 1}
                onChange={(e) =>
                  setNewMapping({
                    ...newMapping,
                    displayOrder: Number.parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-3 py-2 border rounded text-sm"
                min="1"
              />
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newMapping.isRequired || false}
                  onChange={(e) =>
                    setNewMapping({
                      ...newMapping,
                      isRequired: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Required</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newMapping.isEditable !== false}
                  onChange={(e) =>
                    setNewMapping({
                      ...newMapping,
                      isEditable: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Editable</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newMapping.isVisible !== false}
                  onChange={(e) =>
                    setNewMapping({
                      ...newMapping,
                      isVisible: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Visible</span>
              </label>
            </div>

            {/* Additional optional fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Value
              </label>
              <input
                type="text"
                value={newMapping.defaultValue || ""}
                onChange={(e) =>
                  setNewMapping({ ...newMapping, defaultValue: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-sm"
                placeholder="Optional default value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tooltip Text
              </label>
              <input
                type="text"
                value={newMapping.tooltipText || ""}
                onChange={(e) =>
                  setNewMapping({ ...newMapping, tooltipText: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-sm"
                placeholder="Optional tooltip text"
              />
            </div>

            <div className="col-span-2 flex gap-2 justify-end">
              <button
                onClick={handleCreateMapping}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={
                  !newMapping.invoiceFieldMaster ||
                  !newMapping.displayLabel ||
                  !newMapping.invoiceSectionMaster ||
                  isLoading.saving
                }
              >
                {isLoading.saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add to Template"
                )}
              </button>
              <button
                onClick={() => {
                  setShowMappingForm(false);
                  resetNewMapping();
                }}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                disabled={isLoading.saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fields Display */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === "available" ? (
          <div className="space-y-2">
            {availableFields.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No available fields found</p>
                <p className="text-sm text-gray-400 mb-4">
                  {masterFields.length === 0
                    ? "No master fields available. Please check your configuration."
                    : "All master fields are already mapped to this template or no fields match your search."}
                </p>
                <button
                  onClick={() => setShowAddFromMasterDialog(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add from Master Data
                </button>
              </div>
            ) : (
              availableFields.map((field) => {
                const FieldIcon = getFieldIcon(field.dataType);
                return (
                  <div
                    key={field.invoiceFieldId}
                    className="p-3 border rounded bg-gray-50 hover:bg-gray-100 cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(e, field, false)}
                    onClick={() => {
                      setNewMapping({
                        ...newMapping,
                        invoiceFieldMaster: field,
                        displayLabel: field.fieldName,
                        maxLength: field.maxLengthOfField,
                        controlType:
                          field.dataType === "textarea"
                            ? "textarea"
                            : field.dataType === "number"
                            ? "number"
                            : "text",
                      });
                      setShowMappingForm(true);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <FieldIcon className="h-4 w-4 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{field.fieldName}</p>
                        <p className="text-xs text-gray-600">
                          {field.dataType} • Max Length:{" "}
                          {field.maxLengthOfField || "N/A"}
                        </p>
                        {field.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {field.description}
                          </p>
                        )}
                      </div>
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {mappedFields.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">
                  No fields mapped to this template
                </p>
                <p className="text-sm text-gray-400">
                  Add fields from the available fields tab or use the search to
                  find specific fields.
                </p>
              </div>
            ) : (
              mappedFields.map((mapping) => {
                const FieldIcon = getFieldIcon(
                  mapping.invoiceFieldMaster.dataType
                );

                return (
                  <div
                    key={mapping.templateFieldMapId}
                    className="p-4 border rounded bg-white hover:shadow-md transition-shadow group relative cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, mapping.invoiceFieldMaster, true)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400 mt-0.5" />
                      <FieldIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-medium">
                            {mapping.displayLabel}
                          </p>
                          {/* <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {mapping.invoiceSectionMaster.sectionName}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Order: {mapping.displayOrder}
                          </span> */}
                        </div>

                        <div className="flex gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            {mapping.invoiceFieldMaster.dataType}
                          </span>
                          {mapping.isRequired && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                              Required
                            </span>
                          )}
                          {!mapping.isEditable && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                              Read-only
                            </span>
                          )}
                          {!mapping.isVisible && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                              Hidden
                            </span>
                          )}
                        </div>

                        {mapping.tooltipText && (
                          <p className="text-xs text-gray-600">
                            Tooltip: {mapping.tooltipText}
                          </p>
                        )}
                        {mapping.defaultValue && (
                          <p className="text-xs text-gray-600">
                            Default: {mapping.defaultValue}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        className="p-1 hover:bg-purple-100 rounded text-purple-600"
                        onClick={() => openStylingDialog(mapping)}
                        title="Edit Styling"
                      >
                        <Settings className="h-3 w-3" />
                      </button>
                      <button
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        onClick={() =>
                          handleDeleteMapping(mapping.templateFieldMapId)
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Add from Master Data Dialog */}
      {showAddFromMasterDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Add Field from Master Data
              </h3>
              <button
                onClick={() => setShowAddFromMasterDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Select a field from the master data to add to your template:
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {masterFields
                  .filter((field) => field.isActive)
                  .map((field) => {
                    const FieldIcon = getFieldIcon(field.dataType);
                    return (
                      <div
                        key={field.invoiceFieldId}
                        className="p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleAddFromMasterData(field)}
                      >
                        <div className="flex items-center gap-3">
                          <FieldIcon className="h-4 w-4 text-gray-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {field.fieldName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {field.dataType} • Max Length:{" "}
                              {field.maxLengthOfField || "N/A"}
                            </p>
                            {field.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {field.description}
                              </p>
                            )}
                          </div>
                          <Plus className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setShowAddFromMasterDialog(false)}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styling Dialog */}
      {showStylingDialog && editingFieldStyle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Edit Styling: {editingFieldStyle.displayLabel}
              </h3>
              <button
                onClick={() => setShowStylingDialog(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading.saving}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Style Category Tabs */}
            <div className="border-b mb-4">
              <nav className="-mb-px flex space-x-8">
                {attributesSets
                  .filter(
                    (set) =>
                      set.templateFieldMap.templateFieldMapId ===
                      editingFieldStyle?.templateFieldMapId
                  )
                  .map((attributeSet) => (
                    <button
                      key={attributeSet.attributesSetId}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeStyleCategory === attributeSet.category
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() =>
                        setActiveStyleCategory(attributeSet.category as any)
                      }
                    >
                      <div>
                        <div className="capitalize">
                          {attributeSet.category} Style
                        </div>
                        <div className="text-xs text-gray-400">
                          {getCategoryDescription(attributeSet.category)}
                        </div>
                      </div>
                    </button>
                  ))}
                {/* Add button to create new category */}
                <button
                  className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  onClick={() => {
                    setNewAttributeSet({
                      category: "",
                      templateFieldMapId:
                        editingFieldStyle?.templateFieldMapId || 0,
                    });
                    setShowCreateAttributeSetDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <div>
                    <div>Add Style Category</div>
                    <div className="text-xs text-gray-400">
                      Create new styling category
                    </div>
                  </div>
                </button>
              </nav>
            </div>

            {/* Attributes for Selected Category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">
                  {activeStyleCategory} Attributes
                  {!getAttributeSetForCategory(activeStyleCategory) && (
                    <span className="text-xs text-red-500 ml-2">
                      (No attribute set created)
                    </span>
                  )}
                </h4>
                <div className="flex gap-2">
                  {!getAttributeSetForCategory(activeStyleCategory) ? (
                    <button
                      onClick={() => {
                        setNewAttributeSet({
                          category: activeStyleCategory,
                          templateFieldMapId:
                            editingFieldStyle.templateFieldMapId,
                        });
                        setShowCreateAttributeSetDialog(true);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      disabled={isLoading.saving}
                    >
                      Create Attribute Set
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const attributeSet =
                          getAttributeSetForCategory(activeStyleCategory);
                        if (attributeSet) {
                          setNewAttribute({
                            attributesSetId: attributeSet.attributesSetId,
                            attributeName: "",
                            attributeValue: "",
                          });
                          setShowCreateAttributeDialog(true);
                        }
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      disabled={isLoading.saving}
                    >
                      Add Attribute
                    </button>
                  )}
                </div>
              </div>

              {getAttributeSetForCategory(activeStyleCategory) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getStyleCategoryAttributes(activeStyleCategory).map(
                    (attribute) => (
                      <div
                        key={attribute.fieldAttributeId}
                        className="p-3 border rounded"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="text"
                            value={attribute.attributeName}
                            onChange={(e) => {
                              updateFieldAttributeValue(
                                attribute.fieldAttributeId,
                                e.target.value,
                                attribute.attributeValue,
                                attribute.attributesSet.attributesSetId
                              );
                            }}
                            className="font-medium text-sm border-none bg-transparent focus:outline-none focus:bg-gray-50 px-1 rounded"
                            placeholder="Attribute Name"
                            disabled={isLoading.saving}
                          />
                          <button
                            onClick={() =>
                              removeAttribute(attribute.fieldAttributeId)
                            }
                            className="text-red-500 hover:text-red-700 text-xs"
                            disabled={isLoading.saving}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          value={attribute.attributeValue}
                          onChange={(e) =>
                            updateFieldAttributeValue(
                              attribute.fieldAttributeId,
                              attribute.attributeName,
                              e.target.value,
                              attribute.attributesSet.attributesSetId
                            )
                          }
                          className="w-full px-3 py-2 border rounded text-sm"
                          placeholder="Value (e.g., 14px, #FFFFFF, bold)"
                          disabled={isLoading.saving}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Examples:{" "}
                          {attribute.attributeName === "FontSize"
                            ? "14px, 16px, 1.2rem"
                            : attribute.attributeName === "Color"
                            ? "#FFFFFF, rgb(255,255,255), white"
                            : attribute.attributeName === "Padding"
                            ? "8px, 10px 15px, 1rem"
                            : "CSS value"}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p>
                    No attribute set found for {activeStyleCategory} styling.
                  </p>
                  <p className="text-sm mb-4">
                    Click "Create Attribute Set" to start adding styling
                    properties.
                  </p>
                </div>
              )}

              {getAttributeSetForCategory(activeStyleCategory) &&
                getStyleCategoryAttributes(activeStyleCategory).length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    <Plus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p>
                      No attributes found for {activeStyleCategory} styling.
                    </p>
                    <p className="text-sm">
                      Click "Add Attribute" to create custom styling properties.
                    </p>
                  </div>
                )}
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowStylingDialog(false)}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                disabled={isLoading.saving}
              >
                Cancel
              </button>
              <button
                onClick={saveStyling}
                className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-2"
                disabled={isLoading.saving}
              >
                {isLoading.saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Styling"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Attribute Set Dialog */}
      {showCreateAttributeSetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Attribute Set</h3>
              <button
                onClick={() => setShowCreateAttributeSetDialog(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading.saving}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={newAttributeSet.category}
                  onChange={(e) =>
                    setNewAttributeSet((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Enter category (e.g., container, label, field)"
                  disabled={isLoading.saving}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be between 3 and 100 characters
                </p>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Field Map ID *
                </label>
                <input
                  type="number"
                  value={newAttributeSet.templateFieldMapId}
                  onChange={(e) =>
                    setNewAttributeSet((prev) => ({
                      ...prev,
                      templateFieldMapId: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Enter template field map ID"
                  disabled={isLoading.saving}
                />
              </div> */}
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowCreateAttributeSetDialog(false)}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                disabled={isLoading.saving}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAttributeSet}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-2"
                disabled={isLoading.saving}
              >
                {isLoading.saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Attribute Set"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Attribute Dialog */}
      {showCreateAttributeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Attribute</h3>
              <button
                onClick={() => setShowCreateAttributeDialog(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading.saving}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attribute Name *
                </label>
                <input
                  type="text"
                  value={newAttribute.attributeName}
                  onChange={(e) =>
                    setNewAttribute((prev) => ({
                      ...prev,
                      attributeName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Enter attribute name"
                  disabled={isLoading.saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attribute Value *
                </label>
                <input
                  type="text"
                  value={newAttribute.attributeValue}
                  onChange={(e) =>
                    setNewAttribute((prev) => ({
                      ...prev,
                      attributeValue: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder="Enter attribute value"
                  disabled={isLoading.saving}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowCreateAttributeDialog(false)}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                disabled={isLoading.saving}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAttribute}
                className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-2"
                disabled={isLoading.saving}
              >
                {isLoading.saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create Attribute"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
