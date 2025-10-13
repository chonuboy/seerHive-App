"use client";

import { Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { fetchTemplateFieldMapsByTemplate } from "@/api/invoice/templatefieldmap";
import { imgHelper } from "@/lib/image-helper";

interface PDFExportProps {
  templateId: number;
  fields?: any[];
  billingItems?: any[];
  totals?: {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    gstPercentage?: number;
    clientState?: string;
  };
  previewMode?: boolean;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: any) => void;
}

interface TemplateFieldMap {
  templateFieldMapId: number;
  template: {
    templateId: number;
    templateName: string;
    billingType: {
      billingTypeId: number;
      billingTypeName: string;
    };
    themeStyle: {
      themeId: number;
      themeName: string;
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      textColor: string;
    };
  };
  invoiceFieldMaster: {
    invoiceFieldId: number;
    fieldName: string;
    dataType: string;
  };
  invoiceSectionMaster: {
    sectionId: number;
    sectionName: string;
    layoutConfig: {
      layoutConfigId: number;
      gridColumns: string;
      gridGap: string;
      gridRows: string;
    };
  };
  displayLabel: string;
  controlType: string;
  displayOrder: number;
  isRequired: boolean;
  isEditable: boolean;
  isVisible: boolean;
  defaultValue?: string;
}

interface TemplateFieldMapsResponse {
  content: TemplateFieldMap[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

// Helper function to get field value
const getFieldValue = (fields: any[], fieldName: string): string => {
  const field = fields.find(
    (f) =>
      f.name?.toLowerCase().includes(fieldName.toLowerCase()) ||
      f.id?.toLowerCase().includes(fieldName.toLowerCase()) ||
      f.fieldData?.invoiceFieldMaster.fieldName
        ?.toLowerCase()
        .includes(fieldName.toLowerCase()) ||
      f.fieldData?.displayLabel?.toLowerCase().includes(fieldName.toLowerCase())
  );
  return field?.value || field?.fieldData?.defaultValue || "XXX";
};

// Format currency based on template type
const formatCurrency = (amount: number, templateType?: string): string => {
  if (
    templateType?.includes("us-contract") ||
    templateType?.toLowerCase().includes("us")
  ) {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Field categorization based on field names/patterns
const categorizeField = (fieldName: string, displayLabel: string): string => {
  const name = fieldName.toLowerCase();
  const label = displayLabel.toLowerCase();

  // Invoice Info fields
  if (
    name.includes("invoice") ||
    name.includes("number") ||
    name.includes("date")
  ) {
    return "INVOICE INFO";
  }

  // Client Info fields
  if (
    name.includes("client") ||
    name.includes("customer") ||
    label.includes("client")
  ) {
    return "CLIENT INFO";
  }

  // Bank Details fields
  if (
    name.includes("bank") ||
    name.includes("account") ||
    name.includes("ifsc") ||
    name.includes("branch")
  ) {
    return "BANK DETAILS";
  }

  // Description fields
  if (
    name.includes("description") ||
    name.includes("hiring") ||
    name.includes("candidate") ||
    name.includes("job") ||
    name.includes("requirement")
  ) {
    return "DESCRIPTION";
  }

  // GST fields
  if (name.includes("gst")) {
    return "GST INFO";
  }

  return "OTHER INFO";
};

// Group fields by section and then by category
const groupFieldsBySectionAndCategory = (templateData: TemplateFieldMap[]) => {
  const sections: Record<string, Record<string, TemplateFieldMap[]>> = {};

  templateData.forEach((fieldMap) => {
    const sectionName = fieldMap.invoiceSectionMaster.sectionName;
    const category = categorizeField(
      fieldMap.invoiceFieldMaster.fieldName,
      fieldMap.displayLabel
    );

    if (!sections[sectionName]) {
      sections[sectionName] = {};
    }
    if (!sections[sectionName][category]) {
      sections[sectionName][category] = [];
    }
    sections[sectionName][category].push(fieldMap);
  });

  // Sort fields within each category by displayOrder
  Object.keys(sections).forEach((sectionName) => {
    Object.keys(sections[sectionName]).forEach((category) => {
      sections[sectionName][category].sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
    });
  });

  return sections;
};

// Section display name mapper
const getSectionDisplayName = (sectionName: string): string => {
  const sectionMap: Record<string, string> = {
    "INVOICE-DETAILS": "Invoice Details",
    "CLIENT-INFO": "Client Information",
    "BANK-DETAILS": "Bank Details",
    DESCRIPTION: "Description",
    "BILLING-INFO": "Billing Information",
    "PAYMENT-TERMS": "Payment Terms & Conditions",
  };

  return sectionMap[sectionName] || sectionName.replace(/-/g, " ");
};

// Category display name mapper
const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    "INVOICE INFO": "INVOICE INFO",
    "CLIENT INFO": "CLIENT INFO",
    "BANK DETAILS": "BANK DETAILS",
    DESCRIPTION: "DESCRIPTION",
    "GST INFO": "GST INFO",
    "OTHER INFO": "OTHER INFO",
  };

  return categoryMap[category] || category;
};

export default function PDFExport({
  templateId,
  fields = [],
  billingItems = [],
  totals,
  previewMode = true,
  onExportStart,
  onExportComplete,
  onExportError,
}: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [templateData, setTemplateData] =
    useState<TemplateFieldMapsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (templateId) {
      loadTemplateData();
    }
  }, [templateId]);

