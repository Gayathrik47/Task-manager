"use client";
import { useState } from "react";
import axios from "axios";
import "../globals.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Password check function
  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password);
  };

  const handleRegister = async () => {
    //  check password strength
    if (!isStrongPassword(password)) {
      setMessage("Weak password ❌ (Use Aa1@...)");
      return;
    }

    try {
      await axios.post("https://task-manager-backend-yw8r.onrender.com/auth/register", {
        name,
        email,
        password
      });

      setMessage("Registered successfully ");

      // redirect after success
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (err) {
      setMessage("Registration failed ");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Register</h2>

        {/* MESSAGE */}
        {message && (
          <p style={{
            color: message.includes("success") ? "green" : "red",
            marginBottom: "10px"
          }}>
            {message}
          </p>
        )}

        <input
          className="input"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button" onClick={handleRegister}>
          Register
        </button>

        <p className="link" onClick={() => window.location.href = "/login"}>
          Already have account?
        </p>
      </div>
    </div>
  );
}