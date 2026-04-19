package com.tourist.tourist_management.strategy;

public interface DiscountStrategy {
    double calculateDiscount(int passengerCount, double totalAmount);
}
