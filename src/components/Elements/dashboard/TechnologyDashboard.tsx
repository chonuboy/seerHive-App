import { Code, Award, BookOpen, TrendingUp, Users, Zap } from "lucide-react"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const technologyData = [
  { tech: "JavaScript", employees: 234, projects: 45, proficiency: 4.2 },
  { tech: "Python", employees: 189, projects: 38, proficiency: 4.0 },
  { tech: "React", employees: 145, projects: 32, proficiency: 4.3 },
  { tech: "Node.js", employees: 123, projects: 28, proficiency: 3.9 },
  { tech: "AWS", employees: 98, projects: 25, proficiency: 4.1 },
  { tech: "Docker", employees: 87, projects: 22, proficiency: 3.8 },
]

const skillLevels = [
  { level: "Beginner", count: 145, color: "#ef4444" },
  { level: "Intermediate", count: 298, color: "#f59e0b" },
  { level: "Advanced", count: 156, color: "#10b981" },
  { level: "Expert", count: 89, color: "#3b82f6" },
]

const certificationData = [
  { month: "Jan", aws: 12, azure: 8, google: 5, other: 3 },
  { month: "Feb", aws: 15, azure: 10, google: 7, other: 4 },
  { month: "Mar", aws: 18, azure: 12, google: 9, other: 6 },
  { month: "Apr", aws: 22, azure: 14, google: 11, other: 8 },
  { month: "May", aws: 25, azure: 16, google: 13, other: 10 },
  { month: "Jun", aws: 28, azure: 18, google: 15, other: 12 },
]

const skillGaps = [
  { skill: "Machine Learning", current: 45, required: 80, gap: 35 },
  { skill: "DevOps", current: 67, required: 90, gap: 23 },
  { skill: "Cloud Architecture", current: 52, required: 75, gap: 23 },
  { skill: "Cybersecurity", current: 38, required: 60, gap: 22 },
  { skill: "Data Science", current: 41, required: 65, gap: 24 },
]

const trainingPrograms = [
  { program: "AWS Certification", enrolled: 45, completed: 32, completion: 71 },
  { program: "React Advanced", enrolled: 38, completed: 28, completion: 74 },
  { program: "Python for Data Science", enrolled: 52, completed: 35, completion: 67 },
  { program: "DevOps Fundamentals", enrolled: 29, completed: 22, completion: 76 },
  { program: "Machine Learning", enrolled: 41, completed: 25, completion: 61 },
]

const skillRadarData = [
  { skill: "Frontend", teamA: 85, teamB: 78, industry: 80 },
  { skill: "Backend", teamA: 78, teamB: 85, industry: 82 },
  { skill: "Database", teamA: 72, teamB: 80, industry: 75 },
  { skill: "DevOps", teamA: 68, teamB: 75, industry: 70 },
  { skill: "Testing", teamA: 80, teamB: 70, industry: 77 },
  { skill: "Security", teamA: 65, teamB: 72, industry: 68 },
]

const trendingSkills = [
  { skill: "AI/ML", growth: 145, demand: 92, color: "#8b5cf6" },
  { skill: "Blockchain", growth: 89, demand: 67, color: "#10b981" },
  { skill: "IoT", growth: 76, demand: 54, color: "#f59e0b" },
  { skill: "AR/VR", growth: 65, demand: 48, color: "#ef4444" },
  { skill: "Quantum Computing", growth: 34, demand: 23, color: "#3b82f6" },
]

export default function SkillsTechnologyDashboard() {
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <BookOpen className="h-4 w-4 mr-2" />
            Create Training
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Award className="h-4 w-4 mr-2" />
            Skill Assessment
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border-l-4 border-l-blue-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Technologies</div>
            <Code className="h-4 w-4 text-blue-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">47</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 new this quarter
            </p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-green-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Certified Employees</div>
            <Award className="h-4 w-4 text-green-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">291</div>
            <p className="text-xs text-gray-600 mt-1">23% of total workforce</p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Skill Coverage</div>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">78%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last quarter
            </p>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-purple-500 rounded-lg shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium text-gray-600">Trending Skills</div>
            <Zap className="h-4 w-4 text-purple-500" />
          </div>
          <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-purple-600 mt-1">AI/ML leading growth</p>
          </div>
        </div>
      </div>

      {/* Technology Distribution & Skill Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Technology Distribution</div>
            <div className="text-sm text-gray-600 mt-1">Employee count by technology stack</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={technologyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tech" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Skill Level Distribution</div>
            <div className="text-sm text-gray-600 mt-1">Employee distribution across skill levels</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillLevels}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ level, count }) => `${level}: ${count}`}
                >
                  {skillLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Certification Trends & Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Certification Trends</div>
            <div className="text-sm text-gray-600 mt-1">Monthly certification achievements by platform</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={certificationData}>
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
                <Line type="monotone" dataKey="aws" stroke="#ff9900" strokeWidth={3} />
                <Line type="monotone" dataKey="azure" stroke="#0078d4" strokeWidth={2} />
                <Line type="monotone" dataKey="google" stroke="#4285f4" strokeWidth={2} />
                <Line type="monotone" dataKey="other" stroke="#6b7280" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Critical Skill Gaps</div>
            <div className="text-sm text-gray-600 mt-1">Areas requiring immediate attention</div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {skillGaps.map((gap, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{gap.skill}</span>
                    <span className="text-red-600 font-medium">Gap: {gap.gap}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="flex h-3 rounded-full overflow-hidden">
                      <div className="bg-green-500" style={{ width: `${(gap.current / gap.required) * 100}%` }} />
                      <div className="bg-red-200" style={{ width: `${(gap.gap / gap.required) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current: {gap.current}</span>
                    <span>Required: {gap.required}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Training Programs & Skill Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Training Program Progress</div>
            <div className="text-sm text-gray-600 mt-1">Enrollment and completion rates by program</div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {trainingPrograms.map((program, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{program.program}</h4>
                    <span className="text-sm text-gray-600">{program.completion}% completion</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>Enrolled: {program.enrolled}</span>
                    <span>Completed: {program.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${program.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="text-lg font-semibold text-gray-900">Skill Comparison</div>
            <div className="text-sm text-gray-600 mt-1">Team performance vs industry standards</div>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Team A" dataKey="teamA" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Team B" dataKey="teamB" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="Industry" dataKey="industry" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trending Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="text-lg font-semibold text-gray-900">Trending Skills & Technologies</div>
          <div className="text-sm text-gray-600 mt-1">Emerging technologies and their growth patterns</div>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {trendingSkills.map((skill, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 mb-2">{skill.skill}</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Growth: {skill.growth}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(skill.growth, 100)}%`,
                          backgroundColor: skill.color,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Demand: {skill.demand}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${skill.demand}%`,
                          backgroundColor: skill.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
