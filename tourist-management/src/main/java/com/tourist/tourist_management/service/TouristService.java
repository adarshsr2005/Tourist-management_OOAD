package com.tourist.tourist_management.service;

import com.tourist.tourist_management.model.Tourist;
import com.tourist.tourist_management.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TouristService {

    @Autowired
    private TouristRepository repository;

    public Tourist register(Tourist tourist) {
        if (tourist.getRole() == null || tourist.getRole().isEmpty()) {
            tourist.setRole("TOURIST"); // default
        }
        return repository.save(tourist);
    }

    public Tourist login(String email, String password) {
        return repository.findByEmailAndPassword(email, password)
                .orElse(null);
    }
}
