package es.unex.main.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    String token;
    String dniPropietario;

    public String getDniPropietario() {
        return dniPropietario;
    }

    public void setDniPropietario(String dniPropietario) {
        this.dniPropietario = dniPropietario;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}