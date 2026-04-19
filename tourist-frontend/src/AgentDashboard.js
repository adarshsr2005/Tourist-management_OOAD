import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('fleet_add');
  
  // Fleet State
  const [bus, setBus] = useState({ busNumber: "", capacity: "", specifications: "", exteriorImages: "", interiorImages: "", status: "AVAILABLE", basePrice: "" });
  
  // Monitoring States
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const userStr = localStorage.getItem("user");
  const roleHeader = userStr ? JSON.parse(userStr).role : "ROLE_AGENT";

  useEffect(() => {
    fetch("http://localhost:8080/bus/all", { headers: { "X-User-Role": roleHeader } })
      .then(res => res.json())
      .then(data => {
          // If the backend doesn't have the new fields yet, mock some data for the monitoring UI
          if(data.length === 0) {
              setBuses([
                  {busId: 1, busNumber: 'KA-01-AB-1234', capacity: 40, status: 'AVAILABLE', exteriorImages: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500']},
                  {busId: 2, busNumber: 'MH-12-CD-5678', capacity: 20, status: 'WAITING_LIST', exteriorImages: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500']},
                  {busId: 3, busNumber: 'DL-04-EF-9101', capacity: 15, status: 'DEPLOYED', exteriorImages: ['https://images.unsplash.com/photo-1464219789935-c2cf9ced2c49?w=500']}
              ]);
          } else {
              setBuses(data);
          }
      }).catch(console.error);
      
    fetch("http://localhost:8080/booking/all", { headers: { "X-User-Role": roleHeader } })
      .then(res => res.json())
      .then(data => setBookings(data)).catch(console.error);
  }, [roleHeader]);

  const handleDeleteBus = async (id) => {
      if(!window.confirm("Are you sure you want to delete this bus?")) return;
      try {
          const res = await fetch(`http://localhost:8080/bus/${id}`, {
              method: "DELETE",
              headers: { "X-User-Role": roleHeader }
          });
          if(res.ok) {
              setBuses(buses.filter(b => b.busId !== id));
              alert("Bus deleted successfully.");
          } else {
              alert("Failed to delete bus.");
          }
      } catch (e) {
          alert("Error connecting to server.");
      }
  };

  const handleAddBus = async () => {
      const payload = {
          busNumber: bus.busNumber,
          capacity: parseInt(bus.capacity) || 0,
          basePrice: parseFloat(bus.basePrice) || 0,
          specifications: bus.specifications,
          status: bus.status,
          exteriorImages: bus.exteriorImages ? [bus.exteriorImages] : [],
          interiorImages: bus.interiorImages ? [bus.interiorImages] : []
      };
      
      try {
          const res = await fetch("http://localhost:8080/bus/add", {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-User-Role": roleHeader },
              body: JSON.stringify(payload)
          });
          if(res.ok) {
              const newBus = await res.json();
              setBuses([...buses, newBus]);
              alert(`Fleet vehicle added successfully!`);
              setBus({ busNumber: "", capacity: "", specifications: "", exteriorImages: "", interiorImages: "", status: "AVAILABLE", basePrice: "" });
          } else {
              alert("Failed to add bus");
          }
      } catch (e) {
          alert("Error connecting to server.");
      }
  };

  const getBusesByStatus = (status) => buses.filter(b => (b.status || 'AVAILABLE') === status);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Agent Fleet Portal</h2>
          <button style={activeTab === 'fleet_add' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('fleet_add')}>🚌 Add Fleet Vehicle</button>
          <button style={activeTab === 'fleet_monitor' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('fleet_monitor')}>📡 Fleet Monitoring</button>
          <button style={activeTab === 'booking_assign' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('booking_assign')}>📋 Assign Bookings</button>
        </div>

        <div style={styles.content}>
          {activeTab === 'fleet_add' && (
            <div style={styles.cardFade}>
              <h2 style={styles.contentTitle}>Register New Fleet Vehicle</h2>
              <p style={{color: '#6b7280', marginBottom: '30px'}}>Upload bus specifications, high-res images, and setup pricing structures.</p>
              
              <div style={styles.formGrid}>
                 <div style={{width: '100%'}}><label style={styles.label}>Bus Number (RTO)</label><input placeholder="e.g. KA-01-AB-1234" value={bus.busNumber} onChange={(e) => setBus({...bus, busNumber: e.target.value})} style={styles.inputLarge} /></div>
                 <div style={{flex: 1}}><label style={styles.label}>Passenger Capacity</label><input type="number" placeholder="40" value={bus.capacity} onChange={(e) => setBus({...bus, capacity: e.target.value})} style={styles.inputLarge} /></div>
                 <div style={{flex: 1}}><label style={styles.label}>Base Price (₹)</label><input type="number" placeholder="e.g. 5000" value={bus.basePrice} onChange={(e) => setBus({...bus, basePrice: e.target.value})} style={styles.inputLarge} /></div>
                 
                 <div style={{width: '100%', marginTop: '10px'}}><label style={styles.label}>Detailed Specifications</label>
                    <textarea placeholder="e.g. Volvo AC Semi-Sleeper, GPS Enabled, Push-back seats" value={bus.specifications} onChange={(e) => setBus({...bus, specifications: e.target.value})} style={{...styles.inputLarge, minHeight: '80px', width: '100%'}} />
                 </div>

                 <div style={{flex: 1, marginTop: '10px'}}><label style={styles.label}>Exterior Image URL</label><input placeholder="https://..." value={bus.exteriorImages} onChange={(e) => setBus({...bus, exteriorImages: e.target.value})} style={styles.inputLarge} /></div>
                 <div style={{flex: 1, marginTop: '10px'}}><label style={styles.label}>Interior Image URL</label><input placeholder="https://..." value={bus.interiorImages} onChange={(e) => setBus({...bus, interiorImages: e.target.value})} style={styles.inputLarge} /></div>
                 
                 <div style={{width: '100%', marginTop: '10px'}}><label style={styles.label}>Initial Status</label>
                     <select value={bus.status} onChange={(e) => setBus({...bus, status: e.target.value})} style={{...styles.inputLarge, width: '100%', background: 'white'}}>
                         <option value="AVAILABLE">Available</option>
                         <option value="DEPLOYED">Deployed</option>
                         <option value="MAINTENANCE">Maintenance</option>
                     </select>
                 </div>
              </div>

              <div style={{marginTop: '30px', textAlign: 'right'}}>
                <button style={styles.primaryBtn} onClick={handleAddBus}>Register Fleet to Database 🚌</button>
              </div>
            </div>
          )}

          {activeTab === 'fleet_monitor' && (
            <div style={styles.cardFade}>
              <h2 style={styles.contentTitle}>Real-time Fleet Monitoring</h2>
              <p style={{color: '#6b7280', marginBottom: '20px'}}>Track which buses are currently deployed, waiting list, or available for booking.</p>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
                  {/* AVAILABLE */}
                  <div style={{background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px'}}>
                      <h4 style={{color: '#166534', margin: '0 0 15px 0', fontSize: '18px', borderBottom: '2px solid #bbf7d0', paddingBottom: '10px'}}>🟢 Available</h4>
                      {getBusesByStatus('AVAILABLE').map(b => (
                          <div key={b.busId} style={{...styles.tinyBusCard, display: 'flex', justifyContent: 'space-between'}}>
                              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                  {b.exteriorImages && b.exteriorImages[0] ? <img src={b.exteriorImages[0]} alt="bus" style={styles.tinyImg}/> : <div style={styles.tinyImgAlt}>Bus</div>}
                                  <div>
                                      <div style={{fontWeight: 'bold', color: '#1f2937'}}>{b.busNumber}</div>
                                      <div style={{fontSize: '13px', color: '#6b7280'}}>Cap: {b.capacity} seats</div>
                                  </div>
                              </div>
                              <button style={{background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'}} onClick={() => handleDeleteBus(b.busId)}>X</button>
                          </div>
                      ))}
                      {getBusesByStatus('AVAILABLE').length === 0 && <div style={{fontSize: '13px', color: '#6b7280'}}>No buses available.</div>}
                  </div>

                  {/* WAITING LIST */}
                  <div style={{background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '20px'}}>
                      <h4 style={{color: '#854d0e', margin: '0 0 15px 0', fontSize: '18px', borderBottom: '2px solid #fef08a', paddingBottom: '10px'}}>🟡 Waiting List</h4>
                      {getBusesByStatus('WAITING_LIST').map(b => (
                          <div key={b.busId} style={{...styles.tinyBusCard, display: 'flex', justifyContent: 'space-between'}}>
                              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                  {b.exteriorImages && b.exteriorImages[0] ? <img src={b.exteriorImages[0]} alt="bus" style={styles.tinyImg}/> : <div style={styles.tinyImgAlt}>Bus</div>}
                                  <div>
                                      <div style={{fontWeight: 'bold', color: '#1f2937'}}>{b.busNumber}</div>
                                      <div style={{fontSize: '13px', color: '#6b7280'}}>Lock-in pending</div>
                                  </div>
                              </div>
                              <button style={{background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'}} onClick={() => handleDeleteBus(b.busId)}>X</button>
                          </div>
                      ))}
                      {getBusesByStatus('WAITING_LIST').length === 0 && <div style={{fontSize: '13px', color: '#6b7280'}}>No buses in waitlist.</div>}
                  </div>

                  {/* DEPLOYED */}
                  <div style={{background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px'}}>
                      <h4 style={{color: '#374151', margin: '0 0 15px 0', fontSize: '18px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px'}}>🔘 Deployed</h4>
                      {getBusesByStatus('DEPLOYED').map(b => (
                          <div key={b.busId} style={{...styles.tinyBusCard, opacity: 0.7, display: 'flex', justifyContent: 'space-between'}}>
                              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                  {b.exteriorImages && b.exteriorImages[0] ? <img src={b.exteriorImages[0]} alt="bus" style={styles.tinyImg}/> : <div style={styles.tinyImgAlt}>Bus</div>}
                                  <div>
                                      <div style={{fontWeight: 'bold', color: '#1f2937'}}>{b.busNumber}</div>
                                      <div style={{fontSize: '13px', color: '#6b7280'}}>On Tour Route</div>
                                  </div>
                              </div>
                              <button style={{background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'}} onClick={() => handleDeleteBus(b.busId)}>X</button>
                          </div>
                      ))}
                      {getBusesByStatus('DEPLOYED').length === 0 && <div style={{fontSize: '13px', color: '#6b7280'}}>No buses deployed.</div>}
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'booking_assign' && (
            <div style={styles.cardFade}>
              <h2 style={styles.contentTitle}>Assign Fleet to Approved Bookings</h2>
              
              <div style={styles.tableCard}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Booking ID</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.bookingId} style={styles.tr}>
                        <td style={styles.td}>#{b.bookingId}</td>
                        <td style={styles.td}>{b.bookingDate || 'Just now'}</td>
                        <td style={styles.td}>
                           <span style={styles.statusBadge}>{b.status}</span>
                        </td>
                        <td style={styles.td}>
                            {b.status === "APPROVED" ? (
                                <button style={styles.assignBtn} onClick={() => alert('Assigned logic executed.')}>Assign Available Bus</button>
                            ) : (
                                <span style={{color: '#9ca3af', fontSize: '13px'}}>No action</span>
                            )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                        <tr><td colSpan="4" style={{padding: '20px', textAlign: 'center', color: '#9ca3af'}}>No bookings require bus assignment.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f3f4f6', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  container: { display: 'flex', maxWidth: '1400px', margin: '30px auto', gap: '30px', padding: '0 20px' },
  sidebar: { width: '280px', background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', alignSelf: 'flex-start' },
  sidebarTitle: { margin: '0 0 20px 0', fontSize: '20px', color: '#111827' },
  tab: { display: 'block', width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '10px', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '16px', color: '#4b5563', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { display: 'block', width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '10px', border: 'none', background: '#e0e7ff', color: '#4338ca', textAlign: 'left', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'inset 4px 0 0 #6366f1' },
  content: { flex: 1 },
  cardFade: { background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease-in-out' },
  contentTitle: { margin: '0 0 10px 0', fontSize: '26px', color: '#111827' },
  formGrid: { display: 'flex', gap: '15px', marginTop: '25px', flexWrap: 'wrap' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' },
  inputLarge: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
  primaryBtn: { background: '#4f46e5', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)' },
  tinyBusCard: { background: 'white', display: 'flex', gap: '12px', padding: '12px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  tinyImg: { width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' },
  tinyImgAlt: { width: '40px', height: '40px', borderRadius: '6px', background: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6b7280' },
  tableCard: { border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { background: '#f9fafb', borderBottom: '2px solid #e5e7eb' },
  th: { padding: '15px', textAlign: 'left', color: '#4b5563', fontSize: '14px' },
  tr: { borderBottom: '1px solid #e5e7eb' },
  td: { padding: '15px', color: '#111827', fontSize: '15px' },
  statusBadge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: '#f3f4f6', color: '#374151' },
  assignBtn: { background: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AgentDashboard;