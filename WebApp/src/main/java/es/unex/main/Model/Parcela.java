package es.unex.main.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.locationtech.jts.geom.Geometry;

@Entity
@Table(name="parcelas")
public class Parcela {

    @Column(name="codsigpac")
    private String codSigpac;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idparcela")
    private int idParcela;
    @Column(name="refcat")
    private String refCatastral;
    @Column(name="dnipropietario")
    private String dniPropietario;
    @Column(name="codigopoblacion")
    private int codigoPoblacion;
    @Column(name="codigoprovincia")
    private int codigoProvincia;
    @Column(name="esregadio")
    private boolean esRegadio;
    @Column(name = "extension")
    private float extension;
    @Column(name = "descripcion")
    private String descripcion;
    @JsonIgnore
    @Column(name = "coordenadasparcela", columnDefinition = "Geometry")
    private Geometry coordenadasParcela;
    @Transient
    private String coordenadasString;

    public String getCoordenadasString() {
        return coordenadasString;
    }
    public void setCoordenadasString(String coordenadasString) {
        this.coordenadasString = coordenadasString;
    }
    public Geometry getCoordenadasParcela() {
        return coordenadasParcela;
    }
    public void setCoordenadasParcela(Geometry coordenadasParcela) {
        this.coordenadasParcela = coordenadasParcela;
    }

    public Parcela () {
        super();
    }
    public String getCodSigpac() {
        return codSigpac;
    }
    public void setCodSigpac(String codSigpac) {
        this.codSigpac = codSigpac;
    }
    public long getIdParcela() {
        return idParcela;
    }
    public void setIdParcela(int idParcela) {
        this.idParcela = idParcela;
    }
    public String getRefCatastral() {
        return refCatastral;
    }
    public void setRefCatastral(String refCatastral) {
        this.refCatastral = refCatastral;
    }
    public String getDniPropietario() {
        return dniPropietario;
    }
    public void setDniPropietario(String dniPropietario) {
        this.dniPropietario = dniPropietario;
    }
    public int getCodigoPoblacion() {
        return codigoPoblacion;
    }
    public void setCodigoPoblacion(int codigoPoblacion) { this.codigoPoblacion = codigoPoblacion; }
    public int getCodigoProvincia() {
        return codigoProvincia;
    }
    public void setCodigoProvincia(int codigoProvincia) {
        this.codigoProvincia = codigoProvincia;
    }
    public boolean getEsRegadio() {
        return esRegadio;
    }
    public void setEsRegadio(boolean esRegadio) {
        this.esRegadio = esRegadio;
    }
    public float getExtension() {
        return extension;
    }
    public void setExtension(float extension) {
        this.extension = extension;
    }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) {  this.descripcion = descripcion;  }
}