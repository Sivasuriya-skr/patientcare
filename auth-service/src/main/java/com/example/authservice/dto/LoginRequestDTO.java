package com.example.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class LoginRequestDTO {
    @NotBlank(message="Email should not be blank")
    @Email(message = "Email should be valid")
    private  String email;

    @NotBlank(message="Password is required")
    @Size(min = 8,message = "password should be min 8 char and to be strong")
    private String password;
    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password=password;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
