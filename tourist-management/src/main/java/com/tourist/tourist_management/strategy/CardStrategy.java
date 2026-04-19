package com.tourist.tourist_management.strategy;

public class CardStrategy implements PaymentStrategy {
    public void pay(double amount) {
        System.out.println("Paid using Card: " + amount);
    }
}
