import NavLinks from "@/components/Layouts/nav-links";
import { imgHelper } from "@/lib/image-helper";
import { useDispatch } from "react-redux";
import { logout } from "@/Features/auth/credentialSlice";
import { useRouter } from "next/navigation";

export default function SideNav() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <>
      {/* Sidebar for Desktop View  */}
      <section className="hidden md:block bg-(var(--content-background)) pr-2 py-4 h-full top-10 cts-sidebar">
        <nav className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        </nav>
      </section>
      {/* sidebar for mobile view */}
      <section
        id="sidebar"
        className="fixed left-0 inset-y-0 transform -translate-x-full md:hidden transition-transform duration-200 ease-in-out bg-gray-50 py-4 h-full z-10 w-10 mt-8"
      >
        <nav className="space-y-4">
          <NavLinks />
        </nav>
        <button
          className="flex h-[48px] grow items-center justify-center ml-3 mt-1 gap-4 hover:bg-blue-500 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3"
          onClick={() => {
            dispatch(logout());
            localStorage.clear();
            setTimeout(() => {
              router.push("/login");
            }, 1000);
          }}
        >
          <img src={imgHelper.logout} alt="Logout" className="w-5 h-5" />
        </button>
      </section>
    </>
  );
}
