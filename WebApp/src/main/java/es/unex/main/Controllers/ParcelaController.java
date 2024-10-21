package es.unex.main.Controllers;

import es.unex.main.Model.Parcela;
import es.unex.main.Services.ParcelaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/parcelas")
public class ParcelaController {
    @Autowired
    private ParcelaService parcelaService;

    @PostMapping(path = "/addParcela")
    public void guardarParcela(@RequestBody Parcela parcela) {
        this.parcelaService.saveParcela(parcela.getCoordenadasString(), parcela);
    }
    @PutMapping(path = "/{codigo}")
    public void updateParcela(@PathVariable("codigo") String codSigpac, @RequestBody Parcela parcela){
        this.parcelaService.updateParcela(codSigpac, parcela.getCoordenadasString(), parcela);
    }
    @DeleteMapping (path = "/delete/{codigo}")
    public Boolean eliminarPorCodSigpac(@PathVariable("codigo") String codSigpac){
        return this.parcelaService.deleteByCodSigpac(codSigpac);
    }
    @GetMapping
    public ArrayList<Parcela> obtenerParcelas(){
        return (ArrayList<Parcela>) this.parcelaService.getAll();
    }
    @GetMapping(path = "/cod/{codSigpac}")
    public Parcela obtenerPorCodSigpac(@PathVariable("codSigpac") String codSigpac){
        return this.parcelaService.getByCodSigpac(codSigpac);
    }
    @GetMapping(path = "/ref/{referencia}")
    public Parcela obtenerPorrefCatastral(@PathVariable("referencia") String refCatastral){
        return this.parcelaService.getByRefCatastral(refCatastral);
    }
    @GetMapping(path = "/usuario/{dni}")
    public ArrayList<Parcela> obtenerParcelasUsuario(@PathVariable("dni") String dni){
        return this.parcelaService.getUserParcelas(dni);
    }
    @GetMapping(path = "/pob/{idPob}")
    public ArrayList<Parcela> obtenerParcelasPoblacion(@PathVariable("idPob") int idPoblacion){
        return this.parcelaService.getPoblacionParcelas(idPoblacion);
    }
}
