import React, { useState } from 'react'
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hook/useAuth"
import registerFashionModel from "../../../assets/register-fashion-model.png";
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Login = () => {
  // Extract handleLogin action, loading state, and error message from useAuth hook
  const { handleLogin, loading, error } = useAuth();
  const navigate = useNavigate();

  // Local state to store username/email and password inputs
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  // Handle updates to input fields dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev,
      [name]: value,
    }));
  };

  // Process form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch login request using useAuth hook
      await handleLogin({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });
      // Redirect to homepage on successful login
      navigate("/");
    } catch (error) {
      // Errors are logged, while Redux hooks manage displaying them in the UI via the error state
      console.error("Login Failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#7e5f21] text-[#201b17]">
      <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        
        {/* Left Section (Branding & Mannequin Image) - Visible on large screens */}
        <section className="relative hidden overflow-hidden bg-[#171412] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            {/* Reuses the fashion mannequin background image from register page */}
            <img
              src={registerFashionModel}
              alt="Premium clothing mannequin"
              className="h-full w-full object-cover object-left"
            />
            {/* Gradients overlaid to create an elegant aesthetic and text contrast */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,12,10,0.22)_0%,rgba(16,14,12,0.72)_48%,rgba(16,14,12,0.94)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(215,178,112,0.24),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.5)_100%)]" />
          </div>

          {/* Clothify Top Brand Mark */}
          <div className="relative z-10 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d7b270]/60 bg-[#d7b270]/15 text-sm font-semibold tracking-[0.18em] text-[#f0d89f]">
              CF
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f0e6d4]">
              CLOTHIFY
            </span>
          </div>

          {/* Central Welcome Text */}
          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.32em] text-[#d7b270]">
              Premium streetwear market
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[#fff8ec] xl:text-6xl">
              Access your fashion identity.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#dfd2bf]">
              Sign in to manage your storefront, browse sharp modern streetwear, or track your orders.
            </p>
          </div>

          {/* Footer Features Info */}
          <div className="relative z-10 grid grid-cols-3 gap-4">
            {['Curated drops', 'Seller ready', 'Secure access'].map((item) => (
              <div key={item} className="border-t border-[#d7b270]/35 pt-4 text-sm font-medium text-[#f6ead8]">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Right Section (Form & Mobile Hero) */}
        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            
            {/* Mobile Header (Hidden on large screens, shows mannequin & text) */}
            <div className="mb-8 lg:hidden">
              <div className="mb-6 h-56 overflow-hidden rounded-[8px] border border-[#ded4c4] bg-[#201b17] shadow-[0_18px_50px_rgba(60,44,28,0.16)]">
                <img
                  src={registerFashionModel}
                  alt="Premium clothing mannequin"
                  className="h-full w-full object-cover object-[30%_34%]"
                />
              </div>
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#201b17] text-xs font-semibold tracking-[0.18em] text-[#f0d89f]">
                  CF
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#4b4238]">
                  CLOTHIFY
                </span>
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-[#201b17]">
                Access your fashion identity.
              </h1>
            </div>

            {/* Login Form Card */}
            <div className="rounded-[8px] border border-[#dec4c9] bg-[#201b17] p-6 shadow-[0_24px_80px_rgba(60,44,28,0.14)] sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b270]">
                  Login
                </p>
                {/* Heading color set to #fff8ec for readable, high contrast text on the dark card background */}
                <h2 className="mt-2 text-3xl font-semibold text-[#fff8ec]">
                  Sign in to your account
                </h2>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username or Email Input Field */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#dfd2bf]">Username or Email</span>
                  <input
                    name="usernameOrEmail"
                    type="text"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    placeholder="you@example.com or username"
                    required
                    className="h-12 w-full rounded-[8px] border border-[#d7b270]/60 bg-[#fff8ec7c] px-4 text-base text-[#000000] outline-none transition focus:border-[#6f7f58] focus:ring-4 focus:ring-[#6f7f58]/15"
                  />
                </label>

                {/* Password Input Field */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#dfd2bf]">Password</span>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="h-12 w-full rounded-[8px] border border-[#d7b270]/60 bg-[#fff8ec7c] px-4 text-base text-[#201b17] outline-none transition focus:border-[#6f7f58] focus:ring-4 focus:ring-[#6f7f58]/15"
                  />
                </label>

                {/* Error Banner - Displayed if Redux auth state contains error */}
                {error && (
                  <p className="rounded-[8px] border border-[#d9998f] bg-[#fff1ef] px-4 py-3 text-sm font-medium text-[#9d3328]">
                    {error}
                  </p>
                )}

                {/* Login Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-[8px] bg-[#ffff] px-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#201b17] transition hover:bg-[#fff8ec] disabled:cursor-not-allowed disabled:bg-[#8d8175]"
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </button>
              </form>

              {/* Toggle to Registration flow */}
              <div className="mt-6 text-center">
                <ContinueWithGoogle/>
                <p className="text-sm text-[#dfd2bf] mt-4">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-[#d7b270] hover:text-[#f0d89f] transition duration-150 ease-in-out">
                    Register here
                  </Link>
                </p>      
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
