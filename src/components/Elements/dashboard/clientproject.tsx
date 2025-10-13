import { fetchAllJobs, fetchJobsByClient } from "@/api/client/clientJob";
import {
  getAllClients,
  getClientsCount,
  getOverAllClients,
} from "@/api/master/clients";
import { Client, Job } from "@/lib/models/client";
import {
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCheck,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
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
} from "recharts";

const clientData = [
  { name: "Tech Corp", projects: 12, revenue: 450000, status: "Active" },
  { name: "StartupXYZ", projects: 8, revenue: 280000, status: "Active" },
  { name: "Enterprise Ltd", projects: 15, revenue: 620000, status: "Active" },
  { name: "Innovation Inc", projects: 6, revenue: 180000, status: "On Hold" },
];

const projectStatusData = [
  { name: "Active", value: 45, color: "#10b981" },
  { name: "Planning", value: 23, color: "#3b82f6" },
  { name: "On Hold", value: 12, color: "#f59e0b" },
  { name: "Completed", value: 67, color: "#6b7280" },
];

const revenueData = [
  { month: "Jan", revenue: 4200, projects: 38 },
  { month: "Feb", revenue: 3800, projects: 42 },
  { month: "Mar", revenue: 5200, projects: 45 },
  { month: "Apr", revenue: 4800, projects: 41 },
  { month: "May", revenue: 5900, projects: 48 },
  { month: "Jun", revenue: 6500, projects: 52 },
];

const industryData = [
  { industry: "Technology", count: 28, color: "#3b82f6" },
  { industry: "Finance", count: 22, color: "#10b981" },
  { industry: "Healthcare", count: 18, color: "#f59e0b" },
  { industry: "Retail", count: 15, color: "#8b5cf6" },
  { industry: "Manufacturing", count: 12, color: "#ef4444" },
];

const projectTypes = [
  { type: "Web Development", count: 34, duration: "3-6 months" },
  { type: "Mobile Apps", count: 28, duration: "4-8 months" },
  { type: "Data Analytics", count: 22, duration: "2-4 months" },
  { type: "Cloud Migration", count: 18, duration: "6-12 months" },
];

export default function ClientProjectDashboard() {
  const [totalClients, setTotalClients] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientsCount = async () => {
      try {
        const response = await getClientsCount();
        setTotalClients(response);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchJobsCount = async () => {
      try {
        const response = await fetchAllJobs();
        setTotalJobs(response.length);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const clientsData = await getOverAllClients();
        console.log(clientsData);
        setClients(clientsData.content);
        setError(null);
      } catch (err) {
        setError("Failed to fetch clients");
        console.error("Error fetching clients:", err);
      } finally {
        setLoadingClients(false);
      }
    };

    if (selectedClientId) {
      const fetchJobs = async () => {
        try {
          setLoadingJobs(true);
          const jobsData = await fetchJobsByClient(selectedClientId);
          if (jobsData.message) {
            setJobs([]);
          } else {
            console.log(jobsData);
            setJobs(jobsData);
            setError(null);
          }
        } catch (err) {
          setError("Failed to fetch jobs");
          console.error("Error fetching jobs:", err);
        } finally {
          setLoadingJobs(false);
        }
      };

      fetchJobs();
    } else {
      setJobs([]);
    }

    fetchClients();
    fetchJobsCount();
    fetchClientsCount();
  }, [selectedClientId]);

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = event.target.value
      ? Number.parseInt(event.target.value)
      : null;
    setSelectedClientId(clientId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-200 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Building2 className="h-4 w-4 mr-2" />
            Add Client
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Briefcase className="h-4 w-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalClients}
                </p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8 new this month
                </div>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalJobs}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  23 starting this month
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Closures
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">20</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Closures
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">20</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% from last month
                </div>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="">
        {/* Header */}
        <div className="mb-6">
          <p className="text-gray-600">
            Select a client to view their job postings
          </p>
        </div>

        {/* Client Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label
            htmlFor="client-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Client
          </label>
          {loadingClients ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-gray-500">Loading clients...</span>
            </div>
          ) : (
            <select
              id="client-select"
              value={selectedClientId || ""}
              onChange={handleClientChange}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select a Client --</option>
              {clients.map((client) => (
                <option key={client.clientId} value={client.clientId}>
                  {client.clientName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Display */}
        {selectedClientId && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Jobs for{" "}
                {
                  clients.find((c) => c.clientId === selectedClientId)
                    ?.clientName
                }
              </h2>
            </div>

            {loadingJobs ? (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500">Loading jobs...</span>
                </div>
              </div>
            ) : jobs.length === 0 || !jobs ? (
              <div className="p-6 text-center">
                <div className="text-gray-500">
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    No jobs found
                  </p>
                  <p className="text-gray-500">
                    This client doesn't have any job postings yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job.jobId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.jobTitle}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            #{job.jobCode}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                              Experience: <span className="font-semibold">{job.experience ?? "NA"} years</span>
                            </span>
                            <span>Openings: <span className="font-semibold">{job.noOfOpenings ?? "NA"}</span></span>
                            <span>Type: <span className="font-semibold">{job.hiringType ?? "NA"}</span></span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex flex-col items-end space-y-2">
                            <span className="text-lg font-semibold text-green-600">
                              ₹{job.salaryInCtc} LPA
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                job.isJobActive
                              )}`}
                            >
                              {job.isJobActive}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Charts Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue & Project Trends</h3>
            <p className="text-sm text-gray-600 mb-4">Monthly revenue and project count over time</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Status Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Current status of all projects</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {projectStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* Client Overview & Industry Distribution */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Clients</h3>
            <p className="text-sm text-gray-600 mb-4">Clients by project count and revenue</p>
            <div className="space-y-4">
              {clientData.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.projects} active projects</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(client.revenue / 1000).toFixed(0)}K</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Clients by industry sector</p>
            <div className="space-y-4">
              {industryData.map((industry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: industry.color }} />
                    <span className="text-sm font-medium text-gray-900">{industry.industry}</span>
                  </div>
                  <span className="text-sm text-gray-600">{industry.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* Project Types */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Types & Duration</h3>
          <p className="text-sm text-gray-600 mb-4">Most common project types and their typical duration</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projectTypes.map((type, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 mb-1">{type.count}</div>
                <div className="text-sm font-medium text-gray-700 mb-1">{type.type}</div>
                <div className="text-xs text-gray-500 mb-3">Avg: {type.duration}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(type.count / 34) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
