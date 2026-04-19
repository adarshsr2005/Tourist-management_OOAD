package com.tourist.tourist_management.controller;

import com.tourist.tourist_management.model.Bus;
import com.tourist.tourist_management.repository.BusRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List; // ✅ FIX

@RestController
@RequestMapping("/bus")
@CrossOrigin(origins = "http://localhost:3000")
public class BusController {

    @Autowired
    private BusRepository repository;

    @GetMapping("/all")
    public List<Bus> getAllBuses() {
        return repository.findAll();
    }

    @PostMapping("/add")
    public Bus addBus(@RequestBody Bus bus) {
        return repository.save(bus);
    }

    @DeleteMapping("/{id}")
    public void deleteBus(@PathVariable Long id) {
        repository.deleteById(id);
    }
}