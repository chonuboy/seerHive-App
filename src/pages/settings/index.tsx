// import MainLayout from "@/components/Layouts/layout";
// import ContentHeader from "@/components/Layouts/content-header";
// import { useEffect } from "react";
// import { useState } from "react";

// export default function Settings() {
//   const [user, setUser] = useState<string | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     const userRole = localStorage.getItem("userRole");
//     setUserRole(userRole);
//     setUser(user);
//   });
//   return (
//     <MainLayout>
//       <ContentHeader title="Settings" />
//       <div>
//         <div className="border border-gray-200 rounded-xl p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-800">
//               {user?.replace('"', "").replace('"', "").charAt(0).toUpperCase()}
//               {user?.slice(2, user.length - 1)}
//             </h2>
//             <h2 className="text-md text-blue-500 font-semibold">
//               {userRole
//                 ?.replace('"', "")
//                 .replace('"', "")
//                 .charAt(0)
//                 .toUpperCase()}
//               {userRole?.slice(2, userRole.length - 1)}
//             </h2>
//           </div>
//         </div>

//         {/* Personal Information Section */}
//         {/* <div className="border border-gray-200 rounded-xl p-6 mb-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-semibold">
//               Personal Information
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">First Name</p>
//               <p className="text-gray-800">{user?.replace('"', "").replace('"', "").charAt(0).toUpperCase()}{user?.slice(2, user.length - 1)}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Email address</p>
//               <p className="text-gray-800">{user?.replace('"', "").replace('"', "").charAt(0).toUpperCase()}{user?.slice(2, user.length - 1)}@gmail.com</p>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </MainLayout>
//   );
// }

"use client";

import { fetchUser, updateUser } from "@/api/users/users";
import { Popup } from "@/components/Elements/cards/popup";
import UpdatePassword from "@/components/Forms/candidates/settings/UpdatePassword";
import UpdateUserName from "@/components/Forms/candidates/settings/UpdateUserName";
import ContentHeader from "@/components/Layouts/content-header";
import MainLayout from "@/components/Layouts/layout";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setEmail } from "@/Features/auth/credentialSlice";
import { User } from "lucide-react";

export default function AccountSettings() {
  const [user, setUser] = useState<string | null>(null);
  const [isUserName, setIsUserName] = useState(false);
  const [isPassWord, setIsPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pwModified, setPWModified] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isNameUpdated, setIsNameUpdated] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    fetchUser(userId).then((data) => {
      setUser(data.username);
      dispatch(setEmail(data.username));
      setPWModified(data.updatedOn);
      setFirstName(data.firstName);
      setLastName(data.lastName);
    });
    setUserId(userId);
  }, [isUserName]);

  const handleUpdate = () => {
    console.log(firstName,lastName)
    updateUser(
      { firstName: firstName, lastName: lastName },
      userId ?? "1"
    ).then((data) => {
      console.log(data);
    });
  };

  const handleCancel = () => {
    setIsNameUpdated(false);
  };

  return (
    <MainLayout>
      <ContentHeader title="Settings" />
      <div className="min-h-screen">
        <div className="">
          <div className="space-y-8">
            {/* Basic Details Card */}
            <div className="">
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-cyan-600">
                  Basic Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your personal information
                </p>
              </div>

              <div className="p-6 space-y-8">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-b border-gray-200 pb-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <div className="">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <h2 className="">{firstName}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <div className="">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <h2 className="">{lastName}</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="text-cyan-500"
                    onClick={() => setIsNameUpdated(true)}
                  >
                    Change Name
                  </button>
                </div>
                {/* <div className="border-b border-gray-200 pb-4">
                  <label className="block text-sm font-medium text-gray-900">
                    Profile Photo
                  </label>
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <button className="inline-flex items-center px-4 py-2 border border-cyan-500 text-cyan-600 bg-white rounded-md text-sm font-medium hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors">
                          Upload photo
                        </button>
                        <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 max-w-md">
                        Display your unique identity. Upload a JPG, GIF or PNG
                        file. We will resize it to 180 x 180 pixels. Upload file
                        size limit is 2MB.
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Account Security Card */}
            <div className="">
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-cyan-600">
                  Account Security
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your login credentials and security settings
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Username
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={user}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>
                    <button
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-md transition-colors"
                      onClick={() => setIsUserName(true)}
                    >
                      Change Username
                    </button>
                  </div>
                  {isUserName && userId && (
                    <Popup onClose={() => setIsUserName(false)}>
                      <UpdateUserName
                        userId={userId}
                        autoClose={() => setIsUserName(false)}
                      ></UpdateUserName>
                    </Popup>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={`Password last modified on ${new Date(
                          pwModified
                        ).toDateString()}`}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                        readOnly
                      />
                    </div>
                    <button
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-md transition-colors"
                      onClick={() => setIsPassword(true)}
                    >
                      Change Password
                    </button>
                  </div>
                  {isPassWord && userId && (
                    <Popup onClose={() => setIsPassword(false)}>
                      <UpdatePassword
                        Id={userId}
                        autoClose={() => setIsPassword(false)}
                      ></UpdatePassword>
                    </Popup>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isNameUpdated && (
        <Popup onClose={handleCancel}>
          <div className=" bg-white mt-10 p-4 rounded-md">
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-4">
                Firstname
              </label>
              <div className="flex  gap-4 items-center">
                <div className="">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter Firstname"
                  className="w-full py-2 text-lg border-0 border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-4">
                Lastname
              </label>
              <div className="flex  gap-4 items-center">
                <div className="">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Lastname"
                  className="w-full py-2 text-lg border-0 border-b-2 border-gray-200 focus:border-cyan-500 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCancel}
                className="px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg font-medium hover:bg-cyan-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-8 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                Update Username
              </button>
            </div>
          </div>
        </Popup>
      )}
    </MainLayout>
  );
}
