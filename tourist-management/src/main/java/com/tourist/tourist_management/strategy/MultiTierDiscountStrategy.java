package com.tourist.tourist_management.strategy;

import org.springframework.stereotype.Component;

@Component
public class MultiTierDiscountStrategy implements DiscountStrategy {

    @Override
    public double calculateDiscount(int passengerCount, double totalAmount) {
        if (passengerCount > 10) {
            return totalAmount * 0.15; // 15% discount
        } else if (passengerCount > 5) {
            return totalAmount * 0.10; // 10% discount
        }
        return 0.0; // no discount
    }
}
