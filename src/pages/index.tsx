import SeertechLogo from "@/components/Layouts/header";
import SideNav from "@/components/Layouts/sidenav";
import Dashboard from "@/components/Elements/dashboard/dashBoard";
import ProtectedRoute from "@/Features/protectedRoute";
import UserCard from "@/components/Elements/cards/userCard";
import { useEffect,useState } from "react";

export default function Home() {

  const [userRole,setUserRole] = useState<string | null>(null);
  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    const truncatedUserRole = userRole?.replace('"', "").replace('"', "");
    setUserRole(truncatedUserRole ?? "");
    return () => {
      userRole;
    };
    
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen overflow-auto">
        <SeertechLogo />
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-60">
            <SideNav />
          </div>
          <div className="flex-grow md:overflow-y-auto py-4">
            <Dashboard></Dashboard>
            {/* {userRole === "SuperAdmin" && <UserCard></UserCard>} */}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
