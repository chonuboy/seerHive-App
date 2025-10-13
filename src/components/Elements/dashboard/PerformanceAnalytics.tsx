import { TrendingUp, Award, Target, Users, Star, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const performanceMetrics = [
  { metric: "Productivity", current: 85, target: 90, color: "#3b82f6" },
  { metric: "Quality", current: 92, target: 95, color: "#10b981" },
  { metric: "Collaboration", current: 78, target: 85, color: "#f59e0b" },
  { metric: "Innovation", current: 88, target: 90, color: "#8b5cf6" },
  { metric: "Leadership", current: 82, target: 88, color: "#ef4444" },
]

const departmentPerformance = [
  { department: "Engineering", score: 4.3, employees: 245, projects: 28 },
  { department: "Sales", score: 4.1, employees: 156, projects: 18 },
  { department: "Marketing", score: 4.2, employees: 89, projects: 12 },
  { department: "HR", score: 4.4, employees: 34, projects: 8 },
  { department: "Finance", score: 4.0, employees: 28, projects: 6 },
]

const quarterlyTrends = [
  { quarter: "Q1", overall: 4.1, productivity: 4.0, quality: 4.2, satisfaction: 4.1 },
  { quarter: "Q2", overall: 4.2, productivity: 4.1, quality: 4.3, satisfaction: 4.2 },
  { quarter: "Q3", overall: 4.3, productivity: 4.2, quality: 4.4, satisfaction: 4.3 },
  { quarter: "Q4", overall: 4.4, productivity: 4.3, quality: 4.5, satisfaction: 4.4 },
]

const topPerformers = [
  { name: "Sarah Johnson", department: "Engineering", score: 4.9, improvement: "+0.3" },
  { name: "Michael Chen", department: "Sales", score: 4.8, improvement: "+0.2" },
  { name: "Emily Davis", department: "Marketing", score: 4.7, improvement: "+0.4" },
  { name: "David Wilson", department: "HR", score: 4.6, improvement: "+0.1" },
  { name: "Lisa Wang", department: "Engineering", score: 4.5, improvement: "+0.5" },
]

const skillsData = [
  { skill: "Technical", A: 85, B: 90, fullMark: 100 },
  { skill: "Communication", A: 78, B: 85, fullMark: 100 },
  { skill: "Leadership", A: 82, B: 88, fullMark: 100 },
  { skill: "Problem Solving", A: 88, B: 92, fullMark: 100 },
  { skill: "Teamwork", A: 90, B: 87, fullMark: 100 },
  { skill: "Adaptability", A: 75, B: 82, fullMark: 100 },
]

const goalProgress = [
  { goal: "Team Productivity", progress: 78, target: 85, color: "#3b82f6" },
  { goal: "Client Satisfaction", progress: 92, target: 95, color: "#10b981" },
  { goal: "Employee Retention", progress: 88, target: 90, color: "#f59e0b" },
  { goal: "Innovation Index", progress: 85, target: 90, color: "#8b5cf6" },
]

export default function PerformanceDashboard() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Award className="h-4 w-4 mr-2" />
            Performance Review
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border-l-4 border-l-blue-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Overall Score</div>
            <Star className="h-4 w-4 text-blue-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">4.4/5.0</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last quarter
            </p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-green-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Top Performers</div>
            <Award className="h-4 w-4 text-green-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">127</div>
            <p className="text-xs text-gray-600 mt-1">10% of total employees</p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Goals Achieved</div>
            <Target className="h-4 w-4 text-amber-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">86%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last quarter
            </p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-purple-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Team Satisfaction</div>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">4.3/5.0</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.1 from last month
            </p>
          </div>
        </div>
      </div>

      {/* Performance Trends & Skills Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Quarterly Performance Trends</div>
            <div className="text-sm text-gray-600 mt-1">Performance metrics over the past year</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quarterlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quarter" stroke="#64748b" />
                <YAxis domain={[3.5, 5]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="productivity" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="quality" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Skills Assessment</div>
            <div className="text-sm text-gray-600 mt-1">Team A vs Team B skill comparison</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Team A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Team B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Performance & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Department Performance</div>
            <div className="text-sm text-gray-600 mt-1">Performance scores by department</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" stroke="#64748b" />
                <YAxis domain={[3.5, 5]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Top Performers</div>
            <div className="text-sm text-gray-600 mt-1">Highest rated employees this quarter</div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      {performer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">{performer.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{performer.score}</span>
                    <p className="text-xs text-green-600 mt-1">{performer.improvement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Performance Metrics</div>
            <div className="text-sm text-gray-600 mt-1">Current vs target performance across key areas</div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{metric.metric}</span>
                    <span className="text-gray-600">
                      {metric.current}% / {metric.target}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(metric.current / metric.target) * 100}%`,
                        backgroundColor: metric.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Goal Progress</div>
            <div className="text-sm text-gray-600 mt-1">Progress towards organizational goals</div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {goalProgress.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{goal.goal}</span>
                    <span className="text-gray-600">
                      {goal.progress}% / {goal.target}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(goal.progress / goal.target) * 100}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{goal.target - goal.progress} points to target</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
