import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PackageList() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const roleHeader = userStr ? JSON.parse(userStr).role : "ROLE_TOURIST";

    fetch("http://localhost:8080/package/all", {
      headers: { "X-User-Role": roleHeader }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch packages");
        return res.json();
      })
      .then((data) => setPackages(data))
      .catch((err) => console.error(err));
  }, []);

  const navigate = useNavigate();

const handleBook = (pkg) => {
  localStorage.setItem("selectedPackage", JSON.stringify(pkg));
  window.location.href = "/payment";
};

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Available Packages</h2>

      <div style={styles.container}>
        {packages.map((pkg) => (
          <div key={pkg.id} style={styles.card}>
            <h3 style={{ marginBottom: "10px" }}>{pkg.destination}</h3>

            <p style={styles.text}>💰 ₹{pkg.price}</p>
            <p style={styles.text}>⏱ {pkg.duration} days</p>

            <button style={styles.btn} onClick={() => handleBook(pkg)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s"
  },
  text: {
    margin: "5px 0",
    fontSize: "14px"
  },
  btn: {
    background: "#667eea",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px"
  }
};

export default PackageList;