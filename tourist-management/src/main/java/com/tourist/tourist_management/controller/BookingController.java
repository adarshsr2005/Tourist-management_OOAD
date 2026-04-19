package com.tourist.tourist_management.controller;

import com.tourist.tourist_management.model.Booking;
import com.tourist.tourist_management.model.Bus;
import com.tourist.tourist_management.repository.BookingRepository;
import com.tourist.tourist_management.repository.BusRepository;
import com.tourist.tourist_management.service.BookingFacade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingFacade facade;

    @Autowired
    private BookingRepository repository;

    @Autowired
    private BusRepository busRepository;

    // GET all bookings
    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return repository.findAll();
    }



    // ADMIN approve
    @PutMapping("/approve/{id}")
    public Booking approveBooking(@PathVariable Long id) {

        Booking booking = repository.findById(id).orElse(null);

        if (booking != null) {
            if ("PAID".equals(booking.getStatus())) {
                booking.setStatus("APPROVED");
                Booking savedBooking = repository.save(booking);

                com.tourist.tourist_management.observer.Subject subject = new com.tourist.tourist_management.observer.Subject();
                com.tourist.tourist_management.model.Notification notification = new com.tourist.tourist_management.model.Notification();
                subject.addObserver(notification);
                subject.notifyObservers("Booking APPROVED by Admin. ID: " + id);

                return savedBooking;
            } else {
                throw new RuntimeException("Payment not completed!");
            }
        }

        return null;
    }

    // AGENT assign bus
    @PutMapping("/assign-bus/{id}")
    public Booking assignBus(@PathVariable Long id, @RequestParam Long busId) {

        Booking booking = repository.findById(id).orElse(null);
        Bus bus = busRepository.findById(busId).orElse(null);

        if (booking != null && bus != null && "APPROVED".equals(booking.getStatus())) {
            booking.setStatus("CONFIRMED");
            return repository.save(booking);
        }

        return null;
    }
}