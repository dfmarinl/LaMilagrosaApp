package com.reflex.inventario.handler;

import com.reflex.inventario.handler.dto.ErrorMessage;
import com.reflex.inventario.handler.exceptions.InventoryNotFoundException;
import com.reflex.inventario.handler.exceptions.OrderNotFoundException;
import com.reflex.inventario.handler.exceptions.ProductNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler(ProductNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) //404
    public ResponseEntity<ErrorMessage> productNotFoundException(ProductNotFoundException exception) {
        ErrorMessage message = new ErrorMessage( HttpStatus.NOT_FOUND ,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }

    @ExceptionHandler(InventoryNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) //404
    public ResponseEntity<ErrorMessage> inventoryNotFoundException(InventoryNotFoundException exception) {
        ErrorMessage message = new ErrorMessage( HttpStatus.NOT_FOUND ,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) //404
    public ResponseEntity<ErrorMessage> orderNotFoundException(OrderNotFoundException exception) {
        ErrorMessage message = new ErrorMessage( HttpStatus.NOT_FOUND ,exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
    }



    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, Object> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        //return super.handleMethodArgumentNotValid(ex, headers, status, request);
    }

}
