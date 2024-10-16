package es.unex.main.Repositories;

import es.unex.main.Model.Propietario;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface PropietarioRepository extends CrudRepository<Propietario, Integer> {

    @Transactional
    @Modifying
    @Query("UPDATE Propietario p SET p.dniPropietario = :newDniPropietairo, p.nombre = :nombre, p.apellidos = :apellidos, " +
            "p.email = :email, p.telefono = :telefono, p.password = :password WHERE p.dniPropietario = :dniPropietario")
    void updatePropietario(@Param("dniPropietario") String dniPropietario, @Param("newDniPropietairo") String newDniPropietairo,
                           @Param("nombre") String nombre, @Param("apellidos") String apellidos,
                           @Param("email") String email, @Param("telefono") int telefono, @Param("password") String password);

    Propietario findByDniPropietario(String dniPropietario);

    Propietario findByEmail(String email);

    @Query("SELECT p FROM Propietario p WHERE p.email = :email AND p.password = :password")
    Propietario validateLogin(String email, String password);

    @Query("SELECT p FROM Propietario p WHERE p.email = :email")
    Propietario validateEmail(String email);
}
