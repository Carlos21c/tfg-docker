package es.unex.main.Model;

import jakarta.persistence.*;

@Entity
@Table(name="poblaciones")
public class Poblacion {
    @Id
    @Column(name="codigomunicipio")
    private int codigoMunicipio;
    @Column(name="nombrepoblacion")
    private String nombrePoblacion;
    @Column(name="codigoprovincia")
    private int codigoProvincia;
    public int getCodigoMunicipio() {
        return codigoMunicipio;
    }

    public void setCodigoMunicipio(int codigoMunicipio) {
        this.codigoMunicipio = codigoMunicipio;
    }

    public String getNombrePoblacion() {
        return nombrePoblacion;
    }

    public void setNombrePoblacion(String nombrePoblacion) {
        this.nombrePoblacion = nombrePoblacion;
    }

    public int getCodigoProvincia() {
        return codigoProvincia;
    }

    public void setCodigoProvincia(int codigoProvincia) {
        this.codigoProvincia = codigoProvincia;
    }
}
