package com.prenatal.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "¡El Sistema Predictivo de IA está en línea y funcionando correctamente!";
    }
}
