package com.weatherly.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class WeatherController {

    @Value("${weather.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    @GetMapping("/api/weather")
    public String getWeather(@RequestParam String city) {

        String url = "https://api.weatherapi.com/v1/current.json"
                + "?key=" + apiKey
                + "&q=" + city;

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
    }
    @GetMapping("/api/forecast")
    public String getForecast(@RequestParam String city) {

        String url = "https://api.weatherapi.com/v1/forecast.json"
                + "?key=" + apiKey
                + "&q=" + city
                + "&days=7";

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
    }
    @GetMapping("/api/search")
    public String searchCity(@RequestParam String city) {

        String url = "https://api.weatherapi.com/v1/search.json"
                + "?key=" + apiKey
                + "&q=" + city;

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
    }
}