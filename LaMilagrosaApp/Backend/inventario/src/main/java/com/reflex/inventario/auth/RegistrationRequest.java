package com.reflex.inventario.auth;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegistrationRequest {

    @NotEmpty(message = "Fistname is mandatory")
    @NotBlank(message = "Fistname is mandatory")
    private String name;
    /*@NotEmpty(message = "lastname is mandatory")
    @NotBlank(message = "lastname is mandatory")
    private String lastname;*/
    @Email(message = "Email in not formatted")
    @NotBlank(message = "lastname is mandatory")
    @NotEmpty(message = "email is mandatory")
    private String email;
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String password;
}
