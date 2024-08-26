import React from 'react';

const Home = () => {

  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  return (
    <section className="bg-white dark:bg-gray-900 bg-[url('https://archive.techanics.co.ke/techanics/hero-pattern-dark.svg')] dark:bg-[url('https://archive.techanics.co.ke/techanics/hero-pattern-dark.svg')]">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
        <a href="#" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
          <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">📩</span>
          <span className="text-sm font-medium">Bypass Any Text, Anytime, Anywhere</span>
          <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        </a>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Receive SMS & OTP from 900+ Global Services!</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
          Protect your personal information from data breaches and companies who resell your information.
        </p>
        <div className="w-full max-w-md mx-auto">
          <button
            onClick={handleGetStarted}
            className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
