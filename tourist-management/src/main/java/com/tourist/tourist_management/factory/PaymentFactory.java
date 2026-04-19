package com.tourist.tourist_management.factory;

import com.tourist.tourist_management.strategy.*;

public class PaymentFactory {

    public static PaymentStrategy getStrategy(String type) {
        if (type.equalsIgnoreCase("UPI")) return new UPIStrategy();
        if (type.equalsIgnoreCase("CARD")) return new CardStrategy();
        return null;
    }
}
