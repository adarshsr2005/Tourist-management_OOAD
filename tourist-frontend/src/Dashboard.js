import React from "react";
import Navbar from "./Navbar";
import BookingWizard from "./BookingWizard";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          Welcome {user?.name} 👋
        </h2>

        <BookingWizard />
      </div>
    </div>
  );
}

export default Dashboard;