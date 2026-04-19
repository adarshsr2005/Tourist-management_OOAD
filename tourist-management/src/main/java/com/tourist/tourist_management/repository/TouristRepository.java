package com.tourist.tourist_management.repository;

import com.tourist.tourist_management.model.Tourist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TouristRepository extends JpaRepository<Tourist, Long> {
    Optional<Tourist> findByEmailAndPassword(String email, String password);
}

