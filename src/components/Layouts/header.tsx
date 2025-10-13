import { imgHelper } from "@/lib/image-helper";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { User } from "lucide-react";

export default function SeerTechLogo() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user);
  }, []);
  return (
    <header
      className={`sticky top-0 w-full flex justify-between shadow-md items-center bg-var(--background) py-3 px-4 z-15`}
    >
      <button
        id="menu-toggle"
        className="md:hidden"
        onClick={() =>
          document
            .getElementById("sidebar")
            ?.classList.toggle("-translate-x-full")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 7.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        <img
          src={imgHelper.seertechsystemsLogo}
          alt="Company Logo"
          className="w-10 h-10 object-cover rounded-full p-1"
        />
        <h3 className="text-xl font-semibold">SeerHive</h3>
      </div>
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setTimeout(() => router.push("/settings"), 1000)}
      >
        {
          <h3 className="font-semibold text-md">
            {user?.replace('"', "").replace('"', "").charAt(0).toUpperCase()}
            {user?.slice(2, user.length - 1)}
          </h3>
        }
        <User className="w-10 h-10 bg-white rounded-full p-1"></User>
      </div>
    </header>
  );
}
