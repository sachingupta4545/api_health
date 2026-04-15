import React from "react";
import { ArrowRight, Activity, Zap, BarChart3, Bell, Globe, Plus, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Home() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20 pt-6 sm:pt-0">
      <Helmet>
        <title>API Health Check - Monitor Your APIs in Real Time</title>
        <meta name="description" content="Instant alerts, uptime tracking, and performance monitoring for all your APIs in one dashboard." />
      </Helmet>
      {/* 1. Hero Section */}
      <section className="px-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5 text-gray-900" />
            <span className="text-xs font-medium text-gray-900">Real-time API monitoring</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0F172A] leading-tight mb-6">
            Monitor Your APIs <br />
            <span className="text-sky-500">in Real Time</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
            Instant alerts, uptime tracking, and performance monitoring for all your APIs in one dashboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-md active:scale-95"
            >
              Start Monitoring
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 px-8 py-4 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Hero Illustration (Status Card) */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-gray-900">Live Status</h3>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Updated 12s ago</span>
            </div>
            <div className="space-y-4">
              {[
                { name: "Auth API", time: "45ms", status: "UP" },
                { name: "Payment API", time: "-", status: "DOWN" },
                { name: "Search API", time: "128ms", status: "UP" },
                { name: "Users API", time: "32ms", status: "UP" },
              ].map((api, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:border-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${api.status === "UP" ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
                    <span className="text-sm font-medium text-gray-700">{api.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 font-mono">{api.time}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${api.status === "UP" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                      {api.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 inline-block">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to stay on top</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Built for developers and DevOps teams who need reliable, real-time visibility into API health.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Real-time API Monitoring", desc: "Continuously monitor your endpoints with configurable check intervals from 30 seconds to 5 minutes.", icon: Activity },
              { title: "Instant Downtime Alerts", desc: "Get notified via Email, Slack, or Discord the moment an API goes down.", icon: Bell },
              { title: "Response Time Tracking", desc: "Track p50, p95, and p99 response times with detailed historical charts.", icon: BarChart3 },
              { title: "Team Status Dashboard", desc: "Share a public status page with your users and keep your team informed.", icon: Globe },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center mb-6 transition-colors group-hover:bg-sky-500 text-sky-500 group-hover:text-white">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 inline-block">How it works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Up and running in 3 steps</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { step: "Step 1", title: "Add your API endpoint", desc: "Enter the URL, method, and check interval. Done in seconds.", icon: <Plus className="w-6 h-6 text-sky-500" /> },
            { step: "Step 2", title: "Monitor uptime automatically", desc: "We check your endpoints around the clock and log every response.", icon: <Clock className="w-6 h-6 text-sky-500" /> },
            { step: "Step 3", title: "Get alerts when something breaks", desc: "Receive instant notifications through your preferred channel.", icon: <Bell className="w-6 h-6 text-sky-500" /> },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-2">{item.step}</span>
              <h4 className="text-lg font-bold text-center text-gray-900 mb-3">{item.title}</h4>
              <p className="text-sm text-gray-500 max-w-[250px] mx-auto leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Dashboard Preview Section */}
      <section className="bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 inline-block">Dashboard</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">A dashboard built for clarity</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              See every endpoint at a glance — status, response time, and uptime all in one place.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-8 max-w-5xl mx-auto overflow-x-auto">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-[1.5px] border-sky-500 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-sky-500 rounded-full" />
                </div>
                <h3 className="font-bold text-gray-900">API Health Overview</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  5 healthy
                </div>
                <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded">
                  <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                  1 down
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: "Auth API", uptime: "99.98%", time: "45ms", status: "UP" },
                { name: "Payment API", uptime: "97.2%", time: "-", status: "DOWN" },
                { name: "Search API", uptime: "99.95%", time: "128ms", status: "UP" },
                { name: "Users API", uptime: "100%", time: "32ms", status: "UP" },
                { name: "Orders API", uptime: "99.99%", time: "89ms", status: "UP" },
                { name: "Notifications API", uptime: "99.90%", time: "55ms", status: "UP" },
              ].map((api, i) => (
                <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50/30 rounded-xl hover:bg-gray-50 transition-colors min-w-[480px]">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${api.status === "UP" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span className="text-sm font-semibold text-gray-800">{api.name}</span>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-8 w-40 justify-end">
                      <span className="text-[11px] font-medium text-gray-400">{api.uptime}</span>
                      <span className="text-[11px] font-medium text-gray-400 w-12 text-right">{api.time}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded ${api.status === "UP" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                      {api.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA Section */}
      <section className="px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Start Monitoring Your APIs Today</h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
          Free to get started. No credit card required. Set up your first monitor in under a minute.
        </p>
        <Link
          to="/get-started"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-10 py-5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-lg"
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}

export default Home;
