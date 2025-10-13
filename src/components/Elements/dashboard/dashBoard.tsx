import ContentHeader from "@/components/Layouts/content-header";
import ClientProjectDashboard from "./clientproject";
import EmployeeDashboard from "./EmployeeDashboard";
import FinancialDashboard from "./FinancialDashboard";
import InterviewDashboard from "./InterviewDashboard";
import OverviewDashboard from "./OverviewDashboard";
import PerformanceDashboard from "./PerformanceAnalytics";
import SkillsTechnologyDashboard from "./TechnologyDashboard";
import { useState } from "react";
import InvoiceDashboard from "./InvoiceDashboard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overall");
  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  }
  return (
    <div>
      <ContentHeader title="Dashboard"></ContentHeader>
      <div className="flex border-b mb-4 border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => onTabChange("overall")}
            className={`py-2 px-4 border-b-4 font-medium text-sm ${
              activeTab === "overall"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            OverAll
          </button>
          {/* <button
            onClick={() => onTabChange("skills")}
            className={`py-2 px-4 border-b-4 font-medium text-sm ${
              activeTab === "skills"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            Skills
          </button> */}
          <button
            onClick={() => onTabChange("clients")}
            className={`py-2 px-4 border-b-4 font-medium text-sm ${
              activeTab === "clients"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => onTabChange("interviews")}
            className={`py-2 px-4 border-b-4 font-medium text-sm ${
              activeTab === "interviews"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            Interviews
          </button>
          <button
            onClick={() => onTabChange("Candidates")}
            className={`py-2 px-4 border-b-4 font-medium text-sm ${
              activeTab === "Candidates"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => onTabChange("Invoice")}
            className={`py-2 px-4 border-b-4 font-medium text-sm ${
              activeTab === "Invoice"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            Invoicing
          </button>
        </nav>
      </div>

      <div className="space-y-4 mx-2">
        {activeTab === "overall" && <OverviewDashboard />}
        {/* {activeTab === "skills" && <SkillsTechnologyDashboard />} */}
        {activeTab === "clients" && <ClientProjectDashboard />}
        {activeTab === "interviews" && <InterviewDashboard />}
        {activeTab === "Candidates" && <EmployeeDashboard />}    
        {activeTab === "Invoice" && <InvoiceDashboard />}
      </div>
    </div>
  );
}
