package com.example.weather.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.weather.Model.Weather;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Long> {
//    Weather findByCityName(String cityName);
}