  const loadTemplateData = async () => {
    setLoading(true);
    try {
      const data = await fetchTemplateFieldMapsByTemplate(templateId);
      setTemplateData(data);
    } catch (error) {
      console.error("Failed to load template data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!templateData) {
      await loadTemplateData();
    }

    setIsExporting(true);
    onExportStart?.();

    try {
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.fontFamily = "'Poppins', sans-serif";

      tempContainer.innerHTML = generateDynamicInvoiceHTML();
      document.body.appendChild(tempContainer);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      document.body.removeChild(tempContainer);

      const invoiceNumber =
        getFieldValue(fields, "invoice-number") ||
        getFieldValue(fields, "invoicenumber") ||
        "SEERTECH";
      const fileName = `Invoice-${invoiceNumber}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      pdf.save(fileName);
      onExportComplete?.();
    } catch (error) {
      console.error("PDF export failed:", error);
      onExportError?.(error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateDynamicInvoiceHTML = () => {
    if (!templateData) {
      return "<div>Loading template data...</div>";
    }

    const theme = templateData.content[0]?.template.themeStyle;
    const themeColors = {
      primary: theme?.primaryColor || "#1e40af",
      secondary: theme?.secondaryColor || "#3b82f6",
      background: theme?.backgroundColor || "#ffffff",
      text: theme?.textColor || "#1f2937",
      accent: theme?.backgroundColor || "#eff6ff",
    };

    const sections = groupFieldsBySectionAndCategory(templateData.content);
    const calculatedSubtotal = totals?.subtotal || 0;
    const calculatedTaxAmount = totals?.taxAmount || 0;
    const calculatedTotalAmount = totals?.totalAmount || 0;

    return `
      <div style="
        font-family: 'Poppins', sans-serif;
        background: ${themeColors.background};
        color: ${themeColors.text};
        line-height: 1.6;
        font-size: 14px;
        width: 210mm;
        min-height: 297mm;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      ">
        <!-- Header Section -->
        <div style="
  background: ${themeColors.primary};
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
">
  <!-- Left side - Company Info -->
  <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
    <img src=${imgHelper.seertechsystemsLogo || "/placeholder.svg"} alt="SEERTECH SYSTEMS Logo" style="
      width: 70px;
      height: 70px;
      object-fit: cover;
      background: white;
      border-radius: 8px;
      padding: 5px;
      margin-top: 25px;
    " />
    <div>
      <h1 style="
        font-size: 24px;
        font-weight: bold;
        margin: 0 0 6px 0;
        color: white;
      ">SEERTECH SYSTEMS</h1>
      <div style="
        width: 100%;
        height: 3px;
        background: rgba(255,255,255,0.4);
        margin: 6px 0;
        border-radius: 2px;
      "></div>
      <p style="font-size: 12px; opacity: 0.95; color: white; line-height: 1.4; margin: 0;">
        Ramaniyam Marvel, No B27, Seshadripuram,<br>
        1st Main Road, Velachery, Chennai 42.
      </p>
    </div>
  </div>
  
  <!-- Right side - Invoice Text -->
  <div style="text-align: right;">
    <div style="font-size: 32px; font-weight: bold; color: white; margin-bottom: 5px;">INVOICE</div>
  </div>
</div>
        
        <!-- Main Content -->
        <div style="padding: 20px;">
          <!-- Invoice Details Section with Sub-groups -->
          ${renderSectionWithCategories(
            sections,
            "INVOICE-DETAILS",
            themeColors
          )}
          
          <!-- Billing Items Section -->
          ${generateBillingTableHTML(themeColors)}
          
          <!-- Calculations Section -->
          ${generateCalculationsHTML(
            themeColors,
            calculatedSubtotal,
            calculatedTaxAmount,
            calculatedTotalAmount
          )}
          
          <!-- Payment Terms -->
          ${renderSectionWithCategories(sections, "PAYMENT-TERMS", themeColors)}
          
          <!-- Signatures -->
          ${renderSignatureSection(themeColors)}
        </div>
      </div>
    `;
  };

  const renderSectionWithCategories = (
    sections: Record<string, Record<string, TemplateFieldMap[]>>,
    sectionName: string,
    themeColors: any
  ) => {
    if (!sections[sectionName]) return "";

    const sectionCategories = sections[sectionName];
    const displayName = getSectionDisplayName(sectionName);

    return `
      <div style="margin: 20px 0;">
        <h2 style="
          color: ${themeColors.primary};
          border-bottom: 2px solid ${themeColors.secondary};
          padding-bottom: 8px;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: bold;
        ">${displayName}</h2>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        ">
          ${Object.keys(sectionCategories)
            .map((category) => {
              const categoryFields = sectionCategories[category];
              const categoryDisplayName = getCategoryDisplayName(category);

              return `
              <div style="
                border: 1px solid ${themeColors.secondary}30;
                border-radius: 8px;
                padding: 15px;
                background: ${themeColors.accent}10;
              ">
                <div style="
                  font-weight: bold;
                  color: ${themeColors.primary};
                  margin-bottom: 12px;
                  font-size: 14px;
                  border-bottom: 1px solid ${themeColors.secondary}20;
                  padding-bottom: 5px;
                ">${categoryDisplayName}</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${categoryFields
                    .map(
                      (field) => `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <span style="font-weight: 600; font-size: 13px; min-width: 120px;">${
                        field.displayLabel
                      }:</span>
                      <span style="font-size: 13px; text-align: right; flex: 1; margin-left: 10px;">
                        ${getFieldValue(
                          fields,
                          field.invoiceFieldMaster.fieldName
                        )}
                      </span>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;
  };

  const generateBillingTableHTML = (themeColors: any) => {
    if (!billingItems || billingItems.length === 0) {
      // Show empty table with sample data
      return `
        <div style="margin: 30px 0;">
          <h2 style="
            color: ${themeColors.primary};
            border-bottom: 2px solid ${themeColors.secondary};
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: bold;
          ">Billing Details</h2>
          <table style="
            width: 100%;
            border-collapse: collapse;
            border: 1px solid ${themeColors.secondary}40;
            font-size: 13px;
          ">
            <thead>
              <tr>
                <th style="padding: 12px; text-align: left; background: ${themeColors.accent}; border-bottom: 2px solid ${themeColors.secondary};">Sr. No.</th>
                <th style="padding: 12px; text-align: left; background: ${themeColors.accent}; border-bottom: 2px solid ${themeColors.secondary};">Description</th>
                <th style="padding: 12px; text-align: left; background: ${themeColors.accent}; border-bottom: 2px solid ${themeColors.secondary};">Total Value</th>
                <th style="padding: 12px; text-align: left; background: ${themeColors.accent}; border-bottom: 2px solid ${themeColors.secondary};">% Billed</th>
                <th style="padding: 12px; text-align: left; background: ${themeColors.accent}; border-bottom: 2px solid ${themeColors.secondary};">Invoice Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background: ${themeColors.accent}15;">
                <td style="padding: 10px; border-bottom: 1px solid ${themeColors.secondary}20;">1</td>
                <td style="padding: 10px; border-bottom: 1px solid ${themeColors.secondary}20;">XXX</td>
                <td style="padding: 10px; border-bottom: 1px solid ${themeColors.secondary}20;">₹0.00</td>
                <td style="padding: 10px; border-bottom: 1px solid ${themeColors.secondary}20;">100%</td>
                <td style="padding: 10px; border-bottom: 1px solid ${themeColors.secondary}20;">₹0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div style="margin: 30px 0;">
        <h2 style="
          color: ${themeColors.primary};
          border-bottom: 2px solid ${themeColors.secondary};
          padding-bottom: 8px;
          margin-bottom: 15px;
          font-size: 18px;
          font-weight: bold;
        ">Billing Details</h2>
        <table style="
          width: 100%;
          border-collapse: collapse;
          border: 1px solid ${themeColors.secondary}40;
          font-size: 13px;
        ">
          <thead>
            <tr>
              <th style="padding: 12px; text-align: left; background: ${
                themeColors.accent
              }; border-bottom: 2px solid ${
      themeColors.secondary
    };">Sr. No.</th>
              <th style="padding: 12px; text-align: left; background: ${
                themeColors.accent
              }; border-bottom: 2px solid ${
      themeColors.secondary
    };">Description</th>
              <th style="padding: 12px; text-align: left; background: ${
                themeColors.accent
              }; border-bottom: 2px solid ${
      themeColors.secondary
    };">Total Value</th>
              <th style="padding: 12px; text-align: left; background: ${
                themeColors.accent
              }; border-bottom: 2px solid ${
      themeColors.secondary
    };">% Billed</th>
              <th style="padding: 12px; text-align: left; background: ${
                themeColors.accent
              }; border-bottom: 2px solid ${
      themeColors.secondary
    };">Invoice Value</th>
            </tr>
          </thead>
          <tbody>
            ${billingItems
              .map(
                (item, index) => `
              <tr style="${
                index % 2 === 0 ? `background: ${themeColors.accent}15;` : ""
              }">
                <td style="padding: 10px; border-bottom: 1px solid ${
                  themeColors.secondary
                }20;">${index + 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid ${
                  themeColors.secondary
                }20;">${item.description}</td>
                <td style="padding: 10px; border-bottom: 1px solid ${
                  themeColors.secondary
                }20;">${formatCurrency(item.totalValue)}</td>
                <td style="padding: 10px; border-bottom: 1px solid ${
                  themeColors.secondary
                }20;">${item.percentageBilled}%</td>
                <td style="padding: 10px; border-bottom: 1px solid ${
                  themeColors.secondary
                }20;">${formatCurrency(item.invoiceValue)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  };

  const generateCalculationsHTML = (
    themeColors: any,
    subtotal: number,
    taxAmount: number,
    totalAmount: number
  ) => {
    const gstPercentage = totals?.gstPercentage || 18;
    const isTamilnadu =
      totals?.clientState === "Tamilnadu" ||
      totals?.clientState === "Tamil Nadu";

    return `
      <div style="margin: 25px 0; display: flex; justify-content: flex-end;">
        <div style="width: 350px; border: 1px solid ${
          themeColors.secondary
        }40; border-radius: 6px; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid ${
            themeColors.secondary
          }20;">
            <span>Sub Total:</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          ${
            isTamilnadu
              ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid ${
              themeColors.secondary
            }20; background: ${themeColors.accent}10;">
              <span>CGST (${gstPercentage / 2}%):</span>
              <span>${formatCurrency(taxAmount / 2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid ${
              themeColors.secondary
            }20; background: ${themeColors.accent}10;">
              <span>SGST (${gstPercentage / 2}%):</span>
              <span>${formatCurrency(taxAmount / 2)}</span>
            </div>
          `
              : `
            <div style="display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid ${
              themeColors.secondary
            }20;">
              <span>IGST (${gstPercentage}%):</span>
              <span>${formatCurrency(taxAmount)}</span>
            </div>
          `
          }
          <div style="display: flex; justify-content: space-between; padding: 12px 15px; background: ${
            themeColors.accent
          }; font-weight: bold;">
            <span>Total Amount:</span>
            <span>${formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    `;
  };

  const renderSignatureSection = (themeColors: any) => {
    return `
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-top: 40px;
        border-top: 2px solid ${themeColors.secondary}40;
        margin-top: 30px;
      ">
        <div style="text-align: center;">
          <div style="
            font-weight: bold;
            font-size: 14px;
            color: ${themeColors.primary};
            margin-bottom: 40px;
          ">Issued by SEERTECH SYSTEMS</div>
          <div style="font-size: 12px; color: ${themeColors.text}; opacity: 0.8;">
            Authorized Signature
          </div>
        </div>
        <div style="text-align: center;">
          <div style="
            font-weight: bold;
            font-size: 14px;
            color: ${themeColors.primary};
            margin-bottom: 40px;
          ">Accepted by</div>
          <div style="font-size: 12px; color: ${themeColors.text}; opacity: 0.8;">
            Client Signature
          </div>
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center bg-gray-400 text-white px-3 py-2 rounded-md cursor-not-allowed"
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading Template...
      </button>
    );
  }

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="flex items-center bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {isExporting ? "Generating PDF..." : "Export PDF"}
    </button>
  );
}
