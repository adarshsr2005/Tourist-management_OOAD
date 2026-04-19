package com.tourist.tourist_management.service;

import com.tourist.tourist_management.factory.PaymentFactory;
import com.tourist.tourist_management.model.Booking;
import com.tourist.tourist_management.model.Notification;
import com.tourist.tourist_management.observer.Subject;
import com.tourist.tourist_management.repository.BookingRepository;
import com.tourist.tourist_management.strategy.PaymentStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repository;

    public Booking createBooking(String paymentType, double amount) {

        // Strategy + Factory
        PaymentStrategy strategy = PaymentFactory.getStrategy(paymentType);
        strategy.pay(amount);

        // Create booking
        Booking booking = new Booking();
        booking.setStatus("CONFIRMED");
        booking.setBookingDate("2026-04-13");

        Booking savedBooking = repository.save(booking);

        // Observer (Notification)
        Subject subject = new Subject();
        Notification notification = new Notification();

        subject.addObserver(notification);
        subject.notifyObservers("Booking Confirmed with ID: " + savedBooking.getBookingId());

        return savedBooking;
    }
}