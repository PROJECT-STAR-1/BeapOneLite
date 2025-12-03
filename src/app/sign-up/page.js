"use client";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
  const [tab, setTab] = useState("signin");

  return (
    <div className="min-h-screen bg-[#eef3fc] flex items-center justify-center px-6 p-4">
      <div className="flex w-full max-w-6xl gap-10">
        {/* LEFT SECTION */}
        <div className="w-1/2">
          <button className="flex items-center gap-2 text-gray-700 mb-6">
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              B
            </div>
            <div>
              <h1 className="text-3xl font-semibold">BEAPOne Lite</h1>
              <p className="text-gray-500 -mt-1">Business Made Simple</p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold leading-snug mt-10">
            Manage Your Business, <br />
            <span className="text-blue-600">Anywhere in Africa</span>
          </h2>

          <ul className="mt-8 space-y-4 text-lg text-gray-700">
            {[
              "Works offline - no internet needed",
              "Multi-currency support with real-time FX rates",
              "Mobile-first design for business on the go",
              "Free forever plan - no credit card required",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={24} />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 p-4 bg-white rounded-xl shadow-sm w-[80%] flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500"></div>
              <div className="w-8 h-8 rounded-full bg-blue-500"></div>
              <div className="w-8 h-8 rounded-full bg-green-500"></div>
            </div>
            <p className="text-gray-600 font-medium">
              Trusted by 10,000+ businesses <br />
              <span className="text-sm">
                Across Nigeria, Kenya, Ghana & South Africa
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-1/2 bg-white rounded-2xl shadow-xl p-10">
          {/* TOP TABS */}
          <div className="flex bg-gray-100 rounded-full mb-8">
            <button
              onClick={() => setTab("signin")}
              className={`w-1/2 py-3 text-center rounded-full font-medium ${
                tab === "signin"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setTab("signup")}
              className={`w-1/2 py-3 text-center rounded-full font-medium ${
                tab === "signup"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* SIGN IN FORM */}
          {tab === "signin" && (
            <div>
              <label className="font-medium">Email Address</label>
              <div className="relative mt-1 mb-6">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="adebayo@example.com"
                />
              </div>

              <label className="font-medium">Password</label>
              <div className="relative mt-1 mb-2">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-right text-blue-600 text-sm mb-6 cursor-pointer">
                Forgot password?
              </p>

              <div className="p-3 bg-blue-100 text-blue-700 rounded-lg text-sm mb-6">
                <strong>Demo Mode:</strong> Use any email/password or the
                pre-filled credentials to sign in
              </div>

              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg">
                Sign In to Dashboard
              </button>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t"></div>
                <p className="px-3 text-gray-400">OR CONTINUE WITH</p>
                <div className="flex-1 border-t"></div>
              </div>

              <div className="flex gap-4">
                <button className="w-1/2 p-3 border rounded-lg flex items-center justify-center gap-2">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5" />
                  Google
                </button>

                <button className="w-1/2 p-3 border rounded-lg flex items-center justify-center gap-2">
                  <img src="https://www.svgrepo.com/show/448252/microsoft.svg" className="w-5" />
                  Microsoft
                </button>
              </div>
            </div>
          )}

          {/* SIGN UP FORM */}
          {tab === "signup" && (
            <div>
              {/* Full Name */}
              <label className="font-medium">Full Name</label>
              <div className="relative mt-1 mb-5">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Adebayo Okonkwo"
                />
              </div>

              {/* Email */}
              <label className="font-medium">Email Address</label>
              <div className="relative mt-1 mb-5">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              {/* Business Name */}
              <label className="font-medium">Business Name</label>
              <div className="relative mt-1 mb-5">
                <Building2 className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Business Ltd"
                />
              </div>

              {/* Phone */}
              <label className="font-medium">Phone Number</label>
              <div className="relative mt-1 mb-5">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>

              {/* Password */}
              <label className="font-medium">Password</label>
              <div className="relative mt-1 mb-2">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-gray-500 text-sm mb-4">Must be at least 8 characters</p>

              <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm mb-6">
                <strong>Free Forever Plan:</strong> No credit card required. Start
                managing your business today!
              </div>
              

               <Link href="/beapOneLite">
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg">
                Create Free Account
              </button>
                 </Link>
              <p className="text-center mt-6 text-sm text-gray-500">
                By signing up, you agree to our{" "}
                <span className="text-blue-600">Terms of Service</span> and{" "}
                <span className="text-blue-600">Privacy Policy</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
