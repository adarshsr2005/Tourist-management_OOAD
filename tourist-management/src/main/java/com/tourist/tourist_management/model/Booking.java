package com.tourist.tourist_management.model;

import jakarta.persistence.*;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private String bookingDate;
    private String status; // PENDING / APPROVED / REJECTED / CONFIRMED

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    private Double totalAmount;

    @Column(name = "homestay_id")
    private Long homestayId;

    @Column(name = "expected_return_date")
    private String expectedReturnDate;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<Passenger> passengers;

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public java.util.List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(java.util.List<Passenger> passengers) {
        this.passengers = passengers;
    }

    public Long getHomestayId() { return homestayId; }
    public void setHomestayId(Long homestayId) { this.homestayId = homestayId; }

    public String getExpectedReturnDate() { return expectedReturnDate; }
    public void setExpectedReturnDate(String expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }
}