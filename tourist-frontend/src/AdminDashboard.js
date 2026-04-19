import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Package & Homestay State
  const [pkg, setPkg] = useState({ destination: "", price: "", duration: "", famousPlacesImages: ["", "", ""] });
  const [homestays, setHomestays] = useState(Array(5).fill({name: '', pricePerNight: '', image: ''}));
  const [allPackages, setAllPackages] = useState([]);
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const userStr = localStorage.getItem("user");
  const roleHeader = userStr ? JSON.parse(userStr).role : "ROLE_ADMIN";

  useEffect(() => {
    fetch("http://localhost:8080/booking/all", { headers: { "X-User-Role": roleHeader } })
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(console.error);

    fetch("http://localhost:8080/package/all", { headers: { "X-User-Role": roleHeader } })
      .then(res => res.json())
      .then(data => setAllPackages(data))
      .catch(console.error);

    fetch("http://localhost:8080/report/sales", { headers: { "X-User-Role": roleHeader } })
      .then(res => res.json())
      .then(data => setSalesData(data.length ? data : [{ month: 'Jan', total: 12000 }, { month: 'Feb', total: 18000 }, {month: 'Mar', total: 32000}])) // fallback mock
      .catch(() => setSalesData([{ month: 'Jan', total: 12000 }, { month: 'Feb', total: 18000 }, {month: 'Mar', total: 32000}]));
  }, [roleHeader]);

  const handleHomestayChange = (index, field, value) => {
    const newHomestays = [...homestays];
    newHomestays[index] = { ...newHomestays[index], [field]: value };
    setHomestays(newHomestays);
  };

  const handleDeletePackage = async (id) => {
      if(!window.confirm("Are you sure you want to delete this package?")) return;
      try {
          const res = await fetch(`http://localhost:8080/package/${id}`, {
              method: "DELETE",
              headers: { "X-User-Role": roleHeader }
          });
          if(res.ok) {
              setAllPackages(allPackages.filter(p => p.id !== id));
              alert("Package deleted successfully.");
          } else {
              alert("Failed to delete package.");
          }
      } catch (e) {
          alert("Error connecting to server.");
      }
  };

  const handleApprovePayment = async (id) => {
      try {
          const res = await fetch(`http://localhost:8080/booking/approve/${id}`, {
              method: "PUT",
              headers: { "X-User-Role": roleHeader }
          });
          if(res.ok) {
              setBookings(bookings.map(b => b.bookingId === id ? { ...b, status: 'APPROVED' } : b));
              alert("Payment approved and booking updated.");
          } else {
              alert("Failed to approve payment. Make sure the backend is running.");
          }
      } catch (e) {
          alert("Error connecting to server.");
      }
  };

  const handleAddPackage = async () => {
    const validHomestays = homestays.filter(h => h.name && h.pricePerNight);
    if(validHomestays.length !== 5) {
        alert("Admin Rule: You MUST link exactly 5 homestays to each package.");
        return;
    }
    
    const payload = {
        destination: pkg.destination,
        price: parseFloat(pkg.price),
        duration: parseInt(pkg.duration),
        famousPlacesImages: pkg.famousPlacesImages.filter(img => img.trim() !== ""),
        homestays: validHomestays.map(h => ({ 
            name: h.name, 
            pricePerNight: parseFloat(h.pricePerNight),
            exteriorImages: h.image ? [h.image] : []
        }))
    };

    try {
        const res = await fetch("http://localhost:8080/package/add", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-User-Role": roleHeader },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            alert("Payload sent successfully to backend! Added " + pkg.destination + " with 5 exclusive homestays.");
            setPkg({ destination: "", price: "", duration: "", famousPlacesImages: ["", "", ""] });
            setHomestays(Array(5).fill({name: '', pricePerNight: '', image: ''}));
            fetch("http://localhost:8080/package/all", { headers: { "X-User-Role": roleHeader } })
              .then(res => res.json())
              .then(data => setAllPackages(data))
              .catch(console.error);
        } else {
            alert("Failed to add package. Ensure backend is running.");
        }
    } catch (e) {
        alert("Error connecting to server.");
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Admin Console</h2>
          <button style={activeTab === 'inventory' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('inventory')}>📦 Inventory & Homestays</button>
          <button style={activeTab === 'finance' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('finance')}>💰 Financial Monitoring</button>
          <button style={activeTab === 'reports' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('reports')}>📈 Sales Reports</button>
        </div>

        <div style={styles.content}>
          {activeTab === 'inventory' && (
            <div style={styles.cardFade}>
              <h2 style={styles.contentTitle}>Inventory Management</h2>
              <p style={{color: '#6b7280'}}>Create a new Tour Package and link exactly 5 specialized homestays.</p>
              
              <div style={styles.formGrid}>
                 <input placeholder="Destination Name (e.g. Kerala)" value={pkg.destination} onChange={(e) => setPkg({...pkg, destination: e.target.value})} style={styles.inputLarge} />
                 <input type="number" placeholder="Base Price (₹)" value={pkg.price} onChange={(e) => setPkg({...pkg, price: e.target.value})} style={styles.inputLarge} />
                 <input type="number" placeholder="Duration (Days)" value={pkg.duration} onChange={(e) => setPkg({...pkg, duration: e.target.value})} style={styles.inputLarge} />
              </div>

              <h3 style={{marginTop: '30px', color: '#1f2937'}}>Famous Places Images (Optional)</h3>
              <div style={styles.formGrid}>
                 {pkg.famousPlacesImages.map((img, i) => (
                    <input 
                        key={i}
                        placeholder={`Famous Place Image URL ${i + 1}`} 
                        value={img} 
                        onChange={(e) => {
                            const newImages = [...pkg.famousPlacesImages];
                            newImages[i] = e.target.value;
                            setPkg({...pkg, famousPlacesImages: newImages});
                        }} 
                        style={styles.inputLarge} 
                    />
                 ))}
              </div>

              <h3 style={{marginTop: '30px', color: '#1f2937'}}>Attach 5 Homestays</h3>
              <div style={styles.homestayGrid}>
                 {homestays.map((hs, i) => (
                    <div key={i} style={styles.homestayCard}>
                        <div style={styles.homestayBadge}>Homestay {i + 1}</div>
                        <input placeholder="Property Name" style={styles.inputSmall} value={hs.name} onChange={(e) => handleHomestayChange(i, 'name', e.target.value)} />
                        <input type="number" placeholder="Price/Night" style={styles.inputSmall} value={hs.pricePerNight} onChange={(e) => handleHomestayChange(i, 'pricePerNight', e.target.value)} />
                        <input placeholder="Exterior Image URL" style={styles.inputSmall} value={hs.image} onChange={(e) => handleHomestayChange(i, 'image', e.target.value)} />
                    </div>
                 ))}
              </div>

              <button style={styles.primaryBtn} onClick={handleAddPackage}>Deploy Package to Production 🚀</button>

              <div style={{marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '30px'}}>
                <h2 style={styles.contentTitle}>Existing Packages</h2>
                <div style={styles.tableCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Destination</th>
                        <th style={styles.th}>Price</th>
                        <th style={styles.th}>Duration</th>
                        <th style={styles.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPackages.map(p => (
                        <tr key={p.id} style={styles.tr}>
                          <td style={styles.td}>#{p.id}</td>
                          <td style={styles.td}>{p.destination}</td>
                          <td style={styles.td}>₹{p.price}</td>
                          <td style={styles.td}>{p.duration} Days</td>
                          <td style={styles.td}>
                             <button style={{...styles.approveBtn, background: '#ef4444'}} onClick={() => handleDeletePackage(p.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {allPackages.length === 0 && (
                          <tr><td colSpan="5" style={{padding: '20px', textAlign: 'center', color: '#9ca3af'}}>No packages available</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div style={styles.cardFade}>
              <h2 style={styles.contentTitle}>Payment & Transaction Logs</h2>
              <p style={{color: '#6b7280', marginBottom: '20px'}}>Monitor all incoming revenue streams in real-time.</p>
              
              <div style={styles.tableCard}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Booking ID</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Total Revenue</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.bookingId} style={styles.tr}>
                        <td style={styles.td}>#{b.bookingId}</td>
                        <td style={styles.td}>{b.bookingDate || 'Just now'}</td>
                        <td style={styles.td}>
                           <span style={{...styles.statusBadge, background: b.status==='PAID'? '#dcfce7': (b.status==='WAITING_LIST'?'#fef08a':'#f3f4f6'), color: b.status==='PAID'?'#166534':(b.status==='WAITING_LIST'?'#854d0e':'#374151')}}>
                               {b.status}
                           </span>
                        </td>
                        <td style={styles.td}><b>₹{b.totalAmount || 0}</b></td>
                        <td style={styles.td}>
                            {(b.status === "PENDING" || b.status === "PAID") && (
                                <button style={styles.approveBtn} onClick={() => handleApprovePayment(b.bookingId)}>Approve</button>
                            )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                        <tr><td colSpan="5" style={{padding: '20px', textAlign: 'center', color: '#9ca3af'}}>No transactions available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div style={styles.cardFade}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h2 style={styles.contentTitle}>Monthly Sales Performance</h2>
                  <button style={styles.downloadBtn} onClick={() => window.open("http://localhost:8080/report/csv", "_blank")}>
                      📥 Export CSV
                  </button>
              </div>

              <div style={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                  </ResponsiveContainer>
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
  tabActive: { display: 'block', width: '100%', padding: '14px', marginBottom: '10px', borderRadius: '10px', border: 'none', background: '#eff6ff', color: '#1d4ed8', textAlign: 'left', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'inset 4px 0 0 #3b82f6' },
  content: { flex: 1 },
  cardFade: { background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease-in-out' },
  contentTitle: { margin: '0 0 10px 0', fontSize: '26px', color: '#111827' },
  formGrid: { display: 'flex', gap: '15px', marginTop: '25px', flexWrap: 'wrap' },
  inputLarge: { flex: 1, minWidth: '200px', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '16px', outline: 'none' },
  inputSmall: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '10px', fontSize: '14px', outline: 'none' },
  homestayGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '30px' },
  homestayCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', position: 'relative' },
  homestayBadge: { background: '#3b82f6', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' },
  primaryBtn: { background: '#10b981', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' },
  downloadBtn: { background: '#f59e0b', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' },
  tableCard: { border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { background: '#f9fafb', borderBottom: '2px solid #e5e7eb' },
  th: { padding: '15px', textAlign: 'left', color: '#4b5563', fontSize: '14px' },
  tr: { borderBottom: '1px solid #e5e7eb' },
  td: { padding: '15px', color: '#111827', fontSize: '15px' },
  statusBadge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  approveBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  chartWrapper: { background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }
};

export default AdminDashboard;