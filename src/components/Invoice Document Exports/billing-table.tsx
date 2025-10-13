"use client"
import { Plus, Trash2 } from "lucide-react"

interface BillingItem {
  id: string
  description: string
  totalValue: number
  percentageBilled: number
  invoiceValue: number
}

interface BillingTableProps {
  theme: string
  items: BillingItem[]
  onItemsChange: (items: BillingItem[]) => void
  previewMode?: boolean
}

export default function BillingTablePreview({ theme, items, onItemsChange, previewMode = false }: BillingTableProps) {
  const getThemeColor = (theme: string) => {
    const themes: Record<string, any> = {
      "professional-blue": {
        primary: "#1e40af",
        secondary: "#3b82f6",
        background: "#ffffff",
        text: "#1f2937",
      },
      "corporate-gray": {
        primary: "#374151",
        secondary: "#6b7280",
        background: "#f9fafb",
        text: "#111827",
      },
      "modern-teal": {
        primary: "#0891b2",
        secondary: "#06b6d4",
        background: "#ffffff",
        text: "#0f172a",
      },
      "elegant-purple": {
        primary: "#7c3aed",
        secondary: "#8b5cf6",
        background: "#fefefe",
        text: "#1e1b4b",
      },
    }

    return themes[theme]?.primary || themes["professional-blue"].primary
  }

  const themeColor = getThemeColor(theme)

  const addBillingItem = () => {
    const newItem: BillingItem = {
      id: Date.now().toString(),
      description: "",
      totalValue: 0,
      percentageBilled: 0,
      invoiceValue: 0,
    }
    onItemsChange([...items, newItem])
  }

  const updateBillingItem = (id: string, field: keyof BillingItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === "totalValue" || field === "percentageBilled") {
          updated.invoiceValue = (updated.totalValue * updated.percentageBilled) / 100
        }
        return updated
      }
      return item
    })

    onItemsChange(updatedItems)
  }

  const removeBillingItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (previewMode) {
    return (
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="p-3 text-left text-sm font-semibold" style={{ color: themeColor }}>
                  Sr. No.
                </th>
                <th className="p-3 text-left text-sm font-semibold" style={{ color: themeColor }}>
                  Description of the Milestone
                </th>
                <th className="p-3 text-center text-sm font-semibold" style={{ color: themeColor }}>
                  Total Value
                </th>
                <th className="p-3 text-center text-sm font-semibold" style={{ color: themeColor }}>
                  % Billed
                </th>
                <th className="p-3 text-center text-sm font-semibold" style={{ color: themeColor }}>
                  Invoice Value
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3 text-center font-medium text-sm">{index + 1}</td>
                  <td className="p-3 whitespace-pre-line text-sm">{item.description}</td>
                  <td className="p-3 text-center text-sm">{formatCurrency(item.totalValue)}</td>
                  <td className="p-3 text-center text-sm">{item.percentageBilled}%</td>
                  <td className="p-3 text-center font-medium text-sm">{formatCurrency(item.invoiceValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-400">
              <th className="p-3 text-left text-sm font-semibold" style={{ color: themeColor }}>
                Sr. No.
              </th>
              <th className="p-3 text-left text-sm font-semibold" style={{ color: themeColor }}>
                Description of the Milestone
              </th>
              <th className="p-3 text-left text-sm font-semibold" style={{ color: themeColor }}>
                Total Value
              </th>
              <th className="p-3 text-left text-sm font-semibold" style={{ color: themeColor }}>
                % Billed
              </th>
              <th className="p-3 text-center text-sm font-semibold" style={{ color: themeColor }}>
                Invoice Value
              </th>
              <th className="p-3 text-center text-sm font-semibold" style={{ color: themeColor }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 text-center font-medium text-sm">{index + 1}</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateBillingItem(item.id, "description", e.target.value)}
                    placeholder="Enter milestone description..."
                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={item.totalValue}
                    onChange={(e) => updateBillingItem(item.id, "totalValue", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={item.percentageBilled}
                    onChange={(e) =>
                      updateBillingItem(item.id, "percentageBilled", Number.parseFloat(e.target.value) || 0)
                    }
                    placeholder="0"
                    max="100"
                    className="w-full px-3 py-2 text-left border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </td>
                <td className="p-3 font-medium text-right text-sm">{formatCurrency(item.invoiceValue)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => removeBillingItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!previewMode && (
        <div className="mt-4 flex justify-start">
          <button
            onClick={addBillingItem}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </button>
        </div>
      )}
    </div>
  )
}
