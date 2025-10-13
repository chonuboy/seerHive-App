import { DollarSign, TrendingUp, CreditCard, FileText, AlertCircle, CheckCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 420000, expenses: 280000, profit: 140000 },
  { month: "Feb", revenue: 380000, expenses: 260000, profit: 120000 },
  { month: "Mar", revenue: 520000, expenses: 310000, profit: 210000 },
  { month: "Apr", revenue: 480000, expenses: 290000, profit: 190000 },
  { month: "May", revenue: 590000, expenses: 320000, profit: 270000 },
  { month: "Jun", revenue: 650000, expenses: 340000, profit: 310000 },
]

const invoiceStatus = [
  { status: "Paid", count: 145, amount: 1250000, color: "#10b981" },
  { status: "Pending", count: 23, amount: 180000, color: "#f59e0b" },
  { status: "Overdue", count: 8, amount: 65000, color: "#ef4444" },
  { status: "Draft", count: 12, amount: 95000, color: "#6b7280" },
]

const clientPayments = [
  { client: "Tech Corp", amount: 450000, status: "Paid", dueDate: "2024-01-15" },
  { client: "StartupXYZ", amount: 280000, status: "Pending", dueDate: "2024-01-20" },
  { client: "Enterprise Ltd", amount: 620000, status: "Paid", dueDate: "2024-01-10" },
  { client: "Innovation Inc", amount: 180000, status: "Overdue", dueDate: "2024-01-05" },
]

const expenseCategories = [
  { category: "Salaries", amount: 180000, percentage: 52, color: "#3b82f6" },
  { category: "Infrastructure", amount: 65000, percentage: 19, color: "#10b981" },
  { category: "Marketing", amount: 45000, percentage: 13, color: "#f59e0b" },
  { category: "Operations", amount: 35000, percentage: 10, color: "#8b5cf6" },
  { category: "Other", amount: 20000, percentage: 6, color: "#ef4444" },
]

const cashFlowData = [
  { week: "Week 1", inflow: 125000, outflow: 85000 },
  { week: "Week 2", inflow: 98000, outflow: 92000 },
  { week: "Week 3", inflow: 156000, outflow: 78000 },
  { week: "Week 4", inflow: 134000, outflow: 88000 },
]

export default function FinancialDashboard() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border-l-4 border-l-green-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Monthly Revenue</div>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">$650K</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +10.2% from last month
            </p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-blue-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Net Profit</div>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">$310K</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +14.8% from last month
            </p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Outstanding</div>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">$245K</div>
            <p className="text-xs text-amber-600 mt-1">31 pending invoices</p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-purple-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Profit Margin</div>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">47.7%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Revenue & Profit Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Revenue & Profit Trends</div>
            <div className="text-sm text-gray-600 mt-1">Monthly financial performance over the past 6 months</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Expense Breakdown</div>
            <div className="text-sm text-gray-600 mt-1">Monthly expense distribution by category</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value:any) => `$${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {expenseCategories.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">
                    {item.category}: {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Status & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Invoice Status</div>
            <div className="text-sm text-gray-600 mt-1">Current invoice status overview</div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {invoiceStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{status.status}</p>
                      <p className="text-xs text-gray-500">{status.count} invoices</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${(status.amount / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Weekly Cash Flow</div>
            <div className="text-sm text-gray-600 mt-1">Cash inflow vs outflow by week</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Client Payments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="text-lg font-semibold text-gray-900">Recent Client Payments</div>
          <div className="text-sm text-gray-600 mt-1">Payment status and amounts from major clients</div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            {clientPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {payment.client
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{payment.client}</p>
                    <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(payment.amount / 1000).toFixed(0)}K</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
