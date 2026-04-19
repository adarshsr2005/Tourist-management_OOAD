import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/tourist/login?email=${email}&password=${password}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data && data.role) {
        localStorage.setItem("user", JSON.stringify(data));
        alert("Login Successful! Welcome " + data.name);

        if (data.role === "TOURIST") navigate("/dashboard");
        else if (data.role === "ADMIN") navigate("/admin");
        else if (data.role === "AGENT") navigate("/agent");

      } else {
        alert("Invalid credentials");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>New user?</p>

        <button
          className="link-btn"
          onClick={() => navigate("/register")}
        >
          Register Here
        </button>
      </div>
    </div>
  );
}

export default Login;