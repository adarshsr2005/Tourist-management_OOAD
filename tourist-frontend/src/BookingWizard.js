import React, { useState, useEffect } from 'react';

const BookingWizard = () => {
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [selectedPkgDetails, setSelectedPkgDetails] = useState(null); // Used to show detailed info before advancing

  const [bookingData, setBookingData] = useState({
    packageId: null,
    busId: null,
    homestayId: null,
    passengers: [],
    basePrice: 0,
    paymentType: 'UPI',
    homestaysList: []
  });

  useEffect(() => {
    // Fetch packages from backend instead of just static mock data
    const fetchPackages = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const roleHeader = userStr ? JSON.parse(userStr).role : "ROLE_TOURIST";

        const response = await fetch("http://localhost:8080/package/all", {
          headers: { "X-User-Role": roleHeader }
        });
        if (response.ok) {
          const data = await response.json();
          // Map backend data to frontend model (injecting images/specs if they don't exist in DB)
          const enrichedPackages = data.map((pkg, index) => {
              const isEven = index % 2 === 0;
              return {
                  ...pkg,
                  coverImage: (pkg.famousPlacesImages && pkg.famousPlacesImages.length > 0) ? pkg.famousPlacesImages[0] : (pkg.coverImage || (isEven ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1605640840469-6bdce59afb22?q=80&w=2070&auto=format&fit=crop')),
                  galleries: (pkg.famousPlacesImages && pkg.famousPlacesImages.length > 0) ? pkg.famousPlacesImages : (pkg.galleries || (isEven ? [
                      'https://images.unsplash.com/photo-1587922543596-f9479cb25b64?w=500&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=500&auto=format&fit=crop'
                  ] : [
                      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1593690623696-27756f7ef57d?w=500&auto=format&fit=crop'
                  ])),
                  visitingPlaces: pkg.visitingPlaces || (pkg.destination === 'Hampi' ? ["Virupaksha Temple", "Vittala Temple", "Lotus Mahal", "Elephant Stables"] : ["Main City", "Local Markets", "Historic Site", "Sunset Point"]),
                  specification: pkg.specification || (pkg.destination === 'Hampi' ? "Explore the ancient ruins and majestic temples of the Vijayanagara Empire. A UNESCO World Heritage site known for its captivating history." : `Experience the ultimate ${pkg.destination} premium package. This ${pkg.duration}-day retreat offers a perfect mix of relaxation and thrilling activities.`)
              };
          });
          setPackages(enrichedPackages);
        }
      } catch (err) {
        console.error("Failed to fetch packages from DB", err);
      }
    };
    fetchPackages();
  }, []);

  const nextStep = () => {
      setStep(step + 1);
      setSelectedPkgDetails(null); // reset detail view when moving forward
  };
  const prevStep = () => {
      if(selectedPkgDetails) {
          setSelectedPkgDetails(null);
      } else {
          setStep(step - 1);
      }
  };

  const calculateDiscount = () => {
    const count = bookingData.passengers.length;
    if (count > 10) return 0.15;
    if (count > 5) return 0.10;
    return 0;
  };

  return (
    <div style={styles.wizardContainer}>
      <h2 style={styles.wizardTitle}>Experience Adventure Tours and Travells</h2>
      
      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        {['Destination', 'Transport', 'Homestay', 'Payment'].map((label, index) => {
          const i = index + 1;
          const isActive = step === i;
          const isPassed = step > i;
          return (
            <div key={i} style={isActive ? styles.progressActive : (isPassed ? styles.progressPassed : styles.progressInactive)}>
              <div style={styles.stepCircle(isActive, isPassed)}>{isPassed ? '✓' : i}</div>
              <span style={{marginTop: '8px', fontSize: '13px', fontWeight: isActive ? '600' : '400'}}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Package Selection */}
      {step === 1 && !selectedPkgDetails && (
        <div style={styles.stepContentFade}>
          <h3 style={styles.stepHeader}>Where do you want to go?</h3>
          <div style={styles.gridContainer}>
            {packages.map(pkg => (
              <div key={pkg.id} style={styles.imageCard} onClick={() => setSelectedPkgDetails(pkg)}>
                <img src={pkg.coverImage} alt={pkg.destination} style={styles.cardImage} />
                <div style={styles.cardOverlay}>
                  <h4 style={styles.overlayTitle}>{pkg.destination}</h4>
                  <div style={styles.overlayDetails}>
                    <span style={styles.pillBadge}>₹{pkg.price}</span>
                    <span style={styles.pillBadge}>⏱ {pkg.duration} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1.5: Detailed Package View */}
      {step === 1 && selectedPkgDetails && (
        <div style={styles.stepContentFade}>
          <button style={styles.ghostBtn} onClick={() => setSelectedPkgDetails(null)}>← Back to Packages</button>
          
          <div style={styles.detailCard}>
             <img src={selectedPkgDetails.coverImage} alt="Cover" style={styles.detailCoverImage} />
             <div style={styles.detailBody}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2 style={{margin: 0, fontSize: '28px', color: '#1f2937'}}>{selectedPkgDetails.destination}</h2>
                    <span style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>₹{selectedPkgDetails.price} / person</span>
                </div>
                
                <h4 style={{marginTop: '20px', color: '#4b5563'}}>Trip Specifications</h4>
                <p style={{lineHeight: '1.6', color: '#6b7280', fontSize: '15px'}}>{selectedPkgDetails.specification}</p>

                <h4 style={{marginTop: '20px', color: '#4b5563'}}>Top Visiting Places</h4>
                <div style={styles.tagsContainer}>
                    {selectedPkgDetails.visitingPlaces.map((place, idx) => (
                        <span key={idx} style={styles.tag}>{place}</span>
                    ))}
                </div>

                <h4 style={{marginTop: '20px', color: '#4b5563'}}>Destination Previews</h4>
                <div style={styles.galleryGrid}>
                    {selectedPkgDetails.galleries.map((img, idx) => (
                        <img key={idx} src={img} alt="Gallery" style={styles.galleryImg} />
                    ))}
                </div>

             </div>
          </div>

          <div style={{marginTop: '20px', textAlign: 'right'}}>
            <button style={styles.primaryBtnLarge} onClick={() => {
                setBookingData({ ...bookingData, packageId: selectedPkgDetails.id, basePrice: selectedPkgDetails.price, homestaysList: selectedPkgDetails.homestays || [] });
                nextStep();
            }}>
                Select this Destination
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Bus Selection */}
      {step === 2 && (
        <div style={styles.stepContentFade}>
          <h3 style={styles.stepHeader}>Select Your Transport Fleet</h3>
          <p style={{color: '#6b7280', marginBottom: '20px'}}>Enter passenger count to see available smart buses.</p>
          
          <input 
            type="number" 
            placeholder="👥 Enter Number of Passengers" 
            style={styles.inputLarge}
            min="1"
            value={bookingData.passengers.length || ''}
            onChange={(e) => {
              const count = parseInt(e.target.value) || 0;
              setBookingData({ 
                ...bookingData, 
                passengers: Array.from({length: count}, (_, i) => bookingData.passengers[i] || { name: '', age: '', gender: 'Male', phone: '' }) 
              });
            }}
          />

          {bookingData.passengers.length > 0 && (
            <div style={{marginTop: '20px', animation: 'fadeIn 0.3s ease'}}>
              <h4 style={{marginBottom: '15px', color: '#374151'}}>Passenger Information</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {bookingData.passengers.map((p, index) => (
                  <div key={index} style={{padding: '15px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <div style={{width: '100%', fontWeight: '600', color: '#4b5563', fontSize: '14px'}}>Passenger {index + 1}</div>
                    
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      style={styles.inputSmall} 
                      value={p.name}
                      onChange={(e) => {
                        const newPass = [...bookingData.passengers];
                        newPass[index].name = e.target.value;
                        setBookingData({...bookingData, passengers: newPass});
                      }}
                    />
                    <input 
                      type="number" 
                      placeholder="Age" 
                      style={{...styles.inputSmall, maxWidth: '80px'}} 
                      value={p.age}
                      onChange={(e) => {
                        const newPass = [...bookingData.passengers];
                        newPass[index].age = e.target.value;
                        setBookingData({...bookingData, passengers: newPass});
                      }}
                    />
                    <select 
                      style={styles.inputSmall}
                      value={p.gender}
                      onChange={(e) => {
                        const newPass = [...bookingData.passengers];
                        newPass[index].gender = e.target.value;
                        setBookingData({...bookingData, passengers: newPass});
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Phone No." 
                      style={styles.inputSmall} 
                      value={p.phone}
                      onChange={(e) => {
                        const newPass = [...bookingData.passengers];
                        newPass[index].phone = e.target.value;
                        setBookingData({...bookingData, passengers: newPass});
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingData.passengers.length > 0 && (
            <div style={{...styles.gridContainer, marginTop: '30px'}}>
                <div style={bookingData.busId === 1 ? styles.busCardSelected : styles.busCard} onClick={() => setBookingData({...bookingData, busId: 1})}>
                    <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop" alt="Bus" style={styles.busImage}/>
                    <div style={{padding: '15px'}}>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '18px'}}>Volvo AC Semi-Sleeper</h4>
                        <span style={styles.statusAvailable}>● Available for your group</span>
                    </div>
                </div>
                <div style={bookingData.busId === 2 ? styles.busCardSelected : styles.busCard} onClick={() => setBookingData({...bookingData, busId: 2})}>
                    <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&auto=format&fit=crop" alt="Bus" style={styles.busImage}/>
                    <div style={{padding: '15px'}}>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '18px'}}>Scania Multi-Axle</h4>
                        <span style={styles.statusWaitlist}>● Waitlist (Returns tomorrow)</span>
                    </div>
                </div>
            </div>
          )}

          <div style={styles.actionRow}>
              <button style={styles.ghostBtn} onClick={prevStep}>← Back</button>
              <button style={styles.primaryBtn} disabled={!bookingData.busId || bookingData.passengers.length === 0} onClick={nextStep}>Continue to Stay →</button>
          </div>
        </div>
      )}

      {/* Step 3: Homestay & Discount */}
      {step === 3 && (
        <div style={styles.stepContentFade}>
          <h3 style={styles.stepHeader}>Select Premium Homestay</h3>
          <div style={styles.gridContainer}>
             {bookingData.homestaysList && bookingData.homestaysList.length > 0 ? bookingData.homestaysList.map((stay, idx) => (
                 <div key={stay.id || idx} style={bookingData.homestayId === (stay.id || stay.name) ? styles.cardSelected : styles.card} onClick={() => setBookingData({...bookingData, homestayId: stay.id || stay.name})}>
                   <img src={(stay.exteriorImages && stay.exteriorImages.length > 0 ? stay.exteriorImages[0] : (stay.image || (idx % 2 === 0 ? "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500&auto=format&fit=crop" : "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&auto=format&fit=crop")))} alt="stay" style={styles.stayImage}/>
                   <div style={{padding: '15px'}}>
                       <h4 style={{margin: 0, fontSize: '18px'}}>{stay.name}</h4>
                       <p style={{margin: '5px 0 0 0', color: '#6b7280'}}>₹{stay.pricePerNight || stay.price || 0} / night addition</p>
                   </div>
                 </div>
             )) : (
                 <div style={{color: '#6b7280', gridColumn: '1 / -1', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db', textAlign: 'center'}}>
                    No exclusive homestays linked to this destination yet.
                 </div>
             )}
          </div>
          
          <div style={styles.discountBox}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                   <h4 style={{margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '18px'}}>Adventure Tours and Travells Group Dynamic Discount</h4>
                   <p style={{margin: 0, color: '#3b82f6'}}>Traveling with {bookingData.passengers.length} passengers.</p>
                </div>
                <div style={styles.discountCircle}>
                    {calculateDiscount() * 100}% OFF
                </div>
            </div>
          </div>
          
          <div style={styles.actionRow}>
            <button style={styles.ghostBtn} onClick={prevStep}>← Back</button>
            <button style={styles.primaryBtn} disabled={!bookingData.homestayId} onClick={nextStep}>Review & Checkout →</button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <div style={styles.stepContentFade}>
          <h3 style={styles.stepHeader}>Finalize Booking</h3>
          <div style={styles.invoiceCard}>
             <h4 style={{margin: '0 0 20px 0', color: '#4b5563', letterSpacing: '1px', textTransform: 'uppercase'}}>Order Summary</h4>
             
             <div style={styles.invoiceRow}>
               <span style={{color: '#6b7280'}}>Base Travel Fare ({bookingData.passengers.length} passengers):</span> 
               <span style={{fontWeight: '500'}}>₹{bookingData.basePrice * bookingData.passengers.length}</span>
             </div>
             
             <div style={styles.invoiceRow}>
               <span style={{color: '#6b7280'}}>Homestay Base Fare:</span> 
               <span style={{fontWeight: '500'}}>₹{bookingData.homestaysList.find(h => (h.id || h.name) === bookingData.homestayId)?.pricePerNight || bookingData.homestaysList.find(h => (h.id || h.name) === bookingData.homestayId)?.price || 0}</span>
             </div>

             <div style={{...styles.invoiceRow, color: '#10b981', background: '#ecfdf5', padding: '10px', borderRadius: '8px', marginTop: '10px'}}>
               <span>Group Discount ({calculateDiscount() * 100}%):</span> 
               <span style={{fontWeight: 'bold'}}>- ₹{(bookingData.basePrice * bookingData.passengers.length) * calculateDiscount()}</span>
             </div>
             
             <div style={{...styles.invoiceRow, fontSize: '22px', fontWeight: 'bold', borderTop: '2px dashed #d1d5db', paddingTop: '20px', marginTop: '20px'}}>
               <span>Total Payable:</span>
               <span style={{color: '#2563eb'}}>₹{((bookingData.basePrice * bookingData.passengers.length) * (1 - calculateDiscount())) + (bookingData.homestaysList.find(h => (h.id || h.name) === bookingData.homestayId)?.pricePerNight || bookingData.homestaysList.find(h => (h.id || h.name) === bookingData.homestayId)?.price || 0)}</span>
             </div>
          </div>

          <div style={{marginTop: '30px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
            <label style={{display: 'block', marginBottom: '15px', fontWeight: 'bold', color: '#111827', fontSize: '18px'}}>Select Payment Method</label>
            <select style={{...styles.selectInput, marginBottom: '20px'}} value={bookingData.paymentType} onChange={e => setBookingData({...bookingData, paymentType: e.target.value})}>
              <option value="UPI">Secure UPI Server</option>
              <option value="Card">Credit/Debit Gateway</option>
            </select>

            {/* Dynamic Payment Details */}
            {bookingData.paymentType === 'UPI' && (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '12px'}}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="UPI QR" style={{width: '150px', height: '150px', marginBottom: '15px'}} />
                    <p style={{color: '#4b5563', margin: '0 0 10px 0'}}>Scan with any UPI App to Pay</p>
                    <input type="text" placeholder="Enter 12-digit UTR Transaction ID" style={{...styles.inputLarge, textAlign: 'center'}} />
                </div>
            )}

            {bookingData.paymentType === 'Card' && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#f8fafc', padding: '20px', borderRadius: '12px'}}>
                    <div style={{gridColumn: '1 / -1'}}>
                        <input type="text" placeholder="Card Number (XXXX XXXX XXXX XXXX)" style={styles.inputLarge} />
                    </div>
                    <div>
                        <input type="text" placeholder="Expiry (MM/YY)" style={styles.inputLarge} />
                    </div>
                    <div>
                        <input type="text" placeholder="CVV" style={styles.inputLarge} />
                    </div>
                    <div style={{gridColumn: '1 / -1'}}>
                        <input type="text" placeholder="Name on Card" style={styles.inputLarge} />
                    </div>
                </div>
            )}
          </div>

          <div style={styles.actionRow}>
            <button style={styles.ghostBtn} onClick={prevStep}>← Back</button>
            <button style={styles.checkoutBtn} onClick={() => {
                const homestaySelection = bookingData.homestaysList.find(h => (h.id || h.name) === bookingData.homestayId);
                const homestayPrice = homestaySelection?.pricePerNight || homestaySelection?.price || 0;
                const totalAmt = ((bookingData.basePrice * bookingData.passengers.length) * (1 - calculateDiscount())) + homestayPrice;
                const completeBooking = {
                    bookingId: Math.floor(Math.random() * 10000) + 1000,
                    status: "PAID",
                    busId: bookingData.busId,
                    passengers: bookingData.passengers.length,
                    paymentType: bookingData.paymentType,
                    totalAmount: totalAmt,
                    bookingDate: new Date().toISOString().split('T')[0]
                };
                localStorage.setItem("lastBooking", JSON.stringify(completeBooking));
                nextStep();
            }}>
              Confirm & Pay Securely 🔒
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Success & Invoice */}
      {step === 5 && (
          <div style={{textAlign: 'center', padding: '40px 20px', animation: 'fadeIn 0.5s ease-out'}}>
              <div style={{width: '80px', height: '80px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px auto', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'}}>
                  ✓
              </div>
              <h2 style={{fontSize: '32px', color: '#111827', marginBottom: '10px'}}>Payment Successful!</h2>
              <p style={{color: '#4b5563', fontSize: '18px', marginBottom: '30px'}}>Your Adventure Tours and Travells has been booked and a bus seat has been successfully secured through pessimistic locking.</p>
              
              <button style={styles.primaryBtnLarge} onClick={() => window.location.href = '/invoice'}>
                  Download Official Invoice 📥
              </button>
          </div>
      )}
    </div>
  );
};

// -- STYLING OBJECTS FOR VANILLA CSS --
const styles = {
  wizardContainer: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    marginTop: '20px',
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif'
  },
  wizardTitle: {
    textAlign: 'center',
    background: '-webkit-linear-gradient(45deg, #2563eb, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '40px',
    fontSize: '32px',
    fontWeight: '800'
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
    position: 'relative'
  },
  progressActive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#2563eb'
  },
  progressPassed: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#10b981'
  },
  progressInactive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#9ca3af'
  },
  stepCircle: (isActive, isPassed) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
    background: isActive ? '#2563eb' : (isPassed ? '#10b981' : '#d1d5db'),
    boxShadow: isActive ? '0 0 0 4px #bfdbfe' : 'none',
    transition: 'all 0.3s'
  }),
  stepContentFade: {
    animation: 'fadeIn 0.4s ease-in-out'
  },
  stepHeader: {
    marginBottom: '20px',
    color: '#111827',
    fontSize: '24px',
    fontWeight: '700'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  imageCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    height: '250px',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
    padding: '20px',
    color: 'white'
  },
  overlayTitle: {
    margin: '0 0 10px 0',
    fontSize: '22px',
    fontWeight: 'bold'
  },
  overlayDetails: {
    display: 'flex',
    gap: '10px'
  },
  pillBadge: {
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600'
  },
  detailCard: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #f3f4f6',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)'
  },
  detailCoverImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover'
  },
  detailBody: {
    padding: '30px'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px'
  },
  tag: {
    background: '#eff6ff',
    color: '#1d4ed8',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginTop: '10px'
  },
  galleryImg: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '12px'
  },
  inputLarge: {
    width: '100%',
    maxWidth: '400px',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '18px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputSmall: {
    flex: '1',
    minWidth: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    outline: 'none',
    background: 'white'
  },
  busCard: {
    border: '2px solid #f3f4f6',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'white'
  },
  busCardSelected: {
    border: '2px solid #3b82f6',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    background: '#eff6ff',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
  },
  busImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover'
  },
  statusAvailable: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: '14px'
  },
  statusWaitlist: {
    color: '#f59e0b',
    fontWeight: '600',
    fontSize: '14px'
  },
  card: {
    border: '2px solid #f3f4f6',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'white',
    transition: 'all 0.2s'
  },
  cardSelected: {
    border: '2px solid #10b981',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    background: '#ecfdf5',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)'
  },
  stayImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  discountBox: {
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    borderRadius: '16px',
    padding: '25px',
    marginTop: '30px',
    border: '1px solid #bfdbfe'
  },
  discountCircle: {
    background: 'linear-gradient(45deg, #10b981, #34d399)',
    color: 'white',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
  },
  invoiceCard: {
    background: '#f8fafc',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  },
  invoiceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
    fontSize: '16px'
  },
  selectInput: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    fontSize: '16px',
    background: 'white',
    cursor: 'pointer'
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #f3f4f6'
  },
  ghostBtn: {
    background: 'transparent',
    color: '#6b7280',
    border: 'none',
    padding: '12px 16px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  primaryBtn: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
  },
  primaryBtnLarge: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 8px 15px rgba(37, 99, 235, 0.2)'
  },
  checkoutBtn: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '0 8px 15px rgba(16, 185, 129, 0.3)'
  }
};

// Simple global style for keyframes to prevent errors
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);

export default BookingWizard;
