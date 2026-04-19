package com.tourist.tourist_management.controller;

import com.tourist.tourist_management.model.TourPackage;
import com.tourist.tourist_management.service.TourPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/package")
@CrossOrigin(origins = "http://localhost:3000")
public class TourPackageController {

    @Autowired
    private TourPackageService service;

    // ✅ Admin adds package
    @PostMapping("/add")
    public TourPackage addPackage(@RequestBody TourPackage pkg) {
        return service.addPackage(pkg);
    }

    @GetMapping("/all")
    public List<TourPackage> getAllPackages() {
        return service.getAllPackages();
    }

    // ✅ Admin deletes package
    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable Long id) {
        service.deletePackage(id);
    }
}
