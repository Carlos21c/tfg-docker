package es.unex.main.Model;

import jakarta.persistence.*;

@Entity
@Table(name="cultivos")
public class Cultivo {

    @Column(name="codsigpac")
    private String codSigpac;
    @Column(name="year")
    private int year;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idcultivo")
    private int idCultivo;
    @Column(name = "tipo")
    private String tipoCultivo;
    @Column(name = "variedad")
    private String variedad;
    @Column(name = "descripcion")
    private String descripcion;
    @Column(name = "datos")
    private String datos;

    public String getDatos() {
        return datos;
    }
    public void setDatos(String datos) {
        this.datos = datos;
    }

    public Cultivo() {
        super();
    }
    public String getCodSigpac() {
        return codSigpac;
    }
    public void setCodSigpac(String codSigpac) {
        this.codSigpac = codSigpac;
    }
    public int getYear() {
        return year;
    }
    public void setYear(int year) {
        this.year = year;
    }
    public int getIdCultivo() {
        return idCultivo;
    }
    public void setIdCultivo(int idCultivo) {
        this.idCultivo = idCultivo;
    }
    public String getVariedad() {
        return variedad;
    }
    public void setVariedad(String variedad) {
        this.variedad = variedad;
    }
    public String getTipoCultivo() {
        return tipoCultivo;
    }
    public void setTipoCultivo(String tipoCultivo) {
        this.tipoCultivo = tipoCultivo;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
