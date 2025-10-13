import { useState } from "react";
import { Lock, Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateUser } from "@/api/users/users";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "@/Features/auth/credentialSlice";

export default function UpdatePassword({
  autoClose,
  Id,
}: {
  autoClose: () => void;
  Id: string;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCancel = () => {
    autoClose();
    // setOldPassword("")
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleUpdate = () => {
    // Handle password update logic here
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right" });
    } else {
      updateUser({ password: newPassword }, Id).then((data) => {
        console.log(data);
        if (data.message) {
          toast.error(data.message, { position: "top-right" });
        } else {
          autoClose();
          toast.success("Password updated successfully Please Login Again", {
            position: "top-right",
          });
          setTimeout(() => {
            dispatch(logout());
            localStorage.clear();
            router.push("/login");
          }, 2000);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center border-b border-gray-200 justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Change Password
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Old Password */}
          {/* <div className="mb-6">
            <label className="block text-md font-semibold mb-4">
              Old Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div> */}

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-4">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleCancel}
              className="px-8 py-3 border-2 border-cyan-500 text-cyan-500 rounded-lg font-medium hover:bg-cyan-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-8 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
