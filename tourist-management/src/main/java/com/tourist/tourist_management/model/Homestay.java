package com.tourist.tourist_management.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Homestay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double pricePerNight;

    @ElementCollection
    @CollectionTable(name = "homestay_exterior_images", joinColumns = @JoinColumn(name = "homestay_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> exteriorImages;

    @ElementCollection
    @CollectionTable(name = "homestay_interior_images", joinColumns = @JoinColumn(name = "homestay_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> interiorImages;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_package_id")
    private TourPackage tourPackage;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(double pricePerNight) { this.pricePerNight = pricePerNight; }
    
    public List<String> getExteriorImages() { return exteriorImages; }
    public void setExteriorImages(List<String> exteriorImages) { this.exteriorImages = exteriorImages; }
    
    public List<String> getInteriorImages() { return interiorImages; }
    public void setInteriorImages(List<String> interiorImages) { this.interiorImages = interiorImages; }
    
    public TourPackage getTourPackage() { return tourPackage; }
    public void setTourPackage(TourPackage tourPackage) { this.tourPackage = tourPackage; }
}
