package com.tourist.tourist_management.model;

import com.tourist.tourist_management.observer.Observer;

public class Notification implements Observer {

    @Override
    public void update(String message) {
        System.out.println("Notification: " + message);
    }
}
