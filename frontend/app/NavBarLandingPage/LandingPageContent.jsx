"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Dumbbell,
  Target,
  TrendingUp,
  Star,
  Calendar,
  Award,
  Heart,
  Zap,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function LandingPageContent() {
  const router = useRouter();

  const features = [
    {
      icon: Users,
      title: "Member Management",
      description:
        "Comprehensive member tracking with detailed profiles and progress monitoring.",
    },
    {
      icon: Calendar,
      title: "Class Scheduling",
      description:
        "Easy booking system for fitness classes and personal training sessions.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor fitness goals and achievements with detailed analytics.",
    },
    {
      icon: Award,
      title: "Membership Plans",
      description: "Flexible membership options to suit every fitness journey.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content:
        "This gym management system has transformed how I track my fitness journey. The interface is intuitive and the features are exactly what I needed.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer",
      content:
        "As a trainer, this platform helps me manage all my clients efficiently. The member management features are outstanding.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Gym Owner",
      content:
        "Running my gym has never been easier. The comprehensive dashboard gives me insights I never had before.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Members" },
    { number: "500+", label: "Gyms Connected" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-16 px-4">
        <div className="absolute inset-0 hero-background" />
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hero-text flex flex-col gap-8 text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent">
                {" "}
                Fitness Journey
              </span>
              <br />
              With Smart Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              The ultimate gym management system designed for modern fitness
              enthusiasts. Track progress, manage memberships, and achieve your
              goals with our comprehensive platform.
            </p>

            <div className="hero-actions flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/LoginAndReg/Register"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 text-lg font-bold"
              >
                <Zap className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link
                href="/Admin/GymAdmin/memberManagement"
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 text-lg font-bold"
              >
                <Users className="w-5 h-5" />
                View Demo
              </Link>
            </div>

            <div className="hero-stats grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-item text-center animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl font-extrabold text-green-500">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual flex justify-center items-center">
            <div className="hero-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-2xl backdrop-blur-md w-full max-w-md animate-slide-in">
              <div className="card-header flex items-center gap-4 mb-6">
                <div className="card-icon w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Member Dashboard
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time fitness tracking
                  </p>
                </div>
              </div>
              <div className="card-content">
                <div className="progress-item flex items-center gap-4 mb-4">
                  <span className="font-medium text-gray-900 dark:text-white text-sm min-w-[80px]">
                    Weekly Goal
                  </span>
                  <div className="progress-bar flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="progress-fill h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <span className="font-semibold text-green-500 text-sm min-w-[40px] text-right">
                    75%
                  </span>
                </div>
                <div className="progress-item flex items-center gap-4">
                  <span className="font-medium text-gray-900 dark:text-white text-sm min-w-[80px]">
                    Monthly Target
                  </span>
                  <div className="progress-bar flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="progress-fill h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <span className="font-semibold text-green-500 text-sm min-w-[40px] text-right">
                    60%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-4 leading-relaxed">
              Everything you need to manage your fitness journey in one
              comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center transition-transform hover:-translate-y-2 hover:shadow-xl hover:border-green-500 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="feature-icon w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-4 leading-relaxed">
              Join thousands of satisfied users who have transformed their
              fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-xl hover:border-green-500 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="testimonial-rating flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg text-gray-900 dark:text-white italic leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="testimonial-author flex items-center gap-4">
                  <div className="author-avatar w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center font-bold text-white text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="author-name font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="author-role text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 cta-background" />

        <div className="relative container mx-auto max-w-2xl">
          <div className="cta-text">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Fitness Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join thousands of users who have already transformed their fitness
              experience with our platform.
            </p>
          </div>

          <div className="cta-actions flex flex-col md:flex-row gap-4 justify-center mb-8">
            <Link
              href="/LoginAndReg/Register"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 text-lg font-bold transition-colors duration-200"
            >
              <Heart className="w-5 h-5" />
              Start Free Trial
            </Link>
            <Link
              href="/LoginAndReg/Login"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-lg font-bold transition-colors duration-200"
            >
              <Shield className="w-5 h-5" />
              Sign In
            </Link>
          </div>

          <div className="cta-features flex flex-col md:flex-row gap-4 justify-center">
            <div className="cta-feature flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="cta-feature flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="cta-feature flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="footer-brand flex flex-col gap-4">
            <div className="footer-logo flex items-center gap-4">
              <Users className="w-10 h-10 text-green-500" />
              <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                GYM <span className="text-green-500">bro's</span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Empowering fitness journeys with smart management solutions.
            </p>
          </div>

          <div className="footer-links grid grid-cols-1 md:grid-cols-3 gap-8 col-span-2">
            <div className="footer-section">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Product</h4>
              <Link
                href="/features"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 mb-2 transition-colors duration-200"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 mb-2 transition-colors duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/Admin/GymAdmin/memberManagement"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                Demo
              </Link>
            </div>
            <div className="footer-section">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Company</h4>
              <Link
                href="/about"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 mb-2 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 mb-2 transition-colors duration-200"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
            <div className="footer-section">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Support</h4>
              <Link
                href="/help"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 mb-2 transition-colors duration-200"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 mb-2 transition-colors duration-200"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="block text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom container mx-auto mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 GYM bro's. All rights reserved.</p>
          <div className="footer-bottom-links flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-green-500 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-green-500 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
