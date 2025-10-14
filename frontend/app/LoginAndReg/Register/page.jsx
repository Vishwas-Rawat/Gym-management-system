"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registeredUserId, setRegisteredUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  
  // Member-specific fields
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [membershipPlan, setMembershipPlan] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [workoutTimeSlot, setWorkoutTimeSlot] = useState("");
  
  // Trainer-specific fields
  const [specialization, setSpecialization] = useState("");
  const [certification, setCertification] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

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

    return () => {
      document.removeEventListener("input", handleInput);
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("change", handleChange);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const registerForm = e.target;
    const emailField = registerForm.querySelector('[name="email"]')?.parentElement;
    const phoneField = registerForm.querySelector('[name="phoneNumber"]')?.parentElement;
    const passwordField = registerForm.querySelector('[name="password"]')?.parentElement;
    const usernameField = registerForm.querySelector('[name="username"]')?.parentElement;
    const firstNameField = registerForm.querySelector('[name="firstName"]')?.parentElement;
    // const lastNameField = registerForm.querySelector('[name="lastName"]')?.parentElement;
    // const dobField = registerForm.querySelector('[name="dateOfBirth"]')?.parentElement;
    // const addressField = registerForm.querySelector('[name="address"]')?.parentElement;

    setErrorMessage("");
    let hasError = false;

    const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
    const phoneOk = (v) => /^\d{10}$/.test(v.trim());
    const minLen = (v, n) => v.trim().length >= n;
    const dobOk = (v) => v !== "";
    const required = (v) => v !== "" && v.trim().length > 0;

    // Basic field validation
    if (emailField) emailField.classList.toggle("error", !emailOk(email));
    if (phoneField) phoneField.classList.toggle("error", !phoneOk(phoneNumber));
    if (passwordField) passwordField.classList.toggle("error", !minLen(password, 6));
    if (firstNameField) firstNameField.classList.toggle("error", !minLen(firstName, 1));
    if (usernameField) usernameField.classList.toggle("error", !minLen(username, 3));

    // Role-specific validation
    if (role === "MEMBER") {
      const fitnessGoalField = registerForm.querySelector('[name="fitnessGoal"]')?.parentElement;
      const membershipPlanField = registerForm.querySelector('[name="membershipPlan"]')?.parentElement;
      const joiningDateField = registerForm.querySelector('[name="joiningDate"]')?.parentElement;
      const amountPaidField = registerForm.querySelector('[name="amountPaid"]')?.parentElement;
      const paymentMethodField = registerForm.querySelector('[name="paymentMethod"]')?.parentElement;
      const workoutTimeSlotField = registerForm.querySelector('[name="workoutTimeSlot"]')?.parentElement;

      if (fitnessGoalField) fitnessGoalField.classList.toggle("error", !required(fitnessGoal));
      if (membershipPlanField) membershipPlanField.classList.toggle("error", !required(membershipPlan));
      if (joiningDateField) joiningDateField.classList.toggle("error", !required(joiningDate));
      if (amountPaidField) amountPaidField.classList.toggle("error", !required(amountPaid));
      if (paymentMethodField) paymentMethodField.classList.toggle("error", !required(paymentMethod));
      if (workoutTimeSlotField) workoutTimeSlotField.classList.toggle("error", !required(workoutTimeSlot));
    }

    if (role === "TRAINER") {
      const specializationField = registerForm.querySelector('[name="specialization"]')?.parentElement;
      const certificationField = registerForm.querySelector('[name="certification"]')?.parentElement;
      const experienceYearsField = registerForm.querySelector('[name="experienceYears"]')?.parentElement;

      if (specializationField) specializationField.classList.toggle("error", !required(specialization));
      if (certificationField) certificationField.classList.toggle("error", !required(certification));
      if (experienceYearsField) experienceYearsField.classList.toggle("error", !required(experienceYears));
    }

    // Check basic fields
    if (!emailOk(email)) hasError = true;
    if (!phoneOk(phoneNumber)) hasError = true;
    if (!minLen(password, 6)) hasError = true;
    if (!minLen(firstName, 1)) hasError = true;
    if (!minLen(username, 3)) hasError = true;

    // Check role-specific fields
    if (role === "MEMBER") {
      if (!required(fitnessGoal)) hasError = true;
      if (!required(membershipPlan)) hasError = true;
      if (!required(joiningDate)) hasError = true;
      if (!required(amountPaid)) hasError = true;
      if (!required(paymentMethod)) hasError = true;
      if (!required(workoutTimeSlot)) hasError = true;
    }

    if (role === "TRAINER") {
      if (!required(specialization)) hasError = true;
      if (!required(certification)) hasError = true;
      if (!required(experienceYears)) hasError = true;
    }

    if (hasError) {
      setErrorMessage("Please fill all required fields correctly");
      return;
    }

    try {
      // Build request body based on role
      let requestBody = {
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        username: username,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        gender: gender || null,
        address: address,
        role: role,
      };

      // Add role-specific fields
      if (role === "MEMBER") {
        requestBody = {
          ...requestBody,
          fitnessGoal: fitnessGoal,
          membershipPlan: membershipPlan,
          joiningDate: joiningDate,
          amountPaid: parseFloat(amountPaid),
          paymentMethod: paymentMethod,
          workoutTimeSlot: workoutTimeSlot,
        };
      }

      if (role === "TRAINER") {
        requestBody = {
          ...requestBody,
          specialization: specialization,
          certification: certification,
          experienceYears: parseInt(experienceYears),
        };
      }

      const response = await fetch("http://localhost:8083/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const registerSuccess = document.getElementById("registerSuccess");
      const registerError = document.getElementById("registerError");

      if (response.ok) {
        const data = await response.json();
        setErrorMessage("");
        setRegisteredUserId(data.userId);
        setSuccessMessage(data.message);
        if (registerSuccess) registerSuccess.classList.remove("hidden");
      } else {
        const data = await response.json();
        let message = data.message || "Registration failed";
        if (response.status === 409) {
          // Standardize known conflicts from API
          if (/email/i.test(message)) message = "Email already registered";
          else if (/phone/i.test(message)) message = "Phone number already registered";
        } else if (response.status === 400 && /missing/i.test(message)) {
          message = "Missing or invalid fields";
        }
        setErrorMessage(message);
        if (registerError) registerError.classList.remove("hidden");
      }
    } catch (err) {
      setErrorMessage("Unable to connect to the server. Please check your network and try again.1");
      const registerError = document.getElementById("registerError");
      if (registerError) registerError.classList.remove("hidden");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError("");
    const otpForm = e.target;
    const otpField = otpForm.querySelector('[name="otp"]')?.parentElement;
    let hasError = false;

    const otpOk = (v) => /^\d{6}$/.test(v.trim());

    if (otpField) otpField.classList.toggle("error", !otpOk(otp));

    if (!otpOk(otp)) hasError = true;

    if (hasError) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8083/user/verify-otp?userId=${registeredUserId}&otpCode=${otp}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setOtpError("");
        setSuccessMessage("OTP verified successfully. Redirecting to login...");
        setTimeout(() => {
          router.push("/LoginAndReg/Login");
        }, 900);
      } else {
        const data = await response.json();
        setOtpError(data.message || "OTP verification failed");
      }
    } catch (err) {
      setOtpError("Unable to connect to the server. Please check your network and try again.2");
    }
  };

  const handleResend = async () => {
    setResendMessage("");
    try {
      const response = await fetch(`http://localhost:8083/user/resend-otp?userId=${registeredUserId}`, {
        method: "POST",
      });

      if (response.ok) {
        setResendMessage("OTP resent successfully");
      } else {
        const data = await response.json();
        setResendMessage(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setResendMessage("Unable to connect to the server. Please check your network and try again.3");
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gym Manager — Register Demo (Dark Theme)</title>
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
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[rgba(50,201,114,0.08)] blur-3xl float-a"></div>
          <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[rgba(50,201,114,0.07)] blur-3xl float-b"></div>
          <svg
            className="absolute inset-0 opacity-[0.08]"
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
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[color:var(--accent,#18bd5b)]"
                >
                  <path
                    d="M6 10h12M6 14h12M4 8v8M20 8v8M2 10v4M22 10v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
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
                <Link
                  href="/LoginAndReg/Login"
                  className="px-4 sm:px-5 py-2 rounded-xl font-semibold text-[#94a3b8] hover:text-[#e5e7eb]"
                >
                  Log in
                </Link>
                <p className="px-4 sm:px-5 py-2 rounded-xl font-semibold bg-[rgba(255,255,255,0.07)] text-[#e5e7eb] border border-[rgba(255,255,255,0.08)] shadow-sm">
                  Create account
                </p>
              </div>
              <div className="h-2 w-24 rounded-full shimmer hidden"></div>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="space-y-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      Hey Bro, Let's Do This And Make You Batter Then Ever👍
                    </h2>
                    <p className="text-[#94a3b8] text-sm">
                      All fields are required.
                    </p>
                  </div>
                </div>
                <form
                  id="registerForm"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  noValidate
                  onSubmit={handleRegisterSubmit}
                >
                  <div className="md-field sm:col-span-1">
                    <input
                      className="md-input peer"
                      name="email"
                      autoComplete="off"
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="md-label">Email</label>
                    <p className="error-text">Please enter a valid email</p>
                  </div>
                  <div className="md-field sm:col-span-1">
                    <input
                      className="md-input peer"
                      name="phoneNumber"
                      autoComplete="off"
                      maxLength="10"
                      placeholder=" "
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <label className="md-label">Phone Number</label>
                    <p className="error-text">
                      Please enter a valid 10-digit phone number
                    </p>
                  </div>
                  <div className="md-field sm:col-span-1">
                    <input
                      className="md-input peer"
                      name="password"
                      type="password"
                      minLength="6"
                      autoComplete="off"
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="md-label">Password</label>
                    <p className="error-text">
                      Please enter at least 6 characters
                    </p>
                  </div>
                  <div className="md-field sm:col-span-1">
                    <input
                      className="md-input peer"
                      name="username"
                      autoComplete="off"
                      placeholder=" "
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="md-label">Username</label>
                    <p className="error-text">Please enter a username (min 3 chars)</p>
                  </div>
                  <div className="md-field">
                    <input
                      className="md-input peer"
                      name="firstName"
                      autoComplete="off"
                      placeholder=" "
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label className="md-label">First name</label>
                    <p className="error-text">First name is required</p>
                  </div>
                  <div className="md-field">
                    <input
                      className="md-input peer"
                      name="lastName"
                      autoComplete="off"
                      placeholder=" "
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <label className="md-label">Last name</label>

                    <p className="error-text">Last name is required</p>
                  </div>
                  <div className="md-field">
                    <input
                      className="md-input peer"
                      name="dateOfBirth"
                      type="date"
                      placeholder=" "
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <label className="md-label">Date of Birth</label>

                    <p className="error-text">Date of birth is required</p>
                  </div>
                  <div className="md-field">
                    <select
                      className="md-input peer"
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                    <label className="md-label">Gender</label>
                  </div>
                  <div className="md-field sm:col-span-2">
                    <input
                      className="md-input peer"
                      name="address"
                      autoComplete="off"
                      placeholder=" "
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <label className="md-label">Address</label>
                    <p className="error-text">Address is required</p>
                  </div>
                  <div className="md-field">
                    <select
                      className="md-input peer"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled
                    >
                      <option >Admin</option>
                    </select>
                    <label className="md-label">Role</label>
                  </div>
                  
                  {/* Member-specific fields */}
                  {role === "MEMBER" && (
                    <>
                      <div className="md-field">
                        <select
                          className="md-input peer"
                          name="fitnessGoal"
                          value={fitnessGoal}
                          onChange={(e) => setFitnessGoal(e.target.value)}
                        >
                          <option value="">Select Fitness Goal</option>
                          <option value="Weight Loss">Weight Loss</option>
                          <option value="Muscle Gain">Muscle Gain</option>
                          <option value="Endurance">Endurance</option>
                          <option value="Strength">Strength</option>
                          <option value="General Fitness">General Fitness</option>
                        </select>
                        <label className="md-label">Fitness Goal</label>
                        <p className="error-text">Fitness goal is required</p>
                      </div>
                      <div className="md-field">
                        <select
                          className="md-input peer"
                          name="membershipPlan"
                          value={membershipPlan}
                          onChange={(e) => setMembershipPlan(e.target.value)}
                        >
                          <option value="">Select Membership Plan</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="ANNUAL">Annual</option>
                        </select>
                        <label className="md-label">Membership Plan</label>
                        <p className="error-text">Membership plan is required</p>
                      </div>
                      <div className="md-field">
                        <input
                          className="md-input peer"
                          name="joiningDate"
                          type="date"
                          placeholder=" "
                          value={joiningDate}
                          onChange={(e) => setJoiningDate(e.target.value)}
                        />
                        <label className="md-label">Joining Date</label>
                        <p className="error-text">Joining date is required</p>
                      </div>
                      <div className="md-field">
                        <input
                          className="md-input peer"
                          name="amountPaid"
                          type="number"
                          step="0.01"
                          placeholder=" "
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                        />
                        <label className="md-label">Amount Paid</label>
                        <p className="error-text">Amount paid is required</p>
                      </div>
                      <div className="md-field">
                        <select
                          className="md-input peer"
                          name="paymentMethod"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option value="">Select Payment Method</option>
                          <option value="CASH">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="CARD">Card</option>
                          <option value="NET_BANKING">Net Banking</option>
                        </select>
                        <label className="md-label">Payment Method</label>
                        <p className="error-text">Payment method is required</p>
                      </div>
                      <div className="md-field">
                        <select
                          className="md-input peer"
                          name="workoutTimeSlot"
                          value={workoutTimeSlot}
                          onChange={(e) => setWorkoutTimeSlot(e.target.value)}
                        >
                          <option value="">Select Workout Time</option>
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Evening">Evening</option>
                          <option value="Night">Night</option>
                        </select>
                        <label className="md-label">Workout Time Slot</label>
                        <p className="error-text">Workout time slot is required</p>
                      </div>
                    </>
                  )}
                  
                  {/* Trainer-specific fields */}
                  {role === "TRAINER" && (
                    <>
                      <div className="md-field">
                        <input
                          className="md-input peer"
                          name="specialization"
                          autoComplete="off"
                          placeholder=" "
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                        />
                        <label className="md-label">Specialization</label>
                        <p className="error-text">Specialization is required</p>
                      </div>
                      <div className="md-field">
                        <input
                          className="md-input peer"
                          name="certification"
                          autoComplete="off"
                          placeholder=" "
                          value={certification}
                          onChange={(e) => setCertification(e.target.value)}
                        />
                        <label className="md-label">Certification</label>
                        <p className="error-text">Certification is required</p>
                      </div>
                      <div className="md-field">
                        <input
                          className="md-input peer"
                          name="experienceYears"
                          type="number"
                          min="0"
                          placeholder=" "
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                        />
                        <label className="md-label">Experience (Years)</label>
                        <p className="error-text">Experience years is required</p>
                      </div>
                    </>
                  )}
                  <div
                    id="registerError"
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
                      <span>Create account</span>
                    </button>
                  </div>
                  <div
                    id="registerSuccess"
                    className={`${
                      successMessage ? "" : "hidden"
                    } sm:col-span-2 p-4 rounded-2xl border border-[rgba(24,189,91,0.35)] bg-[rgba(24,189,91,0.08)] text-[#18bd5b]`}
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-semibold">Account created</p>
                        <p className="text-sm text-[#64748B]">
                          {successMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
                {registeredUserId && (
                  <form
                    id="otpForm"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5"
                    noValidate
                    onSubmit={handleOtpSubmit}
                  >
                    <div className="md-field sm:col-span-1">
                      <input
                        className="md-input peer"
                        name="otp"
                        autoComplete="off"
                        placeholder=" "
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <label className="md-label">OTP</label>

                      <p className="error-text">
                        Please enter a valid 6-digit OTP
                      </p>
                    </div>
                    <div
                      className={`${
                        otpError ? "block" : "hidden"
                      } sm:col-span-2 text-[#EF4444] text-sm`}
                    >
                      {otpError}
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="md-btn px-5 py-3 inline-flex items-center gap-2"
                      >
                        <span>Verify OTP</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-[#18bd5b] hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <div
                      className={`${
                        resendMessage ? "block" : "hidden"
                      } sm:col-span-2 text-[#18bd5b] text-sm`}
                    >
                      {resendMessage}
                    </div>
                  </form>
                )}
                <Link
                  href="/LoginAndReg/Login"
                  className="text-[#32c972] hover:underline"
                >
                  Sign in instead?
                </Link>
              </div>
            </div>
          </section>
        </main>
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