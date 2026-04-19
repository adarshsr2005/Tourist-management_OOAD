package com.tourist.tourist_management.model;

import jakarta.persistence.*;

@Entity
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String destination;
    private double price;
    private int duration;

    // Getters & Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getDestination() { return destination; }

    public void setDestination(String destination) { this.destination = destination; }

    public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    public int getDuration() { return duration; }

    public void setDuration(int duration) { this.duration = duration; }

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Homestay> homestays;

    @ElementCollection
    @CollectionTable(name = "tour_package_images", joinColumns = @JoinColumn(name = "tour_package_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private java.util.List<String> famousPlacesImages;

    public java.util.List<Homestay> getHomestays() { return homestays; }

    public void setHomestays(java.util.List<Homestay> homestays) { this.homestays = homestays; }

    public java.util.List<String> getFamousPlacesImages() { return famousPlacesImages; }

    public void setFamousPlacesImages(java.util.List<String> famousPlacesImages) { this.famousPlacesImages = famousPlacesImages; }
}