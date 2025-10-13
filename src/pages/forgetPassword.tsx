"use client"

import { forgotPassword, resetPassword } from "@/api/authcontrol/auth"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useState } from "react"
import * as yup from "yup"

export default function ForgetPassword() {
  const [otp, setOtp] = useState("")
  const [errors, setErrors] = useState("")
  const [responseMsg, setResponseMsg] = useState("")
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [failMsg, setFailMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("Email or username is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true)
      setEmail(values.email)
      try {
        const data = await forgotPassword(values)
        if (data.status === 200) {
          setResponseMsg(data.data)
          setErrors("")
        } else if (data.message?.includes("User not found with username/email")) {
          setErrors("Email or username not found")
        }
      } catch (error) {
        setErrors("An error occurred. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleResetValidation = async () => {
    if (!newPassword) {
      setFailMsg("Please enter a new password")
      return
    }

    if (newPassword !== confirmPassword) {
      setFailMsg("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    try {
      const data = await resetPassword({ email, otp, newPassword })
      if (data.status === 200) {
        setSuccessMsg(data.data)
        setFailMsg("")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else if (data.message === "An unexpected error occurred. Please try again later.") {
        setFailMsg("Invalid OTP entered")
      }
    } catch (error) {
      setFailMsg("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Reset Password</h1>
          </div>

          {!responseMsg ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your email or username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  disabled={isSubmitting}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                )}
                {errors && <p className="mt-2 text-sm text-red-600">{errors}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formik.values.email}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium text-sm transition-colors ${
                  isSubmitting || !formik.values.email
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                }`}
              >
                {isSubmitting ? "Processing..." : "Get OTP"}
              </button>
            </form>
          ) : !otp || otp.length < 6 ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  One-Time Password
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">OTP sent to: {email}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResponseMsg("")
                      setOtp("")
                      setNewPassword("")
                      setConfirmPassword("")
                      setSuccessMsg("")
                      setFailMsg("")
                    }}
                    className="text-xs text-cyan-600 hover:text-cyan-800"
                  >
                    Change email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="*********"
                    className="w-full pl-10 pr-12 py-3 border-b border-gray-300 focus:outline-none focus:border-cyan-500 text-gray-900 placeholder-gray-400 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showNewPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="*********"
                    className="w-full pl-10 pr-12 py-3 border-b border-gray-300 focus:outline-none focus:border-cyan-500 text-gray-900 placeholder-gray-400 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetValidation}
                  disabled={isSubmitting || !newPassword || !confirmPassword}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium text-sm transition-colors ${
                    isSubmitting || !newPassword || !confirmPassword
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                  }`}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>

              {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">{successMsg}</p>
                </div>
              )}

              {failMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{failMsg}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
