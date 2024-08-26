import React, { useState, useEffect } from 'react';
import axios from "axios"
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL="https://861d-105-163-0-76.ngrok-free.app/users/login";
const secretKey = process.env.REACT_APP_SECRET_KEY;


const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    

    try {
        const loginData = {
            username: email,
            password: password
        };
    
        const dataStr = JSON.stringify(loginData);
        const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(secretKey), {
            iv: CryptoJS.enc.Hex.parse(iv),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
            }).toString();
    
        const payload = {
            iv: iv,
            ciphertext: encryptedData
            };
        const response = await axios.post(LOGIN_URL, payload);

        if (response.data.success) {
            const decodedToken = jwtDecode(response.data.accessToken);
            const userDetails = {
            id: decodedToken.id,
            username: decodedToken.username
             };
            localStorage.setItem("userData", JSON.stringify(userDetails));
            localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
            setLoggedIn(true);
            navigate('/account');
        } else {
            setError(response.data.message);
            setTimeout(() => setError(""),5000);
            return;
        }
    } catch (error) {
        if (error.response) {
            setError(`Error: ${error.response.data.message}`);
        } else if (error.request) {
            setError('Network error: Please try again later.');
        } else {
            setError(`Error: ${error.message}`);
        }
        setTimeout(() => setError(""), 5000);
    } finally {
        setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="bg-white dark:bg-gray-900 bg-[url('https://archive.techanics.co.ke/techanics/hero-pattern-dark.svg')] dark:bg-[url('https://archive.techanics.co.ke/techanics/hero-pattern-dark.svg')]">
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 dark:bg-opacity-50 dark:border-opacity-30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign In</h5>
            
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.293-4.293a2 2 0 112.586-2.586 2 2 0 01-2.586 2.586z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM3 10a7 7 0 1114 0 7 7 0 01-14 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  />
                </div>
                <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
              </div>
              <a href="#" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login to your account'}
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
