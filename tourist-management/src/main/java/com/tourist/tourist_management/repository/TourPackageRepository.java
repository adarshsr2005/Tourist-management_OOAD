package com.tourist.tourist_management.repository;

import com.tourist.tourist_management.model.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {
}