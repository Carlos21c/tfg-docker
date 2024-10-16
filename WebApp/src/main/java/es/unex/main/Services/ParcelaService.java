package es.unex.main.Services;

import es.unex.main.Model.Parcela;
import es.unex.main.Repositories.ParcelaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ParcelaService {

    @Autowired
    private ParcelaRepository parcelaRepository;

    public void saveParcela(String coordenadasString, Parcela parcela){
        this.parcelaRepository.insertarParcela(parcela.getCodSigpac(), parcela.getCodigoPoblacion(), parcela.getCodigoProvincia(), coordenadasString, parcela.getDescripcion(), parcela.getDniPropietario(), parcela.getEsRegadio(), parcela.getExtension(), parcela.getRefCatastral());
    }
    public void updateParcela(String codSigpac, String coordenadasString, Parcela parcela){
        this.parcelaRepository.updateParcela(codSigpac, parcela.getCodSigpac(), parcela.getCodigoPoblacion(), parcela.getCodigoProvincia(), coordenadasString, parcela.getDescripcion(), parcela.getDniPropietario(), parcela.getEsRegadio(), parcela.getExtension(), parcela.getRefCatastral());
    }
    public boolean deleteByCodSigpac(String codSigpac){
        try{
            Parcela parcela = this.parcelaRepository.findByCodSigpac(codSigpac);
            this.parcelaRepository.delete(parcela);
            return true;
        }catch (Exception e){
            return false;
        }
    }
    public ArrayList<Parcela> getAll(){
        return (ArrayList<Parcela>) this.parcelaRepository.findAll();
    }
    public Parcela getByCodSigpac(String codSigpac){
        return this.parcelaRepository.findByCodSigpac(codSigpac);
    }
    public ArrayList<Parcela> getUserParcelas(String dni){
        return this.parcelaRepository.findByDniPropietario(dni);
    }
    public ArrayList<Parcela> getPoblacionParcelas(int codigoPoblacion){
        return this.parcelaRepository.findByCodigoPoblacion(codigoPoblacion);
    }
}
