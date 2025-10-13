import {
  getActiveContactsCount,
  getCandidateCount,
} from "@/api/candidates/candidates";
import { fetchAllContactInterviews } from "@/api/candidates/interviews";
import {
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  DollarSign,
  MonitorUp,
  MoveUpRight,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
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
} from "recharts";

const monthlyData = [
  { month: "Jan", hires: 12, interviews: 45 },
  { month: "Feb", hires: 19, interviews: 52 },
  { month: "Mar", hires: 15, interviews: 48 },
  { month: "Apr", hires: 22, interviews: 61 },
  { month: "May", hires: 18, interviews: 55 },
  { month: "Jun", hires: 25, interviews: 68 },
];

export default function OverviewDashboard() {
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [activeCandidates, setActiveCandidates] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [passedCandidates, setPassedCandidates] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusData = [
    { name: "Hired", value: passedCandidates, color: "#10b981" },
    { name: "Scheduled", value: scheduledCount, color: "#0077ff" },
    { name: "On Hold", value: pendingCount, color: "#ffc562" },
    { name: "Rejected", value: 0, color: "#ef4444" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch data in parallel for better performance
        const [totalResponse, activeResponse, interviewCounts] = await Promise.all([
          getCandidateCount(),
          getActiveContactsCount(),
          fetchAllContactInterviews()
        ]);
        
        setTotalCandidates(totalResponse || 0);
        setActiveCandidates(
          activeResponse?.filter((candidate: any) => candidate.isActive === true)
            .length || 0
        );
        
        // Safe filtering with optional chaining
        setPassedCandidates(
          interviewCounts?.content.filter(
            (candidate: any) => candidate.interviewStatus === "SELECTED"
          ).length || 0
        );
        setScheduledCount(
          interviewCounts?.content.filter(
            (candidate: any) => candidate.interviewStatus === "IN_PROGRESS"
          ).length || 0
        );
        setPendingCount(
          interviewCounts?.content.filter(
            (candidate: any) =>
              candidate.interviewStatus === "Pending" || candidate.interviewStatus === "IN_PROGRESS"
          ).length || 0
        );
        setInterviewsCount(interviewCounts?.content.length || 0);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"></div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Candidates
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalCandidates}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
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
                <p className="text-sm font-medium text-gray-600">
                  Active Candidates
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {activeCandidates}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </div>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Scheduled Interviews
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {interviewsCount}
                </p>
                <div className="flex items-center mt-2 text-xs text-amber-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  This week: 42
                </div>
              </div>
              <Calendar className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hired</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {passedCandidates}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </div>
              </div>
              <MoveUpRight className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Monthly Hiring Trends
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Hires, interviews over the past 6 months
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
                <Bar dataKey="hires" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="interviews"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interview Stats
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Current status of all Interviews in the system
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}