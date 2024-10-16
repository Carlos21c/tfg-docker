package es.unex.main.Repositories;

import es.unex.main.Model.Tipos;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface TiposRepository extends CrudRepository<Tipos, Integer> {

    @Query("SELECT t.nombreCultivo FROM Tipos t ORDER BY t.nombreCultivo ASC")
    ArrayList<String> obtenerTipos();
}
