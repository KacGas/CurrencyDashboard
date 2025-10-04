package com.example.demo.controllers;

import com.example.demo.models.CurrencyRate;
import com.example.demo.services.CurrencyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CurrencyController {
    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping("/api/rates")
    public List<CurrencyRate> getRates() {
        return currencyService.getRates();
    }
}
