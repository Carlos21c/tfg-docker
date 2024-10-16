package es.unex.main.Services;

import es.unex.main.Model.Cultivo;
import es.unex.main.Repositories.CultivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CultivoService {

    @Autowired
    private CultivoRepository cultivoRepository;


    public Cultivo saveCultivo(Cultivo cultivo){
        return this.cultivoRepository.save(cultivo);
    }
    public void updateCultivo(String codSigpac, int year, Cultivo cultivo){
        this.cultivoRepository.updateCultivo(codSigpac, year, cultivo.getCodSigpac(), cultivo.getYear(), cultivo.getVariedad(), cultivo.getTipoCultivo(), cultivo.getDescripcion(), cultivo.getDatos());
    }

    public void eliminarFichero(String codSigpac, int year){
        this.cultivoRepository.eliminarDatos(codSigpac, year);
    }

    public boolean delete(String codSigpac, int year){
        try{
            Cultivo cultivo = getCultivo(codSigpac, year);
            cultivoRepository.delete(cultivo);
            return true;
        }catch (Exception e){
            return false;
        }
    }
    public Cultivo getCultivo(String codSigpac, int year){
        return this.cultivoRepository.findByCodSigpacYear(codSigpac, year);
    }
    public ArrayList<Cultivo> getCultivosParcela(String codSigpac){
        return this.cultivoRepository.findByCodSigpac(codSigpac);
    }
    public ArrayList<Cultivo> getAll(){
        return (ArrayList<Cultivo>) this.cultivoRepository.findAll();
    }
    public ArrayList<Cultivo> getByYear(int year, String dniPropietario){
        return this.cultivoRepository.findByYear(year, dniPropietario);
    }
    public ArrayList<Cultivo> getByRange(int year, String dniPropietario){
        return this.cultivoRepository.findByRange(year, dniPropietario);
    }
    public ArrayList<Cultivo> getByType(String tipo, String dniPropietario){
        return this.cultivoRepository.findByType(tipo, dniPropietario);
    }
    public ArrayList<Cultivo> getByPropietario(String dni){
        return this.cultivoRepository.obtenerCultivosPropietario(dni);
    }
    public ArrayList<Cultivo> compararTipo(String tipo, Integer provincia, Integer poblacion,
                                           Integer yearS, Integer yearE, String codSigpac,
                                           Integer year, Double distancia, Double longitude,
                                           Double latitude) {
        List<String> codSigpacList = null;
        if (longitude != null && latitude != null && distancia != null) {
            codSigpacList = cultivoRepository.compararDistancia(longitude, latitude, distancia);
        }
        return cultivoRepository.compararTipo(codSigpacList, tipo, provincia, poblacion, yearS, yearE, codSigpac, year);
    }

    public Object[] encontrarCentro(String codSigpac){
        return this.cultivoRepository.encontrarCentro(codSigpac);
    }

}
