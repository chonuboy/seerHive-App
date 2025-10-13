import { useState, useRef } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface MilestoneItem {
  id: number
  description: string
  totalValue: number
  billingPercent: number
  invoiceValue: number
}

export default function InvoiceGenerator() {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [invoiceNumber, setInvoiceNumber] = useState("IV004024")
  const [invoiceDate, setInvoiceDate] = useState(formatDate(new Date()))
  const [clientName, setClientName] = useState("OneMagnify India Pvt Ltd")
  const [clientAddress, setClientAddress] = useState(
    "Temple Steps, Block C, No.184-187, Anna Salai, Saidapet, Chennai - 600 015",
  )
  const [clientGST, setClientGST] = useState("33AACCO9140L1ZB")
  const [hiringType, setHiringType] = useState("Contract Hiring")
  const [candidateName, setCandidateName] = useState("Swati G")
  const [requirement, setRequirement] = useState("Technical Campaign Specialist")
  const [sgstPercent, setSgstPercent] = useState(9)
  const [cgstPercent, setCgstPercent] = useState(9)

  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: 1,
      description: "Recruitment Services fee",
      totalValue: 91630,
      billingPercent: 100,
      invoiceValue: 91630,
    },
  ])

  // Calculate totals
  const subTotal = milestones.reduce((sum, item) => sum + item.invoiceValue, 0)
  const sgstAmount = (subTotal * sgstPercent) / 100
  const cgstAmount = (subTotal * cgstPercent) / 100
  const totalAmount = subTotal + sgstAmount + cgstAmount

  // Format date as DD-MMM-YY
  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "2-digit" }
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-")
  }

  // Handle milestone changes
  const handleMilestoneChange = (id: number, field: keyof MilestoneItem, value: string | number) => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone) => {
        if (milestone.id === id) {
          const updatedMilestone = { ...milestone, [field]: value }

          // Recalculate invoice value if total value or billing percent changes
          if (field === "totalValue" || field === "billingPercent") {
            const totalValue = field === "totalValue" ? Number(value) : milestone.totalValue
            const billingPercent = field === "billingPercent" ? Number(value) : milestone.billingPercent
            updatedMilestone.invoiceValue = (totalValue * billingPercent) / 100
          }

          return updatedMilestone
        }
        return milestone
      }),
    )
  }

  // Add new milestone
  const addMilestone = () => {
    const newId = milestones.length > 0 ? Math.max(...milestones.map((m) => m.id)) + 1 : 1
    setMilestones([
      ...milestones,
      {
        id: newId,
        description: "",
        totalValue: 0,
        billingPercent: 0,
        invoiceValue: 0,
      },
    ])
  }

  // Remove milestone
  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id))
  }

  // Generate and download PDF
  const generatePDF = async () => {
    if (!invoiceRef.current) return

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save(`SEERTECH_INVOICE_${invoiceNumber}.pdf`)
  }

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto p-4 gap-6">
      <div className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Generator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="date"
              value={new Date(invoiceDate).toISOString().split("T")[0]}
              onChange={(e) => setInvoiceDate(formatDate(new Date(e.target.value)))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Client Address</label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Client GST</label>
            <input
              type="text"
              value={clientGST}
              onChange={(e) => setClientGST(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Hiring Type</label>
            <input
              type="text"
              value={hiringType}
              onChange={(e) => setHiringType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Candidate Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Requirement</label>
            <input
              type="text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Milestones</h2>

          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <div className="col-span-1 text-center">{index + 1}</div>

              <div className="col-span-5">
                <input
                  type="text"
                  value={milestone.description}
                  onChange={(e) => handleMilestoneChange(milestone.id, "description", e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  value={milestone.totalValue}
                  onChange={(e) => handleMilestoneChange(milestone.id, "totalValue", Number(e.target.value))}
                  placeholder="Total Value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  value={milestone.billingPercent}
                  onChange={(e) => handleMilestoneChange(milestone.id, "billingPercent", Number(e.target.value))}
                  placeholder="% Billed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2 flex items-center">
                <span className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                  {formatCurrency(milestone.invoiceValue)}
                </span>

                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(milestone.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMilestone}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Milestone
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">SGST (%)</label>
            <input
              type="number"
              value={sgstPercent}
              onChange={(e) => setSgstPercent(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">CGST (%)</label>
            <input
              type="number"
              value={cgstPercent}
              onChange={(e) => setCgstPercent(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={generatePDF}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Generate PDF
          </button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Invoice Preview</h2>

        <div
          ref={invoiceRef}
          className="w-full bg-gray-200 p-6 border border-gray-300 shadow-md"
          style={{ width: "263mm", minHeight: "297mm" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-200">
            <div className="flex items-center">
              {/* <div className="w-16 h-16 bg-white flex items-center justify-center border border-gray-400">
                <div className="w-12 h-12 bg-black relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-cyan-500 transform rotate-45"></div>
                  </div>
                </div>
              </div> */}
              <div className="ml-4">
                <h1 className="text-2xl font-bold">SEERTECH SYSTEMS</h1>
                <p className="text-xs">Ramaniyam Marvel,No 827,Selaiyur,Tambaram 1st Main Road,Velachery,Chennai 42.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between mb-2">
                <span className="font-bold mr-4">INVOICE NO:</span>
                <span className="bg-white px-2 py-1 border border-gray-400 min-w-[150px]">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold mr-4">INVOICE DATE:</span>
                <span className="bg-white px-2 py-1 border border-gray-400 min-w-[150px]">{invoiceDate}</span>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mt-4 bg-gray-200 p-4">
            <div className="mb-1">
              <span className="font-bold">INVOICE TO: </span>
              <span>
                {clientName}, {clientAddress}
              </span>
            </div>
            <div>
              <span>
                {clientName}, GST No: {clientGST}
              </span>
            </div>
            <div className="mt-4 font-bold">DESCRIPTION</div>
            <div className="">
              <div>{hiringType}</div>
              <div>Candidate Name: {candidateName}</div>
              <div>Requirement: {requirement}</div>
            </div>
          </div>

          {/* Milestone Table */}
          <div className="mt-4 bg-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border border-gray-400 p-2 text-left w-12">No.</th>
                  <th className="border border-gray-400 p-2 text-left">Description of the Milestone</th>
                  <th className="border border-gray-400 p-2 text-right w-28">Total Value</th>
                  <th className="border border-gray-400 p-2 text-right w-20">% Billed</th>
                  <th className="border border-gray-400 p-2 text-right w-28">Invoice Value</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((milestone, index) => (
                  <tr key={milestone.id}>
                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-400 p-2">{milestone.description}</td>
                    <td className="border border-gray-400 p-2 text-right">{formatCurrency(milestone.totalValue)}</td>
                    <td className="border border-gray-400 p-2 text-right">{milestone.billingPercent.toFixed(2)}</td>
                    <td className="border border-gray-400 p-2 text-right">{formatCurrency(milestone.invoiceValue)}</td>
                  </tr>
                ))}
                {/* Empty rows to match the template */}
                {Array.from({ length: Math.max(0, 3 - milestones.length) }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                    <td className="border border-gray-400 p-2">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 bg-gray-200">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between border border-gray-400 p-2">
                  <span className="font-bold">Sub Total (INR)</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between border border-gray-400 border-t-0 p-2">
                  <span className="font-bold">SGST (%)</span>
                  <span>{sgstPercent.toFixed(2)}</span>
                  <span>{formatCurrency(sgstAmount)}</span>
                </div>
                <div className="flex justify-between border border-gray-400 border-t-0 p-2">
                  <span className="font-bold">CGST (%)</span>
                  <span>{cgstPercent.toFixed(2)}</span>
                  <span>{formatCurrency(cgstAmount)}</span>
                </div>
                <div className="flex justify-between border border-gray-400 border-t-0 p-2 font-bold">
                  <span>Amount With GST (INR)</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Bank Details */}
          <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-200">
            <div>
              <div className="font-bold mb-1">Payment Terms & Conditions:</div>
              <div className="text-xs">
                <p>Payment to be made via bank online transfer</p>
                <p>Fee calculated on 8.33% of Annual Fixed CTC</p>
              </div>
            </div>
            <div className="bg-white p-2 border border-gray-400">
              <div className="font-bold mb-1">Bank Details:</div>
              <div className="text-xs">
                <p>Account Name: SEERTECH SYSTEMS</p>
                <p>Bank Name: ICICI Bank Ltd</p>
                <p>Account No.: 000801567567</p>
                <p>Branch: Egmore, Chennai, 600008</p>
                <p>IFSC Code: ICIC0000284</p>
                <p>GST Number: 33AAFCS0280B1ZB</p>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-200">
            <div className="h-24 border border-gray-400 bg-white flex items-center justify-center">
              <div className="text-gray-400 italic">Signature</div>
            </div>
            <div className="flex items-end justify-end">
              <div className="text-xs">
                <p className="text-right">ACCEPTED ON BEHALF OF {clientName}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 bg-gray-200 text-xs">
            <p>Issued by SEERTECH SYSTEMS</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
}
