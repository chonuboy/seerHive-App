import MainLayout from "@/components/Layouts/layout";
import ContentHeader from "@/components/Layouts/content-header";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Twitter,
  ChevronDown,
} from "lucide-react";

export default function Help() {
  const [activeTab, setActiveTab] = useState("message");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center">
        <div className="w-full h-full bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5">
            {/* Left sidebar - Contact Info */}
            <div className="md:col-span-2 h-screen bg-gradient-to-br from-cyan-500 to-purple-600 text-white p-8">
              <div className="h-full flex flex-col">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Contact Us</h2>
                  <div className="w-40 h-1 bg-white rounded mb-6"></div>
                  <p className="text-purple-100 mb-8">
                    We'd love to hear from you. Fill out the form and we'll get
                    back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 mr-4 mt-1 text-purple-300" />
                    <div>
                      <h3 className="font-semibold text-sm text-purple-200">
                        Email
                      </h3>
                      <p className="text-white">careers@seertechsystems.in</p>
                      <p className="text-white">sales@seertechsystems.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 mr-4 mt-1 text-purple-300" />
                    <div>
                      <h3 className="font-semibold text-sm text-purple-200">
                        Phone
                      </h3>
                      <p className="text-white">+91 90435 71075</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-4 mt-1 text-purple-300" />
                    <div>
                      <h3 className="font-semibold text-sm text-purple-200">
                        Address
                      </h3>
                      <p className="text-white">
                        SeerTech Systems,
                        <br />
                        Ramaniyam Marvel, Seshadripuram,
                        <br />
                        1st Main Road, Velachery,
                        <br />
                        Chennai – 600042
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="font-semibold text-sm text-purple-200 mb-3">
                    Connect with us
                  </h3>
                  <div className="flex space-x-3">
                    <a
                      href="https://x.com/SeertechSystems"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/seertechsystems"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="md:col-span-3 p-8">
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab("message")}
                  className={`pb-3 font-semibold text-sm transition-colors relative ${
                    activeTab === "message"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Send Message
                  {/* {activeTab === "message" && (
                    <span className="absolute bottom-0 left-0 w-32 h-0.5 bg-blue-500 dark:bg-white"></span>
                  )} */}
                </button>
                {/* <button
                  onClick={() => setActiveTab("location")}
                  className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
                    activeTab === "location"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Our Location
                  {activeTab === "location" && (
                    <span className="absolute bottom-0 left-0 w-32 h-0.5 bg-blue-500 dark:bg-white"></span>
                  )}
                </button> */}
              </div>

              <form
                action="https://formsubmit.co/careers@seertechsystems.in"
                method="POST"
                className="space-y-5"
              >
                {/* FormSubmit configuration */}
                <input
                  type="hidden"
                  name="_subject"
                  value="New Contact Form Submission"
                />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value="" />

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="firstName"
                      className="text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="lastName"
                      className="text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="phone"
                      className="text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="subject"
                    className="text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center group"
                >
                  <span>Send Message</span>
                  <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
