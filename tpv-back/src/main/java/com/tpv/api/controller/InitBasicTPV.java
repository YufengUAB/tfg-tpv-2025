package com.tpv.api.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpv.api.entity.Categoria;
import com.tpv.api.entity.Producto;
import com.tpv.api.service.CategoriaServiceImpl;
import com.tpv.api.service.ProductoServiceImpl;

@RestController
@RequestMapping("/api/v1/basicTPV")
public class InitBasicTPV {

    @Autowired
    private CategoriaServiceImpl categoriaService;

    @Autowired
    private ProductoServiceImpl productoService;

    @GetMapping("/initTPV")
    public String initTPV() {

        List<Categoria> categorias = new ArrayList<>();

        categorias.add(new Categoria("Bebidas"));
        categorias.add(new Categoria("Tapas Calientes"));
        categorias.add(new Categoria("Tapas Frias"));
        categorias.add(new Categoria("Bocatas Calientes"));
        categorias.add(new Categoria("Bocatas Frios"));
        categorias.add(new Categoria("Platos Combinados"));
        categorias.add(new Categoria("Llescas Calientes"));
        categorias.add(new Categoria("Llescas Frios"));
        categorias.add(new Categoria("Ofertas"));
        categorias.add(new Categoria("Cubatas"));

        categorias.forEach(categoria -> {
            categoriaService.save(categoria);
        });

        List<Producto> productos = new ArrayList<>();

        // Agregar productos a la lista
        productos.add(new Producto("Coca-Cola", 2.50, 1, 100));
        productos.add(new Producto("Aquarius", 2.50, 1, 80));
        productos.add(new Producto("Fanta Naranja", 2.50, 1, 90));
        productos.add(new Producto("Fanta Limón", 2.50, 1, 85));
        productos.add(new Producto("Agua Mineral", 1.50, 1, 200));
        productos.add(new Producto("Cerveza Estrella", 3.00, 1, 150));
        productos.add(new Producto("Cerveza VollDamm", 3.20, 1, 120));
        productos.add(new Producto("Tónica", 2.70, 1, 70));
        productos.add(new Producto("Damm Lemon", 3.00, 1, 50));
        productos.add(new Producto("RedBull", 3.00, 1, 50));

        productos.add(new Producto("Bravas", 4.00, 2, 50));
        productos.add(new Producto("Cochinillo", 5.20, 2, 40));
        productos.add(new Producto("Pincho", 5.50, 2, 30));
        productos.add(new Producto("Patitas de Calamar", 3.80, 2, 25));
        productos.add(new Producto("Patatas Fritas", 4.00, 2, 35));
        productos.add(new Producto("Sepia", 7.00, 2, 45));
        productos.add(new Producto("Croquetas", 5.60, 2, 60));
        productos.add(new Producto("Chocos", 7.50, 2, 50));
        productos.add(new Producto("Boquerones Fritos", 9.40, 2, 30));
        productos.add(new Producto("Calamares a la Romana", 7.20, 2, 80));

        productos.add(new Producto("Ensaladilla Rusa", 2.80, 3, 40));
        productos.add(new Producto("Queso", 3.00, 3, 30));
        productos.add(new Producto("Aceitunas", 2.50, 3, 70));
        productos.add(new Producto("Anchoas", 3.50, 3, 25));
        productos.add(new Producto("Boquerones en Vinagre", 7.00, 3, 20));
        productos.add(new Producto("Jamon Iberico", 7.50, 3, 15));

        productos.add(new Producto("Bocata de Bacon", 4.50, 4, 30));
        productos.add(new Producto("Bocata de Lomo", 4.80, 4, 25));
        productos.add(new Producto("Bocata de Chorizo", 4.50, 4, 20));
        productos.add(new Producto("Bocata de Jamón", 5.00, 4, 15));
        productos.add(new Producto("Bocata de Tortilla", 4.20, 4, 18));
        productos.add(new Producto("Bocata de Pollo", 4.50, 4, 22));
        productos.add(new Producto("Bocata de Atún y Queso", 5.20, 4, 10));
        productos.add(new Producto("Bocata de Panceta", 4.50, 4, 15));
        productos.add(new Producto("Bocata de Jamón Serrano", 3.50, 5, 25));
        productos.add(new Producto("Bocata de Queso Brie", 3.80, 5, 20));

        productos.add(new Producto("Bocata de Salmón", 4.50, 5, 15));
        productos.add(new Producto("Bocata de Vegetales", 3.20, 5, 18));
        productos.add(new Producto("Bocata de Atún", 3.80, 5, 22));
        productos.add(new Producto("Bocata de Sardinas", 3.50, 5, 14));

        productos.add(new Producto("Platos Combinados 1", 7.50, 6, 15));
        productos.add(new Producto("Platos Combinados 2", 9.00, 6, 10));
        productos.add(new Producto("Platos Combinados 3", 8.50, 6, 8));
        productos.add(new Producto("Platos Combinados 4", 9.20, 6, 12));
        productos.add(new Producto("Platos Combinados 5", 8.00, 6, 20));
        productos.add(new Producto("Platos Combinados 6", 15.00, 6, 5));
        productos.add(new Producto("Platos Combinados 7", 6.50, 6, 18));
        productos.add(new Producto("Platos Combinados 8", 5.50, 6, 25));
        productos.add(new Producto("Platos Combinados 9", 6.00, 6, 30));
        productos.add(new Producto("Platos Combinados 10", 5.50, 6, 20));

        productos.add(new Producto("Llesca de Jamón y Queso", 5.50, 7, 20));
        productos.add(new Producto("Llesca de Bacon y Champiñones", 6.00, 7, 18));
        productos.add(new Producto("Llesca de Atún y Pimientos", 5.80, 7, 15));
        productos.add(new Producto("Llesca de Pollo con Queso", 6.50, 7, 12));
        productos.add(new Producto("Llesca de Chorizo y Huevo", 6.20, 7, 10));
        productos.add(new Producto("Llesca de Quesos Variados", 7.00, 7, 8));
        productos.add(new Producto("Llesca de Hamburguesa", 7.50, 7, 10));
        productos.add(new Producto("Llesca de Setas", 6.00, 7, 12));
        productos.add(new Producto("Llesca de Vegetales", 5.50, 7, 14));
        productos.add(new Producto("Llesca de Anchoas", 6.80, 7, 10));

        productos.add(new Producto("Llesca de Jamón Serrano", 4.50, 8, 20));
        productos.add(new Producto("Llesca de Atún", 4.80, 8, 15));
        productos.add(new Producto("Llesca de Queso Brie", 5.20, 8, 10));
        productos.add(new Producto("Llesca de Vegetales", 4.20, 8, 18));
        productos.add(new Producto("Llesca de Salmón", 5.80, 8, 8));
        productos.add(new Producto("Llesca de Anchoas", 5.00, 8, 10));

        productos.add(new Producto("Oferta 2x1 Bebidas", 10.00, 9, 10));
        productos.add(new Producto("Menú Tapa y Bebida", 12.00, 9, 10));
        productos.add(new Producto("Combo Bocata y Bebida", 8.50, 9, 15));
        productos.add(new Producto("Descuento Familiar", 15.00, 9, 5));
        productos.add(new Producto("Pack Tapas Variadas", 20.00, 9, 8));
        productos.add(new Producto("Oferta del Día", 9.99, 9, 20));
        productos.add(new Producto("Combo Pareja", 18.50, 9, 10));
        productos.add(new Producto("Promoción 3x2 Tapas", 25.00, 9, 5));
        productos.add(new Producto("Menú Infantil", 7.50, 9, 15));
        productos.add(new Producto("Pack de Cubatas", 30.00, 9, 5));

        productos.add(new Producto("Cuba Libre", 6.00, 10, 50));
        productos.add(new Producto("Gin Tonic", 7.00, 10, 40));
        productos.add(new Producto("Mojito", 8.00, 10, 30));
        productos.add(new Producto("Caipirinha", 7.50, 10, 25));
        productos.add(new Producto("Tequila Sunrise", 7.20, 10, 20));
        productos.add(new Producto("Whisky Cola", 7.80, 10, 35));
        productos.add(new Producto("Vodka Naranja", 7.00, 10, 40));
        productos.add(new Producto("Ron y Piña", 6.80, 10, 50));
        productos.add(new Producto("Brandy Coca-Cola", 7.20, 10, 30));
        productos.add(new Producto("Cocktail de la Casa", 9.00, 10, 15));

        productos.forEach(productoUnit -> {
            productoService.save(productoUnit);
        });

        return "TPV inicializado con éxito.";
    }

}
