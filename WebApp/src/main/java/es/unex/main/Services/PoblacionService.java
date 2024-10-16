package es.unex.main.Services;

import es.unex.main.Model.Poblacion;
import es.unex.main.Repositories.PoblacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class PoblacionService {

    @Autowired
    private PoblacionRepository poblacionRepository;

    public Poblacion getByName(String nombre, int codProvincia){
        return this.poblacionRepository.findByNombrePoblacion(nombre, codProvincia);
    }

    public Poblacion getByCods(int codMun, int codProv){
        return this.poblacionRepository.getByCodMunCodProv(codMun, codProv);
    }

    public ArrayList<Poblacion> getByProvincia(int codigoProvincia){
        return this.poblacionRepository.findByCodigoProvincia(codigoProvincia);
    }
}
