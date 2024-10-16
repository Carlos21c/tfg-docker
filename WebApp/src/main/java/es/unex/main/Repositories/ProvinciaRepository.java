package es.unex.main.Repositories;


import es.unex.main.Model.Provincia;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvinciaRepository extends CrudRepository<Provincia, Integer> {

    Provincia findByNombreProvincia(String nombre);

    Provincia findByCodigoProvincia(int codigo);
}
