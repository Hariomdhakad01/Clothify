import React, { useState } from 'react'
import { useNavigate, Link } from "react-router";
import {useAuth} from "../hook/useAuth"
import registerFashionModel from "../../../assets/register-fashion-model.png";
import ContinueWithGoogle from '../components/ContinueWithGoogle';



const Register = () => {
  // Extract handleRegister action, loading state, and error message from useAuth hook
  const { handleRegister, loading, error } = useAuth();
  const navigate = useNavigate();

  // Local state to store user details for registration
  const [formData, setFormData] = useState({
    username: '',
    contact: '',
    email: '',
    password: '',
    isSeller: false
  });

  // Handle inputs dynamically (including checkboxes for seller status)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Process registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch registration request via auth hook
      await handleRegister({
        email: formData.email,
        contact: formData.contact,
        username: formData.username,
        password: formData.password,
        isSeller: formData.isSeller
      });
      // Redirect to homepage on successful registration
      navigate("/login");
    } catch (error) {
      // Errors are caught here for logging; UI renders them using hook state
      console.error("Registration Failed", error);
    }
  };


  return (
    <div className="min-h-screen bg-[#7e5f21] text-[#201b17]">
      <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#171412] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            <img
              src={registerFashionModel}
              alt="Premium clothing mannequin"
              className="h-full w-full object-cover object-left"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,12,10,0.22)_0%,rgba(16,14,12,0.72)_48%,rgba(16,14,12,0.94)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(215,178,112,0.24),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.5)_100%)]" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d7b270]/60 bg-[#d7b270]/15 text-sm font-semibold tracking-[0.18em] text-[#f0d89f]">
              CF
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f0e6d4]">
              CLOTHIFY
            </span>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.32em] text-[#d7b270]">
              Premium streetwear market
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[#fff8ec] xl:text-6xl">
              Create your fashion identity.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#dfd2bf]">
              Join as a buyer or seller and bring sharp, modern clothing to a storefront built for taste.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {['Curated drops', 'Seller ready', 'Secure access'].map((item) => (
              <div key={item} className="border-t border-[#d7b270]/35 pt-4 text-sm font-medium text-[#f6ead8]">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
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
                Create your fashion identity.
              </h1>
            </div>

            <div className="rounded-[8px] border border-[#dec4c9] bg-[#201b17] p-6 shadow-[0_24px_80px_rgba(60,44,28,0.14)] sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d7b270]">
                  Register
                </p>
                {/* Changed heading text color to #fff8ec for high contrast readability against the dark card background */}
                <h2 className="mt-2 text-3xl font-semibold text-[#fff8ec]">
                  Open your account
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#dfd2bf]">Contact number</span>
                  <input
                    name="contact"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                    className="h-12 w-full rounded-[8px] border border-[#d7b270]/60 bg-[#fff8ec76] px-4 text-base text-[#000000] outline-none transition focus:border-[#6f7f58] focus:ring-4 focus:ring-[#6f7f58]/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#dfd2bf]">Username</span>
                  <input
                    name="username"
                    type="text"
                    minLength="3"
                    maxLength="15"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="example_style"
                    required
                    className="h-12 w-full rounded-[8px] border border-[#d7b270]/60 bg-[#fff8ec7c] px-4 text-base text-[#000000] outline-none transition focus:border-[#6f7f58] focus:ring-4 focus:ring-[#6f7f58]/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#dfd2bf]">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-[8px] border border-[#d7b270]/60 bg-[#fff8ec7c] px-4 text-base text-[#000000] outline-none transition focus:border-[#6f7f58] focus:ring-4 focus:ring-[#6f7f58]/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#dfd2bf]">Password</span>
                  <input
                    name="password"
                    type="password"
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Example@123"
                    required
                    className="h-12 w-full rounded-[8px] border border-[#d7b270]/60 bg-[#fff8ec7c] px-4 text-base text-[#201b17] outline-none transition focus:border-[#6f7f58] focus:ring-4 focus:ring-[#6f7f58]/15"
                  />
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-[8px] border border-[#d7b270]/60 bg-[#f7efe3f6] p-4">
                  <input
                    name="isSeller"
                    type="checkbox"
                    checked={formData.isSeller}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 rounded border-[#a89573] accent-[#6f7f58]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#2c261f]">Register as seller</span>
                    <span className="mt-1 block text-sm leading-6 text-[#75685a]">
                      Enable this if you want to list and sell clothing on Clothify.
                    </span>
                  </span>
                </label>

                {error && (
                  <p className="rounded-[8px] border border-[#d9998f] bg-[#fff1ef] px-4 py-3 text-sm font-medium text-[#9d3328]">
                    {error}
                  </p>
                )}

                {/* {success && (
                  <p className="rounded-[8px] border border-[#9fbd8b] bg-[#f2faec] px-4 py-3 text-sm font-medium text-[#3f6a34]">
                    {success}
                  </p>
                )} */}

                {/* Submit button for creating an account */}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-[8px] bg-[#ffff] px-5  text-sm font-semibold uppercase tracking-[0.16em] text-[#201b17] transition hover:bg-[#fff8ec] disabled:cursor-not-allowed disabled:bg-[#8d8175]"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              

              {/* Navigation Link to toggle to the Login page */}
              <div className="mt-6 text-center">
                <ContinueWithGoogle/>
                <p className="text-sm text-[#dfd2bf] mt-5">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-[#d7b270] hover:text-[#f0d89f] transition duration-150 ease-in-out">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Register
