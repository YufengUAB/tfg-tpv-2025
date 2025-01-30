package com.tpv.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración global para habilitar CORS en la aplicación.
 * Define qué orígenes, métodos y cabeceras están permitidos para las solicitudes.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configura las políticas de CORS.
     * Permite solicitudes desde orígenes específicos, métodos HTTP comunes y todas las cabeceras.
     * 
     * @param registry Registro para configurar las reglas de CORS.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Aplica CORS a todas las rutas.
            .allowedOrigins("http://localhost:5000", "http://localhost:3000")  // Orígenes permitidos para desarrollo.
            .allowedOrigins("*")  // Permite cualquier origen (solo para desarrollo).
            .allowedOriginPatterns(    // Permite IPs locales
                "http://192.168.*.*:*",  
                "http://10.*.*.*:*",    
                "http://172.16.*.*:*"   
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE")  // Métodos HTTP permitidos.
            .allowedHeaders("*");  // Permite todas las cabeceras.
    }
}
