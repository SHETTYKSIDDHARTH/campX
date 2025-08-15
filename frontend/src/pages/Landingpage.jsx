import React from 'react'
import { useState } from "react";
import { ArrowRight, Users, Calendar, Shield, MapPin, Search, ChevronRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router";
export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  let navigate = useNavigate();

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  

  const features = [
    {
      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Ride Sharing",
      description: "Book or offer rides in seconds. One seat, one booking — no confusion.",
      detail: "Save money, reduce carbon footprint, and connect with fellow students safely and easily."
    },
    {
      icon: <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Event Management", 
      description: "Discover upcoming campus events or host your own as a chairman or admin.",
      detail: "Never miss a moment — discover and register for upcoming events, or create your own."
    },
    {
      icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Lost & Found",
      description: "Post items you've found or lost and reconnect with their owners.",
      detail: "Lost something? Found something? Reconnect with the rightful owner fast."
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Admin Dashboard",
      description: "Full control over users, content, and platform safety.",
      detail: "Comprehensive management tools for maintaining a safe campus community."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up & Verify",
      description: "Choose your role: Student, Chairman, or Admin."
    },
    {
      number: "02", 
      title: "Explore",
      description: "Book rides, join events, post lost/found items, or manage your club."
    },
    {
      number: "03",
      title: "Engage", 
      description: "Connect with your campus community every day."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Responsive Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="text-xl sm:text-2xl font-bold text-white tracking-wide hover:cursor-pointer" onClick={()=>{navigate('/')}}>
              campX
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => smoothScrollTo('features')}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </button>
              <button 
                onClick={() => smoothScrollTo('how-it-works')}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                How It Works
              </button>
            </div>

            {/* Desktop Login Buttons */}
            <div className="hidden lg:flex space-x-2 xl:space-x-3">
              <button className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-white transition-colors" onClick={() => navigate('/student-login')}>
                Student Login
              </button>
              <button className="px-3 xl:px-4 py-2 text-sm text-white/90 hover:text-blue-600 transition-colors duration-500" onClick={() => navigate('/Club-login')}>
                Club Login  
              </button>
              <button className="px-3 xl:px-4 py-2 text-sm  text-white rounded-lg transition-all" onClick={() => navigate('/Admin-login')}>
                Admin Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-white transition-colors p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/20 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}>
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => smoothScrollTo('features')}
                className="block w-full text-left text-white/80 hover:text-white transition-colors py-2"
              >
                Features
              </button>
              <button 
                onClick={() => smoothScrollTo('how-it-works')}
                className="block w-full text-left text-white/80 hover:text-white transition-colors py-2"
              >
                How It Works
              </button>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <button className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors"onClick={() => navigate('/student-login')}>
                  Student Login
                </button>
                <button className="block w-full text-left px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors"onClick={() => navigate('/Club-login')}>
                  Club Login
                </button>
                <button className="block w-full text-left px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"onClick={() => navigate('/Admin-login')}>
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                One Platform.
                <br />
                <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Every Campus Connection.
                </span>
              </h1>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              From sharing rides to managing clubs, finding events, and even reuniting lost items — 
              everything your campus community needs, all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
              <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 hover:bg-blue-800 text-white text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-700/25" onClick={() => navigate('/student-login')}>
                Get Started
                <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => smoothScrollTo('features')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg font-semibold rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              All-in-One Campus Life Platform
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
              Everything you need to enhance your campus experience in one seamless platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`group p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-white/15 border-2 border-blue-700/50 shadow-2xl'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                      activeFeature === index ? 'bg-blue-700' : 'bg-white/10'
                    } transition-colors`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-blue-500 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">
                        {feature.description}
                      </p>
                      <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 mt-2 text-blue-500 transition-transform ${
                        activeFeature === index ? 'translate-x-1' : ''
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Display */}
            <div className="lg:pl-8 mt-8 lg:mt-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="text-center">
                    <div className="inline-flex p-3 sm:p-4 bg-blue-700/20 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                      <div className="text-blue-300">
                        {features[activeFeature].icon}
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      {features[activeFeature].title}
                    </h3>
                    <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                      {features[activeFeature].detail}
                    </p>
                  </div>
                </div>
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 sm:w-20 h-12 sm:h-20 bg-blue-700/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-10 sm:w-16 h-10 sm:h-16 bg-blue-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Simple, Secure, Student-Friendly
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
              Get started in just three easy steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-700 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 text-white font-bold text-lg sm:text-xl">
                      {step.number}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to Transform Your Campus Experience?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of students already using campX to make campus life easier, safer, and more connected.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 hover:bg-blue-800 text-white text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Student Login
                </button>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg font-semibold rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all">
                  Club Login
                </button>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-amber-500/90 hover:bg-amber-500 text-white text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">campX</div>
          <p className="text-sm sm:text-base text-white/60">
            Connecting campus communities, one platform at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}