package com.tourist.tourist_management.strategy;

public class UPIStrategy implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid using UPI: " + amount);
    }
}
