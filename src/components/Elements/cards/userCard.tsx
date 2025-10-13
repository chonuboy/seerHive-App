import { fetchAllUsers } from "@/api/users/users";
import { useEffect } from "react";
import { useState } from "react";
import { createUser } from "@/api/users/users";
import { Popup } from "./popup";
import { useRouter } from "next/router";

interface User {
  email: string;
  isActive: boolean;
  password: string;
  roles: { roleId: number | undefined; roleName?: string }[];
  userName: string;
}

export default function UserCard() {
  const [allUsers, setAllusers] = useState<any>([]);
  const [isUserAdded, setIsUserAdded] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    fetchAllUsers().then((data) => {
      setAllusers(data);
    });
  }, [isUserAdded]);

  const [formData, setFormData] = useState<User>({
    userName: "",
    password: "",
    email: "",
    roles: [
      {
        roleId: undefined,
      },
    ],
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      roles: [{ roleId }],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(formData).then((data) => {
      setIsUserAdded(false);
    });
  };

  return (
    <div className="space-y-4 text-xs md:text-base mx-4">
      {allUsers?.length == 0 ? (
        <div>
          <h2>No Users</h2>
        </div>
      ) : (
        <div>
          <div className="flex justify-between my-4 items-center">
            <h1 className="text-xl font-bold">Users List</h1>
            <button
              className="bg-blue-500 text-white rounded-md px-4 py-2"
              onClick={() => setIsUserAdded(true)}
            >
              Add User
            </button>
          </div>

          <div className="overflow-x-scroll rounded-lg shadow-md">
            <table className="w-full bg-(var(--content-background)) border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4 font-semibold text-gray-800 border-b">
                    Username
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-800 border-b">
                    Email
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-800 border-b">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers &&
                  allUsers.length > 0 &&
                  allUsers.map((user: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100"
                    >
                      <td className="py-4 px-4">{user.userName}</td>
                      <td className="py-4 px-4">{user.email}</td>
                      <td className="py-4 px-4">{user.roles[0].roleName}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {isUserAdded && (
              <Popup onClose={() => setIsUserAdded(false)}>
                <div className="py-12 px-4 sm:px-6 lg:px-8 mt-6">
                  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Add New User
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="userName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Role
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={formData.roles[0].roleId}
                          onChange={handleRoleChange}
                          className="mt-1 w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-black"
                        >
                          <option value="1">SuperAdmin</option>
                          <option value="2">Recruiter</option>
                          <option value="3">Candidate</option>
                          <option value="4">JR Recruiter</option>
                        </select>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={()=>{
                            setIsUserAdded(false);
                            formData.email = '';
                            formData.password = '';
                            formData.userName = '';
                            
                          }}
                          className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Popup>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
