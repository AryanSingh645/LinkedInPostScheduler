import React, { useState } from 'react';
import { Linkedin, Sun, Moon } from 'lucide-react';
import axios from 'axios';
function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleLinkedInLogin = async() => {
    setIsLoading(true);
    try {
      const response = await axios.get('/auth/linkedin/getAuthorizationCode');
      console.log(response);
      if (!response.data.success) {
        console.error("Error in getting authorization code");
        return;
      }
      const redirectUrl = response.data.redirectUrl;
      window.location.href = redirectUrl;

    } catch (error) {
      console.error("Error in getting authorization code");
      return;
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'} flex items-center justify-center p-4 transition-colors duration-300`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 left-4 p-3 rounded-full cursor-pointer ${
          isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100'
        } shadow-lg transition-all duration-300`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className={`${
          isDark ? 'bg-gray-800 shadow-2xl' : 'bg-white shadow-xl'
        } rounded-2xl p-8 space-y-8 transition-colors duration-300`}>
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Welcome Back</h1>
            <p className={`${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Sign in to continue to your account</p>
          </div>

          {/* Login Image */}
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800"
              alt="Workspace"
              className="rounded-lg h-48 w-full object-cover"
            />
          </div>

          {/* LinkedIn Button */}
          <button
            onClick={handleLinkedInLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#0077B5] hover:bg-[#006399] text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
          >
            {isLoading ? <></> : <Linkedin className="w-5 h-5" />}
            Continue with LinkedIn

            
          </button>

          {/* Footer */}
          <div className={`text-center text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-[#0077B5] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#0077B5] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;