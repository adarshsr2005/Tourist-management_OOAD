package com.tourist.tourist_management.repository;

import com.tourist.tourist_management.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findAll();
}
