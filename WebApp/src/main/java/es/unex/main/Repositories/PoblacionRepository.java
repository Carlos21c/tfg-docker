package es.unex.main.Repositories;

import es.unex.main.Model.Poblacion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface PoblacionRepository extends CrudRepository<Poblacion, Integer> {

   @Query("SELECT p FROM Poblacion p WHERE p.nombrePoblacion = :nombrePoblacion AND p.codigoProvincia = :codProvincia")
   Poblacion findByNombrePoblacion(String nombrePoblacion, int codProvincia);

   @Query("SELECT p FROM Poblacion p WHERE p.codigoMunicipio = :idPoblacion AND p.codigoProvincia = :codProvincia")
   Poblacion getByCodMunCodProv(@Param("idPoblacion") int idPoblacion,@Param("codProvincia") int codProvincia);

   ArrayList<Poblacion> findByCodigoProvincia(int codigoProvincia);

}
