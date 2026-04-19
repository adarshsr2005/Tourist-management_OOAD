package com.tourist.tourist_management.service;

import com.tourist.tourist_management.model.TourPackage;
import com.tourist.tourist_management.repository.TourPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourPackageService {

    @Autowired
    private TourPackageRepository repository;

    public TourPackage addPackage(TourPackage pkg) {
        if (pkg.getHomestays() != null) {
            pkg.getHomestays().forEach(h -> h.setTourPackage(pkg));
        }
        return repository.save(pkg);
    }

    public List<TourPackage> getAllPackages() {
        return repository.findAll();
    }

    public void deletePackage(Long id) {
        repository.deleteById(id);
    }
}
