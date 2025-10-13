"use client";

import { Download, Code } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFExportProps {
  fields: any[];
  template: any;
  theme: string;
  billingItems?: any[];
  totals?: {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    gstPercentage?: number;
    clientState?: string;
  };
  templateStyling?: {
    themeID: number;
    themeName: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  layoutConfig?: {
    configID: number;
    gridColumns: string;
    gridGap: string;
    gridRows: string;
  };
  // New props to match invoice canvas state
  gstRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  subtotal?: number;
  taxAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  totalAmount?: number;
  previewMode?: boolean;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

const getThemeColors = (theme: any, customStyling?: any): ThemeColors => {
  // If custom styling from database is provided, use it
  if (customStyling) {
    return {
      primary: customStyling.primaryColor || "#1e40af",
      secondary: customStyling.secondaryColor || "#3b82f6",
      background: customStyling.backgroundColor || "#ffffff",
      text: customStyling.textColor || "#1f2937",
      accent: customStyling.backgroundColor || "#eff6ff",
    };
  }

  // Default theme colors
  const themes: Record<string, ThemeColors> = {
    "professional-blue": {
      primary: "#1e40af",
      secondary: "#3b82f6",
      background: "#ffffff",
      text: "#1f2937",
      accent: "#eff6ff",
    },
    "corporate-gray": {
      primary: "#374151",
      secondary: "#6b7280",
      background: "#f9fafb",
      text: "#111827",
      accent: "#f3f4f6",
    },
    "modern-teal": {
      primary: "#0891b2",
      secondary: "#06b6d4",
      background: "#ffffff",
      text: "#0f172a",
      accent: "#ecfeff",
    },
    "elegant-purple": {
      primary: "#7c3aed",
      secondary: "#8b5cf6",
      background: "#fefefe",
      text: "#1e1b4b",
      accent: "#faf5ff",
    },
  };
  return themes[theme] || themes["professional-blue"];
};

export default function PDFExport({
  fields,
  template,
  theme,
  billingItems = [],
  totals,
  templateStyling,
  layoutConfig,
  // New props with defaults
  gstRate = 0,
  cgstRate = 0,
  sgstRate = 0,
  subtotal = 0,
  taxAmount = 0,
  cgstAmount = 0,
  sgstAmount = 0,
  totalAmount = 0,
  previewMode = true,
}: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const themeColors = getThemeColors(theme, templateStyling);

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      // Create a temporary container for the invoice
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm"; // A4 width
      tempContainer.style.backgroundColor = "white";
      tempContainer.innerHTML = generateInvoiceHTML();

      document.body.appendChild(tempContainer);

      // Wait for fonts and images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up
      document.body.removeChild(tempContainer);

      // Download the PDF
      const fileName = `Invoice-${
        getFieldValue("invoice-number") || "SEERTECH"
      }-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getFieldValue = (fieldName: string): string => {
    const field = fields.find(
      (f) =>
        f.name.toLowerCase().includes(fieldName.toLowerCase()) ||
        f.id.toLowerCase().includes(fieldName.toLowerCase())
    );
    return field?.value || "";
  };

  const formatCurrency = (amount: number, currency = "INR"): string => {
    if (template?.TemplateType?.includes("us-contract")) {
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

  const getGSTDetails = () => {
    if (!totals) return null;

    const isTamilnadu =
      totals.clientState === "Tamilnadu" || totals.clientState === "Tamil Nadu";
    const gstPercentage = totals.gstPercentage || 18;

    if (isTamilnadu) {
      return {
        type: "CGST+SGST",
        cgstAmount: totals.taxAmount / 2,
        sgstAmount: totals.taxAmount / 2,
        cgstPercentage: gstPercentage / 2,
        sgstPercentage: gstPercentage / 2,
      };
    } else {
      return {
        type: "IGST",
        igstAmount: totals.taxAmount,
        igstPercentage: gstPercentage,
      };
    }
  };

  const generateInvoiceHTML = () => {
    const gstDetails = getGSTDetails();
    const currencySymbol = template?.TemplateType?.includes("us-contract")
      ? "$"
      : "₹";
    const isUSContract = template?.TemplateType?.includes("us-contract");

    // Calculate amounts based on props or fallback to totals
    const calculatedSubtotal = subtotal || totals?.subtotal || 0;
    const calculatedTaxAmount = taxAmount || totals?.taxAmount || 0;
    const calculatedTotalAmount = totalAmount || totals?.totalAmount || 0;

    return `
      <div style="
        font-family: "Poppins", sans-serif;
        font-weight: 400;
        font-style: normal;
        background: ${themeColors.background};
        color: ${themeColors.text};
        line-height: 1.6;
        font-size: 16px;
        width: 210mm;
        min-height: 297mm;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      ">
        <!-- Header -->
        <div style="
          background: ${themeColors.primary};
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        ">
          <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
            <img src="/images/seertech-logo.jpeg" alt="SEERTECH SYSTEMS Logo" style="
              width: 90px;
              height: 70px;
              object-fit: cover;
              background: white;
              border-radius: 8px;
              padding: 5px;
            " />
            <div>
              <h1 style="
                font-size: 24px;
                font-weight: bold;
                margin: 0 0 8px 0;
                color: white;
              ">SEERTECH SYSTEMS</h1>
              <div style="
                width: 100%;
                height: 3px;
                background: rgba(255,255,255,0.4);
                margin: 8px 0;
                border-radius: 2px;
              "></div>
              <p style="font-size: 12px; opacity: 0.95; color: white; line-height: 1.4; margin: 0;">
                Ramaniyam Marvel, No B27, Seshadripuram,<br>
                1st Main Road, Velachery, Chennai 42.
              </p>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 32px; font-weight: bold; color: white; margin-bottom: 5px;">INVOICE</div>
            ${
              !isUSContract && gstDetails
                ? `<div style="font-size: 12px; opacity: 0.9; color: white;">
              GST: ${gstDetails.type} 
              <span style="
                display: inline-block;
                background: ${themeColors.secondary};
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                margin-left: 10px;
              ">${totals?.gstPercentage || 18}%</span>
            </div>`
                : ""
            }
          </div>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
          <!-- Details Grid -->
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
          ">
            <div>
              <div style="margin-bottom: 25px;">
                <div style="margin-bottom: 15px;">
                  <div style="
                    font-weight: 800;
                    margin-bottom: 4px;
                    color: ${themeColors.primary};
                    font-size: 18px;
                  ">Invoice To:</div>
                  <div style="
                    white-space: pre-line;
                    color: ${themeColors.text};
                    font-size: 16px;
                    line-height: 1.5;
                  ">Client Name :${
                    getFieldValue("Client Name") || "XXX XXX XXX"
                  }
                  Client Address :${
                    getFieldValue("Client Address") || "XXX XXX XXX"
                  }
                  GST :${getFieldValue("Client GST") || "XXX XXX XXX"}
                  </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <div style="
                    font-weight: 800;
                    margin-bottom: 4px;
                    color: ${themeColors.primary};
                    font-size: 18px;
                  ">Description:</div>
                  <div style="
                    white-space: pre-line;
                    color: ${themeColors.text};
                    font-size: 16px;
                    line-height: 1.5;
                  ">Hiring Type :${
                    getFieldValue("Hiring Type") || "XXX XXX XXX"
                  }
                    Requirement :${
                      getFieldValue("Requirement") || "XXX XXX XXX"
                    }
                  Candidate Name :${
                    getFieldValue("Candidate Name") || "XXX XXX XXX"
                  }
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div style="margin-bottom: 25px;">
                <div style="margin-bottom: 15px;">
                  <div style="
                    font-weight: 800;
                    margin-bottom: 4px;
                    color: ${themeColors.primary};
                    font-size: 18px;
                  ">Invoice Number</div>
                  <div style="
                    color: ${themeColors.text};
                    font-size: 16px;
                    line-height: 1.5;
                  ">${getFieldValue("Invoice Number") || "XXX XXX XXX"}
                  </div>
                  <div style="margin-bottom: 15px;">
                  <div style="
                    font-weight: 800;
                    margin-bottom: 4px;
                    color: ${themeColors.primary};
                    font-size: 18px;
                  ">Invoice Date</div>
                  <div style="
                    color: ${themeColors.text};
                    font-size: 16px;
                    line-height: 1.5;
                  ">${
                    getFieldValue("invoice-date") ||
                    new Date().toLocaleDateString()
                  }</div>
                </div>
                </div>
              </div>
              <div style="margin-bottom: 15px;">
                  <div style="
                    font-weight: 800;
                    margin-top: 15px;
                    margin-bottom: 4px;
                    color: ${themeColors.primary};
                    font-size: 18px;
                  ">Bank Details</div>
                  <div style="
                    color: ${themeColors.text};
                    font-size: 16px;
                    line-height: 1.5;
                  ">Account Name :${
                    getFieldValue("Account Holder Name") || "XXXX"
                  }<br>
                    Account Number :${
                      getFieldValue("Account Number") || "XXX XXX XXX"
                    }<br>
                    Bank Name :${getFieldValue("Bank Name") || "XXX XXX XXX"}
                    <br>
                    IFSC Code :${getFieldValue("IFSC Code") || "XXX XXX XXX"}
                    <br>
                    Branch Name :${
                      getFieldValue("Branch Name") || "XXX XXX XXX"
                    }
                    <br>
                    GST Number :${getFieldValue("GST Number") || "XXX XXX XXX"}
                  </div>
                </div>
            </div>
          </div>
          
          <!-- Billing Table -->
          <div style="margin-bottom: 25px;">
            
            <table style="
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
              border: 1px solid ${themeColors.secondary}40;
            ">
              <thead>
                <tr>
                  <th style="
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: bold;
                    color: ${themeColors.primary};
                    background: ${themeColors.accent};
                    border-bottom: 2px solid ${themeColors.secondary};
                  ">Sr. No.</th>
                  <th style="
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: bold;
                    color: ${themeColors.primary};
                    background: ${themeColors.accent};
                    border-bottom: 2px solid ${themeColors.secondary};
                  ">Description</th>
                  <th style="
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: bold;
                    color: ${themeColors.primary};
                    background: ${themeColors.accent};
                    border-bottom: 2px solid ${themeColors.secondary};
                  ">Total Value</th>
                  <th style="
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: bold;
                    color: ${themeColors.primary};
                    background: ${themeColors.accent};
                    border-bottom: 2px solid ${themeColors.secondary};
                  ">% Billed</th>
                  <th style="
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: bold;
                    color: ${themeColors.primary};
                    background: ${themeColors.accent};
                    border-bottom: 2px solid ${themeColors.secondary};
                  ">Invoice Value</th>
                </tr>
              </thead>
              <tbody>
                ${
                  billingItems && billingItems.length > 0
                    ? billingItems
                        .map(
                          (item, index) => `
                  <tr style="${
                    index % 2 === 0
                      ? `background: ${themeColors.accent}80;`
                      : "background: white;"
                  }">
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">${index + 1}</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                      white-space: pre-line;
                    ">${item.description}</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">${formatCurrency(item.totalValue)}</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">${item.percentageBilled}%</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">${formatCurrency(item.invoiceValue)}</td>
                  </tr>
                `
                        )
                        .join("")
                    : `
                  <tr>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">1</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">${getFieldValue("description") || "XXXXX"}</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">${formatCurrency(calculatedSubtotal)}</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">100%</td>
                    <td style="
                      padding: 12px;
                      text-align: left;
                      border-bottom: 1px solid ${themeColors.secondary}20;
                      color: ${themeColors.text};
                    ">${formatCurrency(calculatedSubtotal)}</td>
                  </tr>
                `
                }
              </tbody>
            </table>
          </div>
          
          <!-- Calculations -->
          <div style="margin: 30px 0; display: flex; justify-content: flex-end;">
            <div style="
              width: 350px;
              border: 1px solid ${themeColors.secondary}40;
              border-radius: 8px;
              overflow: hidden;
            ">
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 12px 15px;
                border-bottom: 1px solid ${themeColors.secondary}20;
              ">
                <span>Sub Total:</span>
                <span>${formatCurrency(calculatedSubtotal)}</span>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 12px 15px;
                border-bottom: 1px solid ${themeColors.secondary}20;
              ">
                <span>IGST(18%):</span>
                <span>${formatCurrency(calculatedSubtotal)}</span>
              </div>
              
              <div style="
                display: flex;
                justify-content: space-between;
                padding: 12px 15px;
                background: ${themeColors.accent};
                font-weight: bold;
                font-size: 15px;
                border-top: 2px solid ${themeColors.secondary};
              ">
                <span>Total Amount:</span>
                <span>${formatCurrency(calculatedTotalAmount)}</span>
              </div>
            </div>
          </div>
          
          <!-- Terms Section -->
          <div style="
            padding: 20px;
            background: ${themeColors.accent};
            border-radius: 8px;
            border-left: 4px solid ${themeColors.secondary};
          ">
            <div style="
              font-weight: bold;
              color: ${themeColors.primary};
              margin-bottom: 10px;
              font-size: 15px;
            ">Payment Terms & Conditions:</div>
            <div style="
              white-space: pre-line;
              color: ${themeColors.text};
              font-size: 18px;
              line-height: 1.5;
            ">${getFieldValue("payment-terms") || "XXXXX"}</div>
          </div>
          
          <!-- Footer Section -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 30px;
            border-top: 2px solid ${themeColors.secondary}40;
          ">
            <div style="text-align: center;">
              <img src="/images/company-signature.png" alt="Signature" style="
                width: 150px;
                height: 80px;
                margin-bottom: 15px;
                object-fit: contain;
              " />
              <div style="
                font-weight: bold;
                font-size: 18px;
                color: ${themeColors.primary};
              ">Issued by Seertech Systems</div>
            </div>
            <div style="text-align: right;">
              <div style="
                font-weight: bold;
                font-size: 18px;
                color: ${themeColors.primary};
              ">Accepted by</div>
              <div style="
                font-weight: bold;
                font-size: 18px;
                color: ${themeColors.primary};
              ">XXXXXX</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const generateJsonOutput = () => {
    const gstDetails = getGSTDetails();
    const calculatedSubtotal = subtotal || totals?.subtotal || 0;
    const calculatedTaxAmount = taxAmount || totals?.taxAmount || 0;
    const calculatedTotalAmount = totalAmount || totals?.totalAmount || 0;

    return {
      template: template,
      theme: theme,
      themeColors: themeColors,
      templateStyling: templateStyling,
      layoutConfig: layoutConfig,
      companyInfo: {
        name: "SEERTECH SYSTEMS",
        logo: "/images/seertech-logo.jpeg",
        address:
          "Ramaniyam Marvel,No B27,Seshadripuram,\\n1st Main Road,Velachery,Chennai 42.",
        bankDetails: {
          accountName: "SEERTECH SYSTEMS",
          bankName: "HDFC Bank Ltd",
          accountNumber: "50200093362667",
          branch: "Egmore, Chennai, 600008",
          ifscCode: "HDFC0001284",
          gstNumber: "33AFBFS0880G1Z6",
        },
      },
      invoiceData: {
        fields: fields,
        billingItems: billingItems,
        totals: {
          subtotal: calculatedSubtotal,
          taxAmount: calculatedTaxAmount,
          totalAmount: calculatedTotalAmount,
          gstRate,
          cgstRate,
          sgstRate,
          cgstAmount,
          sgstAmount,
        },
        gstDetails: gstDetails,
        calculations: {
          subTotal: formatCurrency(calculatedSubtotal),
          taxAmount: formatCurrency(calculatedTaxAmount),
          totalAmount: formatCurrency(calculatedTotalAmount),
          gstType: gstDetails?.type || "IGST",
        },
      },
      signature: "/images/company-signature.png",
      exportTimestamp: new Date().toISOString(),
    };
  };

  return (
    <div className="flex gap-2 items-center">
      <button onClick={exportToPDF} disabled={isExporting} className="flex items-center bg-cyan-500 text-white px-3 py-1 rounded-md">
        <Download className="h-4 w-4 mr-2" />
        {isExporting ? "Generating PDF..." : "Export PDF"}
      </button>
    </div>
  );
}
