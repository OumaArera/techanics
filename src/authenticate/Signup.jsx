import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import CryptoJS from 'crypto-js';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const secretKey = process.env.REACT_APP_SECRET_KEY;
const SIGNUP_URL="https://861d-105-163-0-76.ngrok-free.app/users/signup";

const Signup = ({ setLoggedIn }) => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  


  // Handle CAPTCHA change
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (!captchaToken) {
        setError('Please complete the CAPTCHA');
        setTimeout(() => setError(""), 5000);
        return;
    }
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        setTimeout(() => setError(""), 5000);
        return;
    }
    try {
        const dataToEncrypt = {
            username: email,
            password: password,
            referredBy: referredBy? referredBy : null
        };
      
        const dataStr = JSON.stringify(dataToEncrypt);
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
    
        const response = await axios.post(SIGNUP_URL, payload);
    
        if(response.data.success){
            setSucess("Account created successfully");
            setTimeout(()=>setSucess(""),5000);
            const decodedToken = jwtDecode(response.data.accessToken);
            const userDetails = {
            id: decodedToken.id,
            username: decodedToken.username
             };

            localStorage.setItem("userData", JSON.stringify(userDetails));
            localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
            setLoggedIn(true);
            navigate('/account');
        }else{
            setError(response.data.message);
            setTimeout(() => setError(""),5000);
            return;
        };
    } catch (error) {
        if (error.response) {
            setError(`Error: ${error.response.data.message}`);
        } else if (error.request) {
            setError('Network error: Please try again later.');
        } else {
            setError(`Error: ${error.message}`);
        }
        setTimeout(() => setError(""), 5000);
    }finally{
        setLoading(false);
    }
  
  };

  return (
    <section className="bg-white dark:bg-gray-900 bg-[url('https://archive.techanics.co.ke/techanics/hero-pattern-dark.svg')] dark:bg-[url('https://archive.techanics.co.ke/techanics/hero-pattern-dark.svg')]">
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 dark:bg-opacity-50 dark:border-opacity-30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">You Are New Here, Sign Up ✍️</h5>
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
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
                <label htmlFor="referredBy" className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'> Referred By</label>
                <input 
                type="email" 
                name='referredBy'
                id='referredBy'
                placeholder='name@company.com'
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                value={referredBy}
                onChange={e => setReferredBy(e.target.value)}
                />
            </div>
            <ReCAPTCHA
              className='g-recaptcha'
              sitekey="6LeO4BAqAAAAABrVC6ncXeuXE_0I6U7eiHOm5B4L"
              onChange={handleCaptchaChange}
            />
            {error && (
                <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
            )}
            {sucess && (
                <div className="text-green-600 mt-2 text-sm text-center">{sucess}</div>
            )}
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Create account
            </button>
            
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Already registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Login</a>
            </div>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-800"></div>
                </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
