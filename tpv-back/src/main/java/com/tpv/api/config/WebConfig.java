package com.tpv.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Acepta solicitudes a todas las rutas
            .allowedOrigins("http://localhost:5000")  // Dirección de tu frontend (ajustar según tu configuración)
            .allowedOrigins("http://localhost:3000")  // Dirección de tu frontend (ajustar según tu configuración)
            .allowedOrigins("*")
            .allowedOriginPatterns("http://192.168.*.*:*", "http://10.*.*.*:*", "http://172.16.*.*:*") // Permite cualquier IP local
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }
}
