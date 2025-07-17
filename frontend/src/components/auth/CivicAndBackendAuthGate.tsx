"use client";

import { useUser, useWallet } from "@civic/auth-web3/react";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

function SimpleAuthForm({ email, name }: { email?: string; name?: string }) {
  const { login, register } = useAuth();
  const { address } = useWallet({ type: "solana" });
  
  const [form, setForm] = useState({
    email: email || "",
    name: name || "",
    address: address || "",
    role: "Creator",
    enterprise: "",
    sector: "",
    telephone: ""
  });

  const [isRegister, setIsRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (address && form.address !== address) {
      setForm((prev) => ({ ...prev, address }));
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    const walletAddress = address || "";
    const password = walletAddress;

    try {
      if (isRegister) {
        await register({ ...form, address: walletAddress, password, role: form.role as "Creator" | "Enterprise" });
        setSuccessMessage("Registration successful! Please log in to continue.");
        setIsRegister(false);
      } else {
        await login({ email: form.email, password });
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      alert("An error occurred. Please check your data and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-background p-4 py-16">
      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 lg:gap-24 items-start">
        <div className="hidden lg:flex justify-center items-start">
          <div className="w-full h-full rounded-2xl flex animate-pulse">
            <img
              src="/img/home/cogumelo.png"
              alt="Illustration"
              className="w-full h-full object-cover rounded-2xl"
              style={{ maxHeight: "700px", height: "100%" }}
            />
          </div>
        </div>

        <div className="flex justify-center items-stretch">
          <div className="w-full max-w-md flex flex-col justify-center h-full">
            <div className="mb-10 text-left">
              <h1 className="text-5xl font-bold text-white">{isRegister ? "Register" : "Login"}</h1>
              <p className="text-lg text-muted-foreground mt-4">
                {isRegister
                  ? "Share your innovation with the world and monetize your skills."
                  : "Welcome back! Enter your email to complete the login."}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {successMessage && (
                <div className="text-center p-3 bg-green-500/10 border border-green-500 text-green-300 rounded-lg">
                  {successMessage}
                </div>
              )}

              {isRegister ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="text-white">Name</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} required className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] p-4 text-white" />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-white">Email</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] p-4 text-white" />
                  </div>
                  <div>
                    <label htmlFor="telephone" className="text-white">Phone</label>
                    <input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} required className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] p-4 text-white" />
                  </div>
                  <div>
                    <label htmlFor="enterprise" className="text-white">Company</label>
                    <input id="enterprise" name="enterprise" value={form.enterprise} onChange={handleChange} required className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] p-4 text-white" />
                  </div>
                  <div>
                    <label htmlFor="sector" className="text-white">Sector</label>
                    <input id="sector" name="sector" value={form.sector} onChange={handleChange} required className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] p-4 text-white" />
                  </div>
                  <div>
                    <label htmlFor="address" className="text-white">Wallet Address</label>
                    <input id="address" name="address" value={form.address} disabled className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] p-4 text-white cursor-not-allowed" />
                  </div>
                  <div>
                    <label htmlFor="role" className="text-white">Role</label>
                    <select id="role" name="role" value={form.role} onChange={handleChange} required className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] px-3 text-white">
                      <option value="Creator">Creator</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="email" className="text-white">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full !bg-[#1E1E1E] border-zinc-700 mt-2 h-14 rounded-[20px] p-4 text-white" />
                  <p className="text-sm text-zinc-400 mt-2">Your wallet is used for secure login.</p>
                </div>
              )}
              
              <div className="pt-6 flex items-center justify-center">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-auto h-14 text-lg text-white rounded-[20px] flex items-center justify-center bg-blue-600 font-bold px-12 hover:bg-blue-700 disabled:bg-blue-900 disabled:text-zinc-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : (isRegister ? 'Create Account' : 'Login')}
                </button>
              </div>
              <div className="flex items-center justify-center mt-4">
                <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-blue-400 hover:text-blue-300 underline">
                  {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CivicAndBackendAuthGate({ children }: { children: React.ReactNode }) {
  const { user: civicUser } = useUser();
  const { user } = useAuth();

  if (!civicUser) {
    return <div className="text-center mt-20 text-white">Please log in with Civic to continue.</div>;
  }

  if (!user) {
    return <SimpleAuthForm email={civicUser.email} name={civicUser.name} />;
  }

  return <>{children}</>;
}
