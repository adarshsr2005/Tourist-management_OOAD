package com.tourist.tourist_management.controller;

import com.tourist.tourist_management.model.Booking;
import com.tourist.tourist_management.model.BookingRequest;
import com.tourist.tourist_management.service.BookingFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private BookingFacade bookingFacade;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingFacade.createCompleteBooking(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment failed: " + e.getMessage());
        }
    }
}
