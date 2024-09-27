package com.example.weather.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.weather.Model.Weather;
import com.example.weather.Repository.WeatherRepository;

@Service
public class WeatherService {

    @Autowired
    private WeatherRepository weatherRepository;

    @Value("${weather.api.key}")
    private String API_KEY; 

    public Weather fetchWeatherFromAPI(String city) {
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=metric";
        RestTemplate restTemplate = new RestTemplate();
        WeatherResponse response;

        try {
            response = restTemplate.getForObject(url, WeatherResponse.class);
        } catch (Exception e) {
           
            return null;
        }

        if (response != null && response.getMain() != null && response.getWeather() != null && response.getWeather().length > 0) {
            Weather weather = new Weather();
            weather.setCityName(response.getName());
            weather.setTemperature(response.getMain().getTemp());
            weather.setDescription(response.getWeather()[0].getDescription());
            weather.setHumidity(response.getMain().getHumidity());
            weather.setWindSpeed(response.getWind().getSpeed());
            return weatherRepository.save(weather);
        }
        return null;
    }

    public Weather getWeatherByCity(String city) {
        return fetchWeatherFromAPI(city); // Calls the existing method
    }
    
    public Weather saveWeather(Weather weather) {
        return weatherRepository.save(weather); 
    }

    private static class WeatherResponse {
        private String name;
        private Main main;
        private WeatherInfo[] weather;
        private Wind wind;

        // Getters and Setters

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Main getMain() {
            return main;
        }

        public void setMain(Main main) {
            this.main = main;
        }

        public WeatherInfo[] getWeather() {
            return weather;
        }

        public void setWeather(WeatherInfo[] weather) {
            this.weather = weather;
        }

        public Wind getWind() {
            return wind;
        }

        public void setWind(Wind wind) {
            this.wind = wind;
        }
    }

    private static class Main {
        private double temp;
        private int humidity;

        public double getTemp() {
            return temp;
        }

        public void setTemp(double temp) {
            this.temp = temp;
        }

        public int getHumidity() {
            return humidity;
        }

        public void setHumidity(int humidity) {
            this.humidity = humidity;
        }
    }

    private static class Wind {
        private double speed;

        public double getSpeed() {
            return speed;
        }

        public void setSpeed(double speed) {
            this.speed = speed;
        }
    }

    private static class WeatherInfo {
        private String description;

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}
