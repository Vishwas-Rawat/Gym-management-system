"use client";
import { useEffect, useState } from "react";
import { MdOutlineVerified } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaDumbbell } from "react-icons/fa";
import { BiSolidUser } from "react-icons/bi";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../Context/page"; // Adjust path if needed

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    function syncFilled() {
      document.querySelectorAll(".md-field").forEach((field) => {
        const input = field.querySelector(".md-input");
        if (!input) return;
        let isFilled = false;
        if (input.tagName === "SELECT") {
          isFilled = input.value !== "";
        } else if (input.type === "date") {
          isFilled = input.value !== "";
        } else {
          isFilled = input.value.trim().length > 0;
        }
        field.classList.toggle("filled", isFilled);
      });
    }

    const handleInput = (e) => {
      if (e.target.classList.contains("md-input")) {
        const field = e.target.parentElement;
        let isFilled = false;
        if (e.target.tagName === "SELECT") {
          isFilled = e.target.value !== "";
        } else if (e.target.type === "date") {
          isFilled = e.target.value !== "";
        } else {
          isFilled = e.target.value.trim().length > 0;
        }
        field.classList.toggle("filled", isFilled);
      }
    };

    const handleLoad = syncFilled;
    const handleChange = syncFilled;

    const handleClick = (e) => {
      const btn = e.target.closest(".md-btn");
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
    };

    document.addEventListener("input", handleInput);
    window.addEventListener("load", handleLoad);
    window.addEventListener("change", handleChange);
    document.addEventListener("click", handleClick);

    const signedInModal = document.getElementById("signedInModal");
    const closeModal = document.getElementById("closeModal");

    const handleCloseModal = () => signedInModal.classList.add("hidden");
    const handleModalClick = (e) => {
      if (e.target.id === "signedInModal") signedInModal.classList.add("hidden");
    };

    if (closeModal && signedInModal) {
      closeModal.addEventListener("click", handleCloseModal);
      signedInModal.addEventListener("click", handleModalClick);
    }

    return () => {
      document.removeEventListener("input", handleInput);
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("change", handleChange);
      document.removeEventListener("click", handleClick);
      if (closeModal && signedInModal) {
        closeModal.removeEventListener("click", handleCloseModal);
        signedInModal.removeEventListener("click", handleModalClick);
      }
    };
  }, [router, login]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signinForm = e.target;
    const idField = signinForm.querySelector('[name="email"]')?.parentElement;
    const codeField = signinForm.querySelector('[name="password"]')?.parentElement;
    const emailValue = signinForm.elements["email"]?.value.trim() || "";
    const passwordValue = signinForm.elements["password"]?.value.trim() || "";

    setErrorMessage("");
    let hasError = false;

    const minLen = (v, n) => v.trim().length >= n;

    if (idField) idField.classList.toggle("error", !emailValue || !emailValue.includes("@"));
    if (codeField) codeField.classList.toggle("error", !minLen(passwordValue, 6));

    if (!emailValue || !emailValue.includes("@")) {
      setErrorMessage("Invalid email format");
      hasError = true;
    }
    if (!minLen(passwordValue, 6)) {
      setErrorMessage("Password must be at least 6 characters");
      hasError = true;
    }
    if (hasError) return;

    try {
      const response = await fetch("http://localhost:8083/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (data.message === "Login successful") {
        // Check if this is an admin email (temporary for testing)
        const isAdminEmail = emailValue.includes("admin") || emailValue.includes("Admin");
        
        const userData = {
          userId: data.userId || "default-user-id",
          email: emailValue,
          token: data.token || "default-token",
          role: data.role || (isAdminEmail ? "ADMIN" : "USER"), // Include role from response or determine from email
        };
        console.log("User data being stored:", userData); // Debug log
        login(userData);
        setIsLoggedIn(true);
        const loginError = document.getElementById("loginError");
        const signinSuccess = document.getElementById("signinSuccess");
        const signedInModal = document.getElementById("signedInModal");
        if (loginError) loginError.classList.add("hidden");
        if (signinSuccess) signinSuccess.classList.remove("hidden");
        setTimeout(() => {
          if (signinSuccess) signinSuccess.classList.add("hidden");
          if (signedInModal) signedInModal.classList.remove("hidden");
          // Redirect to dashboard (role-based routing will be handled in dashboard component)
          router.push("/dashboard");
        }, 700);
      } else {
        setErrorMessage(data.message);
        const loginError = document.getElementById("loginError");
        if (loginError) loginError.classList.remove("hidden");
      }
    } catch (err) {
      setErrorMessage("Connection timed out. Please try again later.");
      const loginError = document.getElementById("loginError");
      if (loginError) loginError.classList.remove("hidden");
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gym Manager (Dark Theme)</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </Head>
      <div className="auth-page min-h-screen font-sans bg-gradient-to-br from-[#0b1220] to-[#111827] to-[#0f172a] text-[#e5e7eb] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[rgba(24,189,91,0.07)] blur-3xl float-a"></div>
          <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[rgba(24,189,91,0.06)] blur-3xl float-b"></div>
          <svg
            className="absolute inset-0 opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#32c972" />
                <stop offset="100%" stopColor="#18bd5b" />
              </linearGradient>
            </defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1.1" fill="url(#g)"></circle>
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)"></rect>
          </svg>
        </div>
        <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:py-14">
          <header className="flex items-center justify-between mb-8 fade-up">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[rgba(17,24,39,0.75)] border border-[rgba(255,255,255,0.08)] grid place-items-center shadow-card pulse-accent">
                <FaDumbbell
                  style={{
                    fontSize: "2.5vh",
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Gym Manager
                </h1>
              </div>
            </div>
            <span className="hidden"></span>
          </header>
          <div className="mb-6 fade-up hidden" style={{ animationDelay: "0.05s" }}></div>
          <section
            className="card rounded-3xl shadow-card overflow-hidden fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-[rgba(255,255,255,0.08)]">
              <div className="inline-flex p-1 bg-[rgba(255,255,255,0.05)] rounded-2xl border border-[rgba(255,255,255,0.08)]">
                <p className="px-4 sm:px-5 py-2 rounded-xl font-semibold bg-[rgba(255,255,255,0.07)] text-[#e5e7eb] border border-[rgba(255,255,255,0.08)] shadow-sm">
                  Log in
                </p>
                <Link
                  href="/LoginAndReg/Register"
                  className="px-4 sm:px-5 py-2 rounded-xl font-semibold text-[#94a3b8] hover:text-[#e5e7eb]"
                >
                  Create account
                </Link>
              </div>
              <div className="h-2 w-24 rounded-full shimmer hidden"></div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="space-y-7">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Welcome back
                  </h2>
                  <p className="text-[#94a3b8] text-sm">
                    Lets get something with is belongs to you!!!
                  </p>
                </div>
                <form
                  id="signinForm"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <div className="sm:col-span-1 md:col-span-2 md:grid md:grid-cols-2 md:gap-5">
                    <div className="md:col-span-1 md-field">
                      <input
                        className="md-input peer"
                        name="email"
                        autoComplete="off"
                        placeholder=" "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label className="md-label">Email</label>
                      <span className="material-icons-round md-icon">
                        <BiSolidUser />
                      </span>
                      <p className="error-text">Email is required</p>
                    </div>
                    <div className="md:col-span-1 md-field">
                      <input
                        className="md-input peer"
                        name="password"
                        type="password"
                        autoComplete="off"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label className="md-label">Password</label>
                      <span className="material-icons-round md-icon">
                        <RiLockPasswordFill />
                      </span>
                      <p className="error-text">
                        Password is required (min 6 characters)
                      </p>
                    </div>
                  </div>
                  <div
                    id="loginError"
                    className={`${
                      errorMessage ? "block" : "hidden"
                    } sm:col-span-2 text-[#EF4444] text-sm`}
                  >
                    {errorMessage}
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="md-btn px-5 py-3 inline-flex items-center gap-2"
                    >
                      <span className="material-icons-round">login</span>
                    </button>
                  </div>
                  <div
                    id="signinSuccess"
                    className="hidden sm:col-span-2 p-4 rounded-2xl border border-[rgba(24,189,91,0.35)] bg-[rgba(24,189,91,0.08)] text-[#18bd5b]"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="material-icons-round"
                        style={{ color: "#18bd5b" }}
                      >
                        You Are Logged-IN
                      </span>
                    </div>
                  </div>
                </form>
                <Link
                  href="/LoginAndReg/Register"
                  className="text-[#32c972] hover:underline"
                >
                  Create account instead?
                </Link>
              </div>
            </div>
          </section>
        </main>
        <div id="signedInModal" className="fixed inset-0 z-50 hidden">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative mx-auto max-w-lg px-6 py-10">
            <div className="rounded-3xl overflow-hidden card">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] grid place-items-center">
                    <p
                      className="material-icons-round"
                      style={{ color: "#18bd5b" }}
                    >
                      <MdOutlineVerified />
                    </p>
                  </div>
                </div>
                <button
                  id="closeModal"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgba(17,24,39,0.8)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] text-[#e5e7eb]"
                >
                  <span className="material-icons-round">close</span>
                </button>
              </div>
              <div className="p-6 space-y-3 text-[#94a3b8]">
                <p>You’ve successfully signed in .</p>
                <p className="text-sm">
                  Kindly wait we are going to Dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Page-scoped neutralization: ensure body/html globals don't bleed through */
        html, body {
    
          color: inherit !important;
          margin: 0 !important;
        }
        /* Scoped override to neutralize framework .pt-20 padding in this page */
        .auth-page { padding-top: 0 !important; }
        .auth-page [class*="pt-"] { padding-top: 0 !important; }
        .md-field {
          position: relative;
        }
        .md-input {
          width: 100%;
          padding: 1.05rem 3rem 1.05rem 1rem;
          border-radius: 0.9rem;
          background: rgba(17, 24, 39, 0.9);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s,
            color 0.2s;
        }
        .md-input:focus {
          outline: none;
          border-color: #18bd5b;
          box-shadow: 0 0 0 4px rgba(24, 189, 91, 0.18);
          background: rgba(17, 24, 39, 0.9);
        }
        .md-input:invalid {
          box-shadow: none;
        }
        .md-label {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          background: transparent;
          transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 4px;
          z-index: 10;
          font-size: 15px;
        }
        .md-input:focus + .md-label,
        .md-input:not(:placeholder-shown) + .md-label,
        .md-field.filled .md-label {
          top: -10px;
          left: 14px;
          transform: none;
          font-size: 12px;
          color: #18bd5b;
          /* Mask input border behind label text to avoid line through text */
          background: rgba(17, 24, 39, 0.9);
          border-radius: 4px;
          padding: 0 4px;
          z-index: 10;
        }
        .md-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .md-input:where(select) {
          background-color: rgba(17, 24, 39, 0.9) !important;
          color: #e5e7eb;
          border-radius: 0.9rem;
          appearance: none;
        }
        .md-input:where(select):focus {
          background-color: rgba(17, 24, 39, 0.9) !important;
          color: #e5e7eb;
        }
        .md-input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7);
        }
        select.md-input {
          background-color: rgba(17, 24, 39, 0.9) !important;
          color: #e5e7eb;
          border-radius: 0.9rem;
        }
        .error-text {
          color: #ef4444;
          font-size: 12px;
          margin-top: 6px;
          display: none;
        }
        .error .md-input {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
        }
        .error .error-text {
          display: block;
        }
        @keyframes floatA {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-12px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        @keyframes floatB {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .float-a {
          animation: floatA 14s ease-in-out infinite;
        }
        .float-b {
          animation: floatB 16s ease-in-out infinite;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-up {
          animation: fadeUp 0.45s ease-out both;
        }
        @keyframes pulseAccent {
          0% {
            box-shadow: 0 0 0 0 rgba(24, 189, 91, 0.18);
          }
          100% {
            box-shadow: 0 0 0 12px rgba(24, 189, 91, 0);
          }
        }
        .pulse-accent {
          animation: pulseAccent 2.2s ease-out infinite;
        }
        .md-btn {
          position: relative;
          overflow: hidden;
          border: none;
          border-radius: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.2px;
          background: linear-gradient(135deg, #32c972, #18bd5b);
          color: #0b1220;
          transition: filter 0.15s, transform 0.02s, box-shadow 0.15s;
          box-shadow: var(--btn-shadow, 0 8px 22px rgba(24, 189, 91, 0.22));
        }
        .md-btn:hover {
          filter: brightness(1.06);
          box-shadow: 0 10px 28px rgba(24, 189, 91, 0.28);
        }
        .md-btn:active {
          transform: translateY(1px);
        }
        .ripple {
          position: absolute;
          border-radius: 9999px;
          transform: scale(0);
          background: rgba(0, 0, 0, 0.15);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple {
          to {
            transform: scale(18);
            opacity: 0;
          }
        }
        .card {
          background: rgba(17, 24, 39, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.4);
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
          background-size: 200% 100%;
          animation: shimmer 3.6s linear infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
}