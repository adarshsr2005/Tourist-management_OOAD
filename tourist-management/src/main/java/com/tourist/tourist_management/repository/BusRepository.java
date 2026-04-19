package com.tourist.tourist_management.repository;

import com.tourist.tourist_management.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface BusRepository extends JpaRepository<Bus, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Bus b WHERE b.busId = :id")
    Optional<Bus> findByIdForUpdate(@Param("id") Long id);
}