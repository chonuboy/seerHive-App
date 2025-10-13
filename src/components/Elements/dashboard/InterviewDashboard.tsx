import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
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

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchAllContactInterviews } from "@/api/candidates/interviews";
import {
  fetchAllInterviewRounds,
  fetchInterviewRound,
} from "@/api/interviews/InterviewRounds";

const interviewStats = [
  { status: "Scheduled", count: 45, color: "#3b82f6" },
  { status: "Completed", count: 128, color: "#10b981" },
  { status: "Cancelled", count: 12, color: "#ef4444" },
  { status: "Re-Scheduled", count: 8, color: "#d7e02c" },
];

const weeklyInterviews = [
  { day: "Mon", scheduled: 12, completed: 10, cancelled: 1, noShow: 1 },
  { day: "Tue", scheduled: 15, completed: 13, cancelled: 1, noShow: 1 },
  { day: "Wed", scheduled: 18, completed: 16, cancelled: 1, noShow: 1 },
  { day: "Thu", scheduled: 14, completed: 12, cancelled: 1, noShow: 1 },
  { day: "Fri", scheduled: 16, completed: 14, cancelled: 1, noShow: 1 },
];

interface Interview {
  interviewId: number;
  interviewDate: string;
  interviewStatus: string;
  clientJob: {
    jobId: number;
    jobCode: string;
    jobTitle: string;
    salaryInCtc: number;
    client: {
      clientId: number;
      clientName: string;
    };
  };
  contactDetails: {
    contactId: number;
    firstName: string;
    lastName: string;
    primaryNumber: string;
    emailId: string;
    designation: string;
    totalExperience: number;
    currentLocation: {
      locationDetails: string;
    };
  };
}

interface InterviewRound {
  roundId: number;
  roundNumber: number;
  roundDate: string;
  interviewTime: string | null;
  interviewerName: string;
  techRating: number;
  softskillsRating: number;
  interviewStatus: string;
  remarks: string;
}

interface InterviewWithRounds extends Interview {
  rounds: InterviewRound[];
  roundsLoading: boolean;
}

const todayInterviews = [
  {
    time: "09:00 AM",
    candidate: "Sarah Johnson",
    position: "Senior Developer",
    interviewer: "John Smith",
    type: "Technical",
    status: "scheduled",
    initials: "SJ",
  },
  {
    time: "10:30 AM",
    candidate: "Michael Chen",
    position: "Product Manager",
    interviewer: "Emily Davis",
    type: "Behavioral",
    status: "completed",
    initials: "MC",
  },
  {
    time: "02:00 PM",
    candidate: "Lisa Wang",
    position: "UX Designer",
    interviewer: "David Wilson",
    type: "Portfolio Review",
    status: "scheduled",
    initials: "LW",
  },
  {
    time: "03:30 PM",
    candidate: "Robert Brown",
    position: "Data Analyst",
    interviewer: "Anna Taylor",
    type: "Technical",
    status: "scheduled",
    initials: "RB",
  },
];

