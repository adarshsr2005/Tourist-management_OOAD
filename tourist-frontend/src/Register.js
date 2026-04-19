import React, { useState } from "react";

function Register() {
  const [tourist, setTourist] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setTourist({ ...tourist, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/tourist/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tourist)
      });

      const data = await response.json();
      alert("Registered Successfully! ID: " + data.touristId);

      // ✅ clear form
      setTourist({
        name: "",
        email: "",
        phone: "",
        password: ""
      });

    } catch (error) {
      console.error(error);
      alert("Error while registering");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        <input
          name="name"
          placeholder="Name"
          value={tourist.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={tourist.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={tourist.phone}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={tourist.password}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Register</button>
      </div>
    </div>
  );
}

export default Register;