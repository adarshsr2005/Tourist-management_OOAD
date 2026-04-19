package com.tourist.tourist_management.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long busId;

    @Column(name = "bus_number")
    private String busNumber;

    @Column(name = "capacity")
    private int capacity;

    @Column(name = "available")
    private boolean available;

    @ElementCollection
    @CollectionTable(name = "bus_exterior_images", joinColumns = @JoinColumn(name = "bus_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> exteriorImages;

    @ElementCollection
    @CollectionTable(name = "bus_interior_images", joinColumns = @JoinColumn(name = "bus_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> interiorImages;

    private String specifications;
    
    private double basePrice;
    
    private String status; // e.g. AVAILABLE, WAITING_LIST, DEPLOYED

    // ✅ GETTERS & SETTERS

    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public List<String> getExteriorImages() { return exteriorImages; }
    public void setExteriorImages(List<String> exteriorImages) { this.exteriorImages = exteriorImages; }

    public List<String> getInteriorImages() { return interiorImages; }
    public void setInteriorImages(List<String> interiorImages) { this.interiorImages = interiorImages; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}