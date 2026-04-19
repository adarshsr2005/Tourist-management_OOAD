import React, { useEffect, useState } from "react";

function PaymentPage() {

  const pkg = JSON.parse(localStorage.getItem("selectedPackage"));

  const [method, setMethod] = useState("UPI");
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengersList, setPassengersList] = useState([{ name: "", age: "", gender: "" }]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/bus/all")
      .then(res => res.json())
      .then(data => setBuses(data));
  }, []);

  const handlePassengerCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setPassengerCount(count);
    
    // adjust array
    const newList = [...passengersList];
    if (count > newList.length) {
      for (let i = newList.length; i < count; i++) {
        newList.push({ name: "", age: "", gender: "" });
      }
    } else {
      newList.splice(count);
    }
    setPassengersList(newList);
  };

  const handlePassengerChange = (index, field, value) => {
    const newList = [...passengersList];
    newList[index][field] = value;
    setPassengersList(newList);
  };

  // Base calculation, actual happens on backend, this is just for preview
  let previewAmount = pkg.price * passengerCount;
  if(passengerCount >= 4) previewAmount = previewAmount * 0.9;

  const handlePayment = async () => {
    if (!selectedBus) {
      alert("Please select a bus!");
      return;
    }

    const payload = {
      busId: selectedBus,
      basePrice: pkg.price,
      paymentType: method,
      passengers: passengersList
    };

    const userStr = localStorage.getItem("user");
    const roleHeader = userStr ? JSON.parse(userStr).role : "ROLE_TOURIST";

    const response = await fetch("http://localhost:8080/payment/process", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-User-Role": roleHeader 
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
       const errText = await response.text();
       alert("Payment failed: " + errText);
       return;
    }

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("lastBooking", JSON.stringify({
            ...data,
            passengers: passengerCount,
            busId: selectedBus,
            amount: data.totalAmount
        }));

        alert("Payment Successful! Discount applied if eligible.");
        window.location.href = "/invoice";
    } else {
        alert("Payment failed: " + data.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{pkg.destination}</h2>

      {/* 👥 PASSENGERS */}
      <label>No. of Passengers</label>
      <input
        type="number"
        value={passengerCount}
        min="1"
        onChange={handlePassengerCountChange}
      />

      {passengersList.map((p, i) => (
        <div key={i} style={styles.passengerBox}>
          <h4>Passenger {i + 1}</h4>
          <input 
            placeholder="Name" 
            value={p.name} 
            onChange={(e) => handlePassengerChange(i, 'name', e.target.value)} 
          />
          <input 
            type="number"
            placeholder="Age" 
            value={p.age} 
            onChange={(e) => handlePassengerChange(i, 'age', e.target.value)} 
          />
          <select 
            value={p.gender} 
            onChange={(e) => handlePassengerChange(i, 'gender', e.target.value)}>
            <option value="">Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
      ))}

      {/* 🚌 BUS SELECTION */}
      <label>Select Bus</label>
      <select onChange={(e) => setSelectedBus(e.target.value)}>
        <option value="">Select Bus</option>
        {buses.map(bus => (
          <option key={bus.busId} value={bus.busId}>
            {bus.busNumber} (Cap: {bus.capacity})
          </option>
        ))}
      </select>

      <h3>Preview Total (Backend Calculates Final): ₹{previewAmount.toFixed(2)}</h3>

      {/* 💳 PAYMENT */}
      <label>Payment Method</label>
      <select onChange={(e) => setMethod(e.target.value)}>
        <option value="UPI">UPI</option>
        <option value="CARD">Card</option>
      </select>

      {method === "UPI" && (
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay"
          alt="QR"
        />
      )}

      {method === "CARD" && (
        <div>
          <input placeholder="Card Number" />
          <input placeholder="MM/YY" />
          <input placeholder="CVV" />
        </div>
      )}

      <br/>
      <button style={styles.btn} onClick={handlePayment}>Pay & Book</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  },
  passengerBox: {
    background: "#f9f9f9",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  btn: {
    background: "#667eea",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
    marginTop: "20px"
  }
};

export default PaymentPage;