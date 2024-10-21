package es.unex.main.Repositories;

import es.unex.main.Model.Parcela;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface ParcelaRepository  extends CrudRepository<Parcela, Integer>    {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO parcelas (codsigpac, codigopoblacion, codigoprovincia, coordenadasparcela, descripcion, dnipropietario, esregadio, extension, refcat) " +
            "VALUES (:codSigpac, :codigoPoblacion, :codigoProvincia, ST_GeomFromGeoJSON(:coordenadasString), :descripcion, :dniPropietario, :esRegadio, :extension, :refCatastral)", nativeQuery = true)
    void insertarParcela(@Param("codSigpac") String codSigpac,
                         @Param("codigoPoblacion") int codigoPoblacion,
                         @Param("codigoProvincia") int codigoProvincia,
                         @Param("coordenadasString") String coordenadasString,
                         @Param("descripcion") String descripcion,
                         @Param("dniPropietario") String dniPropietario,
                         @Param("esRegadio") boolean esRegadio,
                         @Param("extension") float extension,
                         @Param("refCatastral") String refCatastral);

    @Modifying
    @Transactional
    @Query(value = "UPDATE parcelas SET codsigpac = :newCodSigpac, codigopoblacion = :codigoPoblacion, codigoprovincia = :codigoProvincia, " +
            "coordenadasparcela = ST_GeomFromGeoJSON(:coordenadasString), descripcion = :descripcion," +
            "dnipropietario = :dniPropietario, esregadio = :esRegadio, extension = :extension, refcat = :refCatastral " +
            "WHERE codsigpac = :codSigpac", nativeQuery = true)
    void updateParcela(@Param("codSigpac") String codSigpac,
                       @Param("newCodSigpac") String newCodSigpac,
                       @Param("codigoPoblacion") int codigoPoblacion,
                       @Param("codigoProvincia") int codigoProvincia,
                       @Param("coordenadasString") String coordenadasString,
                       @Param("descripcion")String descripcion,
                       @Param("dniPropietario") String dniPropietario,
                       @Param("esRegadio") boolean esRegadio,
                       @Param("extension") float extension,
                       @Param("refCatastral") String refCatastral);


    Parcela findByCodSigpac(String codSigpac);

    Parcela findByRefCatastral(String refCatastral);

    ArrayList<Parcela> findByDniPropietario(String dniPropietario);

    ArrayList<Parcela> findByCodigoPoblacion(int codigoPoblacion);
}
