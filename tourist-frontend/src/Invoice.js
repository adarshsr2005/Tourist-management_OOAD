import React from "react";
import { Link } from "react-router-dom";

function Invoice() {

  const booking = JSON.parse(localStorage.getItem("lastBooking"));

  if (!booking) {
      return (
          <div style={styles.container}>
              <h2>No recent booking found</h2>
              <Link to="/dashboard">Go back to Dashboard</Link>
          </div>
      );
  }

  const printInvoice = () => {
    window.print();
  };

  return (
    <div style={styles.page}>
        <div style={styles.container} className="printableArea">
            <div style={styles.header}>
                <h1 style={styles.brand}>Adventure tours and travels</h1>
                <p>Booking Confirmation & Invoice</p>
            </div>
            
            <div style={styles.body}>
                <div style={styles.grid}>
                    <div>
                        <strong style={styles.label}>Booking ID:</strong>
                        <p>{booking.bookingId}</p>
                    </div>
                    <div>
                        <strong style={styles.label}>Status:</strong>
                        <p style={{color: booking.status === "PAID" ? '#38a169' : '#d69e2e', fontWeight: 'bold'}}>
                            {booking.status}
                        </p>
                    </div>
                    <div>
                        <strong style={styles.label}>Date:</strong>
                        <p>{booking.bookingDate || new Date().toISOString().split('T')[0]}</p>
                    </div>
                    <div>
                        <strong style={styles.label}>Bus ID:</strong>
                        <p>{booking.busId}</p>
                    </div>
                </div>

                <div style={styles.summaryBox}>
                    <h3 style={styles.summaryTitle}>Booking Summary</h3>
                    
                    <div style={styles.summaryRow}>
                        <span>Passengers count:</span>
                        <span>{booking.passengers || (booking.passengersList && booking.passengersList.length)}</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span>Payment Method:</span>
                        <span>{booking.paymentType || "UPI / CARD"}</span>
                    </div>

                    <hr style={styles.hr}/>

                    <div style={{...styles.summaryRow, ...styles.totalRow}}>
                        <span>Total Amount Paid:</span>
                        <span>₹{booking.totalAmount || booking.amount}</span>
                    </div>
                </div>

                <div className="no-print" style={styles.actions}>
                    <button style={styles.printBtn} onClick={printInvoice}>🖨️ Print Invoice</button>
                    <Link to="/dashboard" style={styles.backBtn}>Back to Dashboard</Link>
                </div>
            </div>
            
        </div>
        <style>{`
            @media print {
                body { background: white; margin: 0; padding: 0; }
                .no-print { display: none !important; }
                .printableArea { box-shadow: none !important; border: 1px solid #ccc; width: 100% !important; max-width: 100% !important;}
            }
        `}</style>
    </div>
  );
}

const styles = {
  page: {
      padding: "40px 20px",
      minHeight: "100vh",
      background: "#edf2f7",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start"
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    fontFamily: "'Inter', 'Roboto', sans-serif"
  },
  header: {
      background: "#2b6cb0",
      color: "white",
      padding: "30px 20px",
      textAlign: "center"
  },
  brand: {
      margin: "0 0 10px 0",
      fontSize: "28px"
  },
  borderBottom: {
      borderBottom: "1px solid #e2e8f0"
  },
  body: {
      padding: "30px"
  },
  grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "30px"
  },
  label: {
      display: "block",
      fontSize: "12px",
      color: "#718096",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "4px"
  },
  summaryBox: {
      background: "#f7fafc",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0"
  },
  summaryTitle: {
      margin: "0 0 15px 0",
      fontSize: "16px",
      color: "#2d3748"
  },
  summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      color: "#4a5568"
  },
  hr: {
      border: "none",
      borderTop: "1px dashed #cbd5e0",
      margin: "15px 0"
  },
  totalRow: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#2b6cb0",
      marginBottom: "0"
  },
  actions: {
      display: "flex",
      gap: "15px",
      marginTop: "30px",
      justifyContent: "center"
  },
  printBtn: {
      background: "#3182ce",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "15px",
      flex: 1
  },
  backBtn: {
      background: "#edf2f7",
      color: "#4a5568",
      border: "1px solid #cbd5e0",
      padding: "12px 24px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "none",
      fontSize: "15px",
      flex: 1,
      textAlign: "center"
  }
};

export default Invoice;