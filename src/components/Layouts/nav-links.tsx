import { usePathname } from "next/navigation";
import { logout } from "@/Features/auth/credentialSlice";
import {
  Home,
  User,
  Building,
  Briefcase,
  ClipboardList,
  Search,
  BadgeHelp,
  LineChart,
  Settings,
  LogOut,
  Timer,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Candidates", icon: User, href: "/candidates" },
  { name: "Clients", icon: Building, href: "/clients" },
  { name: "Jobs", icon: Briefcase, href: "/alljobs" },
  { name: "Interviews", icon: Timer, href: "/interviews" },
  { name: "Invoice", icon: Newspaper, href: "/invoice" },
  { name: "Recruitment", icon: ClipboardList, href: "/recruitments" },
  { name: "Search", icon: Search, href: "/search" },
  {
    name: "Help",
    href: "/help",
    icon: BadgeHelp,
  },
  { name: "Analytics", icon: LineChart, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   {
//     name: "Home",
//     href: "/",
//     icon: Home,
//   },
//   {
//     name: "Candidates",
//     href: "/candidates",
//     icon: User,
//   },
//   {
//     name: "Clients",
//     href: "/clients",
//     icon: Building,
//   },
//   {
//     name: "All Jobs",
//     href: "/alljobs",
//     icon: Briefcase,
//   },
//   {
//     name: "Recruitment",
//     href: "/recruitments",
//     icon: ClipboardList,
//   },
//   {
//     name: "Analytics",
//     href: "/analytics",
//     icon: LineChart,
//   },
//   {
//     name: "Help",
//     href: "/help",
//     icon: BadgeHelp,
//   },
//   {
//     name: "Search",
//     href: "/search",
//     icon: Search,
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//   },
// ];

export default function NavLinks() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <nav className="flex flex-col h-full py-4 bg-var(--background)">
      <ul className="space-y-6">
        {navItems.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              className={`py-2 px-4 rounded-md text-md font-semibold transition-colors flex h-[48px] grow items-center justify-center gap-4 md:flex-none md:justify-start md:p-2 md:px-3 ${
                pathname == item.href
                  ? "bg-white text-black"
                  : "text-gray-600 hover:bg-blue-200 hover:text-cyan-600"
              }`}
            >
              <item.icon
                className={`h-7 w-7 ${
                  pathname == item.href
                    ? "text-white bg-cyan-600 p-1 rounded-full"
                    : "text-cyan-500"
                }`}
              />
              <span className="hidden md:block">{item.name}</span>
            </a>
          </li>
        ))}
        <button
          className={`py-2 px-4 rounded-md text-md font-semibold w-full transition-colors flex h-[48px] grow items-center justify-center gap-4 md:flex-none md:justify-start md:p-2 md:px-3 ${
            pathname == "/login"
              ? "bg-white text-black"
              : "text-gray-600 hover:bg-blue-200 hover:text-cyan-600"
          }`}
          onClick={() => {
            dispatch(logout());
            localStorage.clear();
            setTimeout(() => {
              router.push("/login");
            }, 1000);
          }}
        >
          <LogOut
            className={`h-7 w-7 ${
              pathname == "/login"
                ? "text-white bg-cyan-600 p-1 rounded-full"
                : "text-cyan-500"
            }`}
          ></LogOut>
          <div className="hidden md:block">Logout</div>
        </button>
      </ul>
    </nav>
  );
}
