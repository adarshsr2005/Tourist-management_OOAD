package com.tourist.tourist_management.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RoleInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        // Skip CORS preflight requests
        if (request.getMethod().equals("OPTIONS")) return true;

        String uri = request.getRequestURI();
        
        // Public endpoints
        if (uri.startsWith("/tourist/login") || uri.startsWith("/tourist/register")) {
            return true; 
        }

        String role = request.getHeader("X-User-Role");

        // Example Role Checks
        if (uri.startsWith("/admin") || uri.startsWith("/report")) {
            if ("ROLE_ADMIN".equals(role) || "ADMIN".equals(role)) return true;
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        if (uri.startsWith("/agent")) {
            if ("ROLE_AGENT".equals(role) || "AGENT".equals(role) || "ROLE_ADMIN".equals(role) || "ADMIN".equals(role)) return true;
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        // Tourist endpoints
        if (uri.startsWith("/booking") || uri.startsWith("/payment") || uri.startsWith("/package")) {
            if ("ROLE_TOURIST".equals(role) || "TOURIST".equals(role) || "ROLE_ADMIN".equals(role) || "ADMIN".equals(role) || "ROLE_AGENT".equals(role) || "AGENT".equals(role)) return true;
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }

        // Any other endpoints fallback
        return true; 
    }
}
