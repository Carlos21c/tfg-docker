package es.unex.main.Services;

import es.unex.main.Model.Provincia;
import es.unex.main.Repositories.ProvinciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProvinciaService {

    @Autowired
    private ProvinciaRepository provinciaRepository;

    public List<Provincia> getAll(){
        return (ArrayList<Provincia>) this.provinciaRepository.findAll();
    }

    public Provincia getByNombre(String nombre){
        return this.provinciaRepository.findByNombreProvincia(nombre);
    }

    public Provincia getByCodigo(int codigo){
        return this.provinciaRepository.findByCodigoProvincia(codigo);
    }
}
