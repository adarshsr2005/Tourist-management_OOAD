package com.tourist.tourist_management.model;

import java.util.List;

public class BookingRequest {
    private Long busId;
    private double basePrice;
    private String paymentType;
    private List<Passenger> passengers;

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public List<Passenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }

    private Long homestayId;
    public Long getHomestayId() { return homestayId; }
    public void setHomestayId(Long homestayId) { this.homestayId = homestayId; }
}
