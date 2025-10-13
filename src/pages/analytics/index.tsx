import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { useState } from "react";
import PerformanceDashboard from "@/components/Elements/dashboard/PerformanceAnalytics";
import FinancialDashboard from "@/components/Elements/dashboard/FinancialDashboard";

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("analytics");
  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <MainLayout>
      <ContentHeader title="Analytics" />
      <div>
        <div className="flex border-b mb-4 border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => onTabChange("analytics")}
              className={`py-2 px-4 border-b-4 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              Overall
            </button>
            <button
              onClick={() => onTabChange("Finance")}
              className={`py-2 px-4 border-b-4 font-medium text-sm ${
                activeTab === "Finance"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              Invoice
            </button>
          </nav>
        </div>
        {activeTab === "analytics" && <PerformanceDashboard />}
        {activeTab === "Finance" && <FinancialDashboard />}
      </div>
    </MainLayout>
  );
}
