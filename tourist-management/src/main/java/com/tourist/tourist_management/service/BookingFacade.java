package com.tourist.tourist_management.service;

import com.tourist.tourist_management.factory.PaymentFactory;
import com.tourist.tourist_management.model.Booking;
import com.tourist.tourist_management.model.BookingRequest;
import com.tourist.tourist_management.model.Bus;
import com.tourist.tourist_management.model.Notification;
import com.tourist.tourist_management.model.Passenger;
import com.tourist.tourist_management.observer.Subject;
import com.tourist.tourist_management.repository.BookingRepository;
import com.tourist.tourist_management.repository.BusRepository;
import com.tourist.tourist_management.repository.PassengerRepository;
import com.tourist.tourist_management.strategy.DiscountStrategy;
import com.tourist.tourist_management.strategy.PaymentStrategy;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingFacade {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private DiscountStrategy discountStrategy;

    @Transactional
    public Booking createCompleteBooking(BookingRequest request) {
        // 1. Check Bus Details with Pessimistic Lock for Race Conditions
        Bus bus = busRepository.findByIdForUpdate(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        int passengerCount = request.getPassengers().size();
        
        // 2. Waitlist logic
        boolean isWaitlist = false;
        if (bus.getCapacity() < passengerCount) {
            isWaitlist = true;
        } else {
            // Decrease capacity and save bus
            bus.setCapacity(bus.getCapacity() - passengerCount);
            if (bus.getCapacity() == 0) {
                bus.setStatus("DEPLOYED");
            }
            busRepository.save(bus);
        }

        // 3. Discount logic
        double totalAmount = request.getBasePrice() * passengerCount;
        double discount = discountStrategy.calculateDiscount(passengerCount, totalAmount);
        totalAmount = totalAmount - discount;

        // 4. Payment (Strategy + Factory)
        PaymentStrategy strategy = PaymentFactory.getStrategy(request.getPaymentType());
        if (strategy != null) {
            strategy.pay(totalAmount);
        }

        // 5. Create Booking
        Booking booking = new Booking();
        if (isWaitlist) {
            booking.setStatus("WAITING_LIST");
            booking.setExpectedReturnDate("Pending Bus Return"); // Simple placeholder
        } else {
            booking.setStatus("PAID");
        }
        
        booking.setBookingDate(java.time.LocalDate.now().toString());
        booking.setTotalAmount(totalAmount);
        booking.setHomestayId(request.getHomestayId());

        // Link passengers to booking
        if (request.getPassengers() != null) {
            List<Passenger> passengers = request.getPassengers();
            for (Passenger p : passengers) {
                p.setBooking(booking);
            }
            booking.setPassengers(passengers);
        }

        Booking savedBooking = bookingRepository.save(booking);

        // 6. Notification (Observer)
        Subject subject = new Subject();
        Notification notification = new Notification();
        subject.addObserver(notification);
        subject.notifyObservers("Booking " + booking.getStatus() + " with ID: " + savedBooking.getBookingId() + " amount: " + totalAmount);

        return savedBooking;
    }
}