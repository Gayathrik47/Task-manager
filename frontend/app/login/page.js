"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "../globals.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://task-manager-backend-yw8r.onrender.com/auth/login", {
        email,
        password
      });

      // Save data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      setMessage("Login successful");

      // FIX: use router instead of window
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);

    } catch (err) {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Login</h2>

        {message && (
          <p
            style={{
              color: message.includes("successful") ? "green" : "red",
              marginBottom: "10px"
            }}
          >
            {message}
          </p>
        )}

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

        <button className="button" onClick={handleLogin}>
          Login
        </button>

        <p
          className="link"
          onClick={() => router.push("/register")}
        >
          Create account
        </p>
      </div>
    </div>
  );
}