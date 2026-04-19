package com.tourist.tourist_management.controller;

import com.opencsv.CSVWriter;
import com.tourist.tourist_management.model.Booking;
import com.tourist.tourist_management.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/report")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/sales")
    public List<Map<String, Object>> getSalesData() {
        List<Booking> bookings = bookingRepository.findAll();
        Map<String, Double> salesByMonth = new HashMap<>();

        for (Booking b : bookings) {
            if (b.getBookingDate() != null) {
                // assume format YYYY-MM-DD
                String[] parts = b.getBookingDate().split("-");
                if (parts.length >= 2) {
                    String month = parts[1]; // simplified month logic
                    try {
                        int m = Integer.parseInt(month);
                        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
                        if (m >= 1 && m <= 12) {
                            String monthName = months[m - 1];
                            double amt = b.getTotalAmount() != null ? b.getTotalAmount() : 0.0;
                            salesByMonth.put(monthName, salesByMonth.getOrDefault(monthName, 0.0) + amt);
                        }
                    } catch (NumberFormatException e) {
                        // ignore
                    }
                }
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Double> entry : salesByMonth.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", entry.getKey());
            map.put("total", entry.getValue());
            result.add(map);
        }
        return result;
    }

    @GetMapping("/csv")
    public ResponseEntity<Resource> downloadCSV() throws IOException {
        List<Booking> bookings = bookingRepository.findAll();
        File file = File.createTempFile("sales_report", ".csv");
        
        try (CSVWriter writer = new CSVWriter(new FileWriter(file))) {
            String[] header = {"Booking ID", "Date", "Status", "Total Amount"};
            writer.writeNext(header);
            
            for (Booking b : bookings) {
                String[] data = {
                    String.valueOf(b.getBookingId()),
                    b.getBookingDate(),
                    b.getStatus(),
                    String.valueOf(b.getTotalAmount() != null ? b.getTotalAmount() : 0.0)
                };
                writer.writeNext(data);
            }
        }

        FileSystemResource resource = new FileSystemResource(file);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"sales_report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }
}
