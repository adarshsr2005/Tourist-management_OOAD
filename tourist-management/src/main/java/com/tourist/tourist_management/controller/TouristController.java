package com.tourist.tourist_management.controller;

import com.tourist.tourist_management.model.Tourist;
import com.tourist.tourist_management.service.TouristService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tourist")
@CrossOrigin(origins = "http://localhost:3000")
public class TouristController {

    @Autowired
    private TouristService service;

    @PostMapping("/register")
    public Tourist register(@RequestBody Tourist tourist) {
        return service.register(tourist);
    }

    @PostMapping("/login")
    public Tourist login(@RequestParam String email,
                         @RequestParam String password) {
        return service.login(email, password);
    }
}