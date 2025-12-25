import React, { useState } from 'react';

const InstagramLogin = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#1C2A33] text-white flex flex-col items-center justify-between font-sans selection:bg-gray-800">
      
      {/* Top Language Selector */}
      <div className="mt-4 text-xs text-gray-400">
        English (UK)
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-[400px] px-4 flex flex-col items-center flex-grow justify-center -mt-10">
        
        {/* Instagram Logo */}
        <div className="mb-12">
          <img src="/src/assets/instlogo.png" alt="Instagram" className="w-24 h-24 object-contain" />
        </div>

        {/* Login Form */}
        <form className="w-full space-y-3">
          <input
            type="text"
            name="identifier"
            placeholder="Username, email address or mobile number"
            className="w-full bg-[#1C2A33] border border-[#3C4D57] rounded-md p-3.5 text-sm text-[#83919C] placeholder-gray-500 placeholder:font-semibold focus:outline-none focus:border-[#2e5a8a] transition"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-[#1C2A33] border border-[#3C4D57] rounded-md p-3.5 text-sm text-[#83919C] placeholder-gray-500 placeholder:font-semibold focus:outline-none focus:border-[#2e5a8a] transition"
            onChange={handleChange}
          />
          
          <button
            type="submit"
            className="w-full bg-[#0064E0] hover:bg-[#0095f6] text-white font-semibold py-3 rounded-full text-sm mt-2 transition duration-200"
          >
            Log in
          </button>
        </form>

        {/* Forgotten Password */}
        <div className="mt-6 text-sm text-gray-300 hover:text-white cursor-pointer transition">
          Forgotten password?
        </div>

      </div>

      {/* Footer Section */}
      <div className="w-full max-w-[400px] px-4 mb-6 flex flex-col items-center space-y-6">
        
        {/* Create New Account Button */}
        <button className="w-full border-2 border-[#284B72] text-[#4787BA] font-bold py-2.5 rounded-full text-sm hover:bg-[#0d2137] transition duration-300">
          Create new account
        </button>

        {/* Meta Logo */}
        <div className="flex items-center text-gray-400">
          <img src="/src/assets/metalogo.png" alt="Meta" className="h-3 object-contain" />
        </div>
      </div>
      
    </div>
  );
};

export default InstagramLogin;