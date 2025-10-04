package com.example.demo.models;

import lombok.*;

@Data
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CurrencyRate {
    private String currency;
    private String code;
    private double mid;
}
