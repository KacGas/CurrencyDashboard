package com.example.demo.services;

import com.example.demo.models.CurrencyRate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class CurrencyService {
    private final WebClient webClient = WebClient.create("http://api.nbp.pl");
    private List<CurrencyRate> cachedRates;

    private List<CurrencyRate> fetchRatesFromNBP() {
        Mono<List> response = webClient.get()
                .uri("/api/exchangerates/tables/A/?format=json")
                .retrieve()
                .bodyToMono(List.class);

        List<Map<String, Object>> list = response.block();
        List<Map<String, Object>> rates = (List<Map<String, Object>>) list.get(0).get("rates");

        return rates.stream().map(r -> {
            CurrencyRate cr = new CurrencyRate();
            cr.setCode((String) r.get("code"));
            cr.setCurrency((String) r.get("currency"));
            cr.setMid(Double.parseDouble(r.get("mid").toString()));
            return cr;
        }).toList();
    }

    @Scheduled(fixedRate = 3600000) // co 1 godzine
    public void updateRates() {
        this.cachedRates = fetchRatesFromNBP();
        System.out.println("Aktualizacja kursów: " + cachedRates.size() + " pozycji");
    }

    public List<CurrencyRate> getRates() {
        if (cachedRates == null) {
            cachedRates = fetchRatesFromNBP();
        }
        return cachedRates;
    }
}
