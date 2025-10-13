import { updateUser } from "@/api/users/users";
import { User, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { logout } from "@/Features/auth/credentialSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const UpdateUserName = ({
  autoClose,
  userId,
}: {
  autoClose: () => void;
  userId: string;
}) => {
  const [userName, setUsername] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const handleCancel = () => {
    autoClose();
    setUsername("");
  };

  const handleUpdate = () => {
    // Handle username update logic here
    try {
      updateUser({ username: userName }, userId).then((data) => {
        console.log(data);
        if (data.message) {
          toast.error(data.message, { position: "top-right" });
        } else {
          autoClose();
          toast.success("Username updated successfully Please login again", {
            position: "top-right",
          });
          setTimeout(() => {
            dispatch(logout());
            localStorage.clear();
            router.push("/login");
          }, 2000);
        }
      });
    } catch (err) {
      console.log(err);
    }

    console.log("Updating username to:", userName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Change Username
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-12 pr-4 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
              />
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
              Update Username
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserName;
