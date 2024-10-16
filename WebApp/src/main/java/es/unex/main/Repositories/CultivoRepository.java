package es.unex.main.Repositories;

import es.unex.main.Model.Cultivo;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface CultivoRepository extends CrudRepository<Cultivo, Integer> {

    @Query("SELECT c FROM Cultivo c WHERE c.codSigpac = :codSigpac AND c.year = :year")
    Cultivo findByCodSigpacYear(@Param("codSigpac") String codSigpac, @Param("year") int year);

    @Transactional
    @Modifying
    @Query("UPDATE Cultivo c SET c.codSigpac = :newCodSigpac, c.year = :newYear, c.variedad = :variedad, c.tipoCultivo = :tipo, c.descripcion = :descripcion, c.datos = :datos WHERE c.codSigpac = :codSigpac AND c.year = :year")
    void updateCultivo(@Param("codSigpac") String codSigpac, @Param("year") int year,
                       @Param("newCodSigpac") String newCodSigpac, @Param("newYear") int newYear, @Param("variedad") String variedad, @Param("tipo") String tipo, @Param("descripcion") String descripcion, @Param("datos") String datos);

    @Transactional
    @Modifying
    @Query("UPDATE Cultivo c SET c.datos = NULL WHERE c.codSigpac = :codSigpac AND c.year = :year")
    void eliminarDatos(@Param("codSigpac") String codSigpac, @Param("year") int year);

    @Query("SELECT c FROM Cultivo c WHERE c.year = :year AND c.codSigpac IN (SELECT p.codSigpac FROM Parcela p WHERE p.dniPropietario = :dniPropietario)")
    ArrayList<Cultivo> findByYear(@Param("year") int year, @Param("dniPropietario")String dniPropietario);

    @Query("SELECT c FROM Cultivo c WHERE c.year >= :year AND c.codSigpac IN (SELECT p.codSigpac FROM Parcela p WHERE p.dniPropietario = :dniPropietario)")
    ArrayList<Cultivo> findByRange(@Param("year") int year, @Param("dniPropietario") String dniPropietario);

    @Query("SELECT c FROM Cultivo c WHERE c.tipoCultivo = :tipo AND c.codSigpac IN (SELECT p.codSigpac FROM Parcela p WHERE p.dniPropietario = :dniPropietario)")
    ArrayList<Cultivo> findByType(@Param("tipo") String tipo, @Param("dniPropietario")String dniPropietario);

    @Query("SELECT c FROM Cultivo c WHERE c.codSigpac IN (SELECT p.codSigpac FROM Parcela p WHERE p.dniPropietario = :dniPropietario)")
    ArrayList<Cultivo> obtenerCultivosPropietario(@Param("dniPropietario") String dni);

    ArrayList<Cultivo> findByCodSigpac(@Param("codSigpac") String codSigpac);

    @Query("SELECT c FROM Cultivo c " +
            "WHERE (:codSigpac IS NULL AND :year IS NULL OR NOT (c.codSigpac = :codSigpac AND c.year = :year)) " +
            "AND (:tipo IS NULL OR c.tipoCultivo = :tipo) " +
            "AND (:provincia IS NULL OR c.codSigpac IN (SELECT p.codSigpac FROM Parcela p WHERE p.codigoProvincia = :provincia)) " +
            "AND (:poblacion IS NULL OR c.codSigpac IN (SELECT p.codSigpac FROM Parcela p WHERE p.codigoPoblacion = :poblacion AND p.codigoProvincia = :provincia)) " +
            "AND (:yearS IS NULL OR c.year >= :yearS) " +
            "AND (:yearE IS NULL OR c.year <= :yearE) " +
            "AND c.datos IS NOT NULL " +
            "AND (:codSigpacList IS NULL OR c.codSigpac IN (:codSigpacList))")
    ArrayList<Cultivo> compararTipo(@Param("codSigpacList") List<String> codSigpacList, @Param("tipo")String tipo, @Param("provincia")Integer provincia, @Param("poblacion")Integer poblacion,
                                    @Param("yearS")Integer yearS, @Param("yearE")Integer yearE, @Param("codSigpac")String codSigpac,
                                    @Param("year")Integer year);

    @Query(value = "SELECT p.codSigpac " +
            "FROM parcelas p " +
            "WHERE ST_DWithin(" +
            "    ST_Transform(p.coordenadasParcela, 3857), " +
            "    ST_Transform(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 3857), " +
            "    :distancia * 1000" +
            ")", nativeQuery = true)
    List<String> compararDistancia(@Param("longitude") Double longitude,
                                             @Param("latitude") Double latitude,
                                             @Param("distancia") Double distancia);


    @Query(value = "SELECT ST_X(ST_Centroid(p.coordenadasParcela)) AS longitude, " +
            "ST_Y(ST_Centroid(p.coordenadasParcela)) AS latitude " +
            "FROM parcelas p " +
            "JOIN cultivos c ON c.codSigpac = p.codSigpac " +
            "WHERE c.codSigpac = :codSigpac " +
            "LIMIT 1", nativeQuery = true)
    Object[] encontrarCentro(@Param("codSigpac") String codSigpac);
}
