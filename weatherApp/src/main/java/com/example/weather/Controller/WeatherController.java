package com.example.weather.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.weather.Model.Weather;
import com.example.weather.Service.WeatherService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/{city}")
    public Map<String, Object> getWeather(@PathVariable String city) {
        Map<String, Object> response = new HashMap<>();
        Weather weather = weatherService.getWeatherByCity(city);
        if (weather != null) {
            response.put("city", weather.getCityName());
            response.put("temperature", weather.getTemperature());
            response.put("description", weather.getDescription());
            response.put("humidity", weather.getHumidity());
            response.put("windSpeed", weather.getWindSpeed());
        } else {
            response.put("message", "Weather data not found for " + city);
        }
        return response;
    }

    @PostMapping
    public Weather saveWeather(@RequestBody Weather weather) {
        return weatherService.saveWeather(weather);
    }
}

   
