package com.example.weather.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.NOT_FOUND)
public class WeatherException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;

	public WeatherException(String msg) {
		super(msg);
	}
}