export default function InterviewDashboard() {
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<
    InterviewWithRounds[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const interviewsData = await fetchAllContactInterviews();
        setAllInterviews(interviewsData.content);
        setError(null);
      } catch (err) {
        setError("Failed to fetch interviews");
        console.error("Error fetching interviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Filter interviews by date and fetch rounds for each
  useEffect(() => {
    if (selectedDate && allInterviews.length > 0) {
      const interviewsForDate = allInterviews.filter(
        (interview) => interview.interviewDate === selectedDate
      );
      console.log(interviewsForDate);

      // Initialize interviews with empty rounds and loading state
      const interviewsWithRounds: InterviewWithRounds[] = interviewsForDate.map(
        (interview) => ({
          ...interview,
          rounds: [],
          roundsLoading: true,
        })
      );

      setFilteredInterviews(interviewsWithRounds);

      // Fetch all rounds once and then filter for each interview
      const fetchAndFilterRounds = async () => {
        try {
          // Fetch all rounds once
          const allRoundsResponse = await fetchAllInterviewRounds();

          // Handle both single object and array responses
          let allRounds: any[] = [];
          if (allRoundsResponse) {
            if (Array.isArray(allRoundsResponse)) {
              allRounds = allRoundsResponse;
            } else {
              allRounds = [allRoundsResponse];
            }
          }

          // Update each interview with its filtered rounds
          const updatedInterviews = interviewsForDate.map((interview) => {
            // Filter rounds for this specific interview and selected date
            const roundsForInterview = allRounds.filter(
              (round: any) =>
                round.interview?.interviewId === interview.interviewId &&
                round.roundDate === selectedDate
            );

            // Sort rounds by round number
            roundsForInterview.sort(
              (a: any, b: any) => a.roundNumber - b.roundNumber
            );

            return {
              ...interview,
              rounds: roundsForInterview,
              roundsLoading: false,
            };
          });

          setFilteredInterviews(updatedInterviews);
        } catch (err) {
          console.error("Error fetching all interview rounds:", err);

          // Set all interviews to not loading with empty rounds
          const errorInterviews = interviewsForDate.map((interview) => ({
            ...interview,
            rounds: [],
            roundsLoading: false,
          }));

          setFilteredInterviews(errorInterviews);
        }
      };

      fetchAndFilterRounds();
    } else {
      setFilteredInterviews([]);
    }
  }, [selectedDate, allInterviews]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "Not specified";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  // Get unique dates for quick selection
  const availableDates = [
    ...new Set(allInterviews.map((interview) => interview.interviewDate)),
  ].sort();
  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          {/* <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </button> */}
          <button
            className="flex items-center px-4 py-2 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
            onClick={() => {
              router.push("/search");
            }}
          >
            <Users className="h-4 w-4 mr-2" />
            Schedule Interview
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
                  Today's Interviews
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">8</p>
                <p className="text-xs text-gray-600 mt-2">
                  4 completed, 4 scheduled
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">75</p>
                <p className="text-xs text-green-600 mt-2">
                  65 completed successfully
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-amber-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">73%</p>
                <p className="text-xs text-green-600 mt-2">
                  +4% from last month
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Duration
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">52 min</p>
                <p className="text-xs text-gray-600 mt-2">
                  3 min shorter than avg
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Weekly Interview Activity
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Interview outcomes by day of the week
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyInterviews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interview Status Distribution
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Overall interview status breakdown
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={interviewStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {interviewStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Rounds Dashboard
          </h1>
          <p className="text-gray-600">
            Select a date to view interview rounds
          </p>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <label
                htmlFor="interview-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Interview Date
              </label>
              <input
                type="date"
                id="interview-date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {availableDates.length > 0 && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableDates.slice(0, 5).map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors duration-150 ${
                        selectedDate === date
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-500">Loading interviews...</span>
              </div>
            </div>
          </div>
        )}

        {/* Interviews Display */}
        {!loading && selectedDate && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Interview Rounds for {formatDate(selectedDate)}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredInterviews.length} interview
                  {filteredInterviews.length !== 1 ? "s" : ""})
                </span>
              </h2>
            </div>

            {filteredInterviews.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    No interviews scheduled
                  </p>
                  <p className="text-gray-500">
                    There are no interview rounds scheduled for this date.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-6">
                  {filteredInterviews.map((interview) => (
                    <div
                      key={interview.interviewId}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-150"
                    >
                      {/* Candidate Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {interview.contactDetails.firstName.charAt(0)}
                                {interview.contactDetails.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {interview.contactDetails.firstName}{" "}
                              {interview.contactDetails.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {interview.contactDetails.designation}
                            </p>
                            <p className="text-sm text-gray-500">
                              {interview.clientJob.jobTitle} at{" "}
                              {interview.clientJob.client.clientName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">
                            ₹{interview.clientJob.salaryInCtc} LPA
                          </p>
                          <p className="text-sm text-gray-500">
                            {interview.roundsLoading
                              ? "Loading..."
                              : `${interview.rounds.length} Round(s)`}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Phone:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {interview.contactDetails.primaryNumber}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Email:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {interview.contactDetails.emailId}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Experience:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {interview.contactDetails.totalExperience} years
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rounds */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          Interview Rounds:
                        </h4>

                        {interview.roundsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-500">
                              Loading rounds...
                            </span>
                          </div>
                        ) : interview.rounds.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No rounds scheduled for this date</p>
                          </div>
                        ) : (
                          interview.rounds.map((round) => (
                            <div
                              key={round.roundId}
                              className="border border-gray-200 rounded-lg p-4 bg-white"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                    {round.roundNumber}
                                  </span>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      Round {round.roundNumber}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Interviewer: {round.interviewerName}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-medium text-blue-600">
                                    🕒 {formatTime(round.interviewTime)}
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                      round.interviewStatus
                                    )}`}
                                  >
                                    {round.interviewStatus}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Tech Rating:
                                  </span>
                                  <span
                                    className={`ml-2 font-semibold ${getRatingColor(
                                      round.techRating
                                    )}`}
                                  >
                                    {round.techRating}/5 ⭐
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Soft Skills:
                                  </span>
                                  <span
                                    className={`ml-2 font-semibold ${getRatingColor(
                                      round.softskillsRating
                                    )}`}
                                  >
                                    {round.softskillsRating}/5 ⭐
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Overall:
                                  </span>
                                  <span
                                    className={`ml-2 font-semibold ${getRatingColor(
                                      (round.techRating +
                                        round.softskillsRating) /
                                        2
                                    )}`}
                                  >
                                    {(
                                      (round.techRating +
                                        round.softskillsRating) /
                                      2
                                    ).toFixed(1)}
                                    /5 ⭐
                                  </span>
                                </div>
                              </div>

                              {round.remarks && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <span className="font-medium text-gray-700">
                                    Remarks:
                                  </span>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {round.remarks}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Action Buttons
                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150">
                          View Full Details
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150">
                          Schedule Next Round
                        </button>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions when no date is selected */}
        {!loading && !selectedDate && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-1">
                Select a date to view interview rounds
              </p>
              <p className="text-gray-500">
                Choose a date from the date picker above to see scheduled
                interview rounds.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Today's Schedule */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Today's Interview Schedule
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upcoming and completed interviews for today
          </p>
          <div className="space-y-4">
            {todayInterviews.map((interview, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900 w-20">
                    {interview.time}
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {interview.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {interview.candidate}
                    </p>
                    <p className="text-sm text-gray-500">
                      {interview.position}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{interview.type}</p>
                  <p className="text-xs text-gray-500">
                    with {interview.interviewer}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    interview.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {interview.status === "completed" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {interview.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
