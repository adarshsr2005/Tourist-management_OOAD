import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <h3 style={{ margin: 0 }}>Tourist System</h3>

      <div>
        <span style={{ marginRight: "15px" }}>
          👤 {user?.name} ({user?.role})
        </span>

        <button onClick={() => navigate("/history")}>
            My Bookings
        </button>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#2d3748",
    color: "white",
    padding: "15px 30px"
  },
  logoutBtn: {
    background: "#e53e3e",
    border: "none",
    padding: "8px 12px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Navbar;