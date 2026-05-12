import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/chat-logo.png";

const FeatureCard = ({ icon, title, desc }) => (
  <div className="text-center p-6">
    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Convo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            <span className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">
              <span className="text-blue-600">Convo</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition px-4 py-2"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Chat{" "}
              <span className="text-blue-600">freely.</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-500 max-w-lg lg:mx-0 mx-auto leading-relaxed">
              Simple, reliable messaging for everyone, everywhere.
              Stay connected with your friends and teams in real-time.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full text-base font-semibold hover:border-blue-600 hover:text-blue-600 transition"
              >
                Log In
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                    A
                  </div>
                  <div className="bg-white/15 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm">
                    Hey! How's it going?
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-blue-400/30 rounded-2xl rounded-tr-none px-4 py-2.5 text-sm max-w-[80%]">
                    All good! Ready to catch up?
                  </div>
                  <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                    Y
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
                    A
                  </div>
                  <div className="bg-white/15 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm">
                    Let's meet at 5?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gray-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Why choose Convo?
              </h2>
              <p className="mt-3 text-gray-500 text-lg">
                Everything you need to stay connected.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title="Real-time Messaging"
                desc="Send and receive messages instantly with real-time WebSocket connections."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title="Group Chats"
                desc="Create groups to stay in touch with friends, family, or your team."
              />
              <FeatureCard
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                title="Private & Secure"
                desc="Your conversations are yours alone. End-to-end encryption keeps them safe."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs sm:text-sm text-gray-400">
          <span>&copy; 2026 Convo. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-600 cursor-pointer transition">Privacy</span>
            <span className="hover:text-gray-600 cursor-pointer transition">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
