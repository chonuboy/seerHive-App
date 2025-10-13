import Link from "next/link";
import { imgHelper } from "@/lib/image-helper";

const GoogleButton = () => {
  return (
    <Link href="/api/auth/signin/google">
      <div className="flex items-center gap-2 justify-center md:p-4 p-2 mt-4 border border-gray-300 rounded-full">
        <img src={imgHelper.google} className="w-5 h-5" alt="" />
        <button>Sign in with Google</button>
      </div>
    </Link>
  );
};

export default GoogleButton;
