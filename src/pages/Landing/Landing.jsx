import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/chat-logo.png";
import chatPreview from "../../assets/images/chat-window-preview.png";
import dashboardPreview from "../../assets/images/dashboard-preview.png";

const FeatureCard = ({ icon, title, desc, index }) => (
  <div
    className="group relative p-8 rounded-3xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/90"
    style={{ animationDelay: `${index * 150}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-blob-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-float" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="relative">
              <img src={logo} alt="Convo" className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/30 transition-all duration-300" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Convo</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition px-5 py-2.5 rounded-full hover:bg-gray-50"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Real-time messaging app
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              Chat{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">freely.</span>
              <br />
              Connect{" "}
              <span className="text-gray-800">instantly.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-lg lg:mx-0 mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
              Simple, reliable messaging for everyone, everywhere.
              Stay connected with your friends and teams in real-time.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
              <button
                onClick={() => navigate("/signup")}
                className="group relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-3.5 rounded-full text-base font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-0.5 animate-pulse-glow"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 px-10 py-3.5 rounded-full text-base font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50/50"
              >
                Log In
              </button>
            </div>
          </div>

          {/* Hero Image - Chat Window Screenshot */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none z-10 animate-fade-in-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            <div className="relative group animate-float">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200/50 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-gray-400 font-medium">Convo Chat</span>
                </div>
                <img
                  src={chatPreview}
                  alt="Chat interface preview"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 m-0.5 rounded-lg">
                  <div className="text-center text-white p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">Chat Preview</p>
                    <p className="text-sm text-white/70 mt-1">Add chat-window-preview.png</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative border-t border-gray-100 bg-gray-50/30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center mb-16 animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">Why Convo?</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">stay connected</span>
              </h2>
              <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
                Powerful features designed for seamless communication.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard
                index={0}
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title="Real-time Messaging"
                desc="Send and receive messages instantly with real-time WebSocket connections. No delays, no refreshes."
              />
              <FeatureCard
                index={1}
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title="Group Chats"
                desc="Create groups to stay in touch with friends, family, or your team. Share moments and ideas together."
              />
              <FeatureCard
                index={2}
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                title="Private & Secure"
                desc="Your conversations are yours alone. End-to-end encryption keeps your messages safe and private."
              />
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold mb-4">Dashboard</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Your control center,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">at a glance.</span>
              </h2>
              <p className="text-lg text-gray-500 mb-8 max-w-lg">
                Track your message activity, manage conversations, view statistics, and stay on top of unread messages — all from one beautiful dashboard.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Real-time message and chat statistics" },
                  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", text: "Weekly & monthly activity trends with charts" },
                  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", text: "Recent chats and quick actions at your fingertips" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-gray-600">{item.text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-full text-base font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore Dashboard
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Dashboard Screenshot */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none z-10">
              <div className="relative group animate-float-delayed">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200/50 overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-gray-400 font-medium">Convo Dashboard</span>
                  </div>
                  <img
                    src={dashboardPreview}
                    alt="Dashboard preview"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 m-0.5 rounded-lg">
                    <div className="text-center text-white p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold">Dashboard Preview</p>
                      <p className="text-sm text-white/70 mt-1">Add dashboard-preview.png</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative border-t border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 lg:p-16 text-center text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                  Ready to start chatting?
                </h2>
                <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-lg mx-auto">
                  Join thousands of users who already enjoy seamless, real-time conversations.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate("/signup")}
                    className="bg-white text-blue-600 px-10 py-3.5 rounded-full text-base font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    Get Started Free
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="border-2 border-white/30 text-white px-10 py-3.5 rounded-full text-base font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Convo" className="w-6 h-6 object-contain" />
            <span className="font-semibold text-gray-600">Convo</span>
            <span className="mx-2">•</span>
            <span>&copy; 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-600 cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-gray-600 cursor-pointer transition">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
