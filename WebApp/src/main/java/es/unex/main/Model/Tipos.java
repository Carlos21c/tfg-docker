package es.unex.main.Model;

import jakarta.persistence.*;

@Entity
@Table(name="tipos")
public class Tipos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idtipo")
    private int idTipo;
    @Column(name="nombrecultivo")
    String nombreCultivo;
    @Column(name="codigo")
    String codigo;
}
