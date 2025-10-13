import { Users, UserPlus, Award, Clock, TrendingUp, MapPin } from "lucide-react"
import { useRouter } from "next/router"
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
  LineChart,
  Line,
} from "recharts"

const departmentData = [
  { name: "Engineering", count: 245, color: "#3b82f6" },
  { name: "Sales", count: 156, color: "#10b981" },
  { name: "Marketing", count: 89, color: "#f59e0b" },
  { name: "HR", count: 34, color: "#8b5cf6" },
  { name: "Finance", count: 28, color: "#ef4444" },
]

const experienceData = [
  { level: "0-2 years", count: 145 },
  { level: "3-5 years", count: 234 },
  { level: "6-10 years", count: 189 },
  { level: "10+ years", count: 98 },
]

const performanceData = [
  { month: "Jan", rating: 4.2 },
  { month: "Feb", rating: 4.3 },
  { month: "Mar", rating: 4.1 },
  { month: "Apr", rating: 4.4 },
  { month: "May", rating: 4.5 },
  { month: "Jun", rating: 4.3 },
]

const locationData = [
  { location: "New York", count: 234, color: "#3b82f6" },
  { location: "San Francisco", count: 189, color: "#10b981" },
  { location: "London", count: 156, color: "#f59e0b" },
  { location: "Remote", count: 298, color: "#8b5cf6" },
]

const topPerformers = [
  { name: "Sarah Johnson", role: "Senior Developer", rating: 4.9, initials: "SJ" },
  { name: "Michael Chen", role: "Product Manager", rating: 4.8, initials: "MC" },
  { name: "Emily Davis", role: "UX Designer", rating: 4.7, initials: "ED" },
  { name: "David Wilson", role: "Sales Lead", rating: 4.6, initials: "DW" },
]

export default function EmployeeDashboard() {

  const router = useRouter();

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          {/* <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Award className="h-4 w-4 mr-2" />
            Performance Review
          </button> */}
          <button className="flex items-center px-4 py-2 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600" onClick={()=>{
            router.push("/candidates")
          }}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">1,247</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% from last month
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">89</p>
                <p className="text-xs text-gray-600 mt-2">892 employees assigned</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">4.3/5</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.2 from last quarter
                </div>
              </div>
              <Award className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remote Workers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">298</p>
                <p className="text-xs text-gray-600 mt-2">24% of total workforce</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Employee count by department</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience Levels</h3>
            <p className="text-sm text-gray-600 mb-4">Employee distribution by experience</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={experienceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="level" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Trend</h3>
            <p className="text-sm text-gray-600 mb-4">Average employee performance rating over time</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis domain={[3.5, 5]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Performers</h3>
            <p className="text-sm text-gray-600 mb-4">Highest rated employees this quarter</p>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">{performer.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">{performer.role}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{performer.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Locations</h3>
          <p className="text-sm text-gray-600 mb-4">Distribution of employees across different locations</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {locationData.map((location, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{location.count}</div>
                <div className="text-sm text-gray-600 mb-2">{location.location}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(location.count / 1247) * 100}%`,
                      backgroundColor: location.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
