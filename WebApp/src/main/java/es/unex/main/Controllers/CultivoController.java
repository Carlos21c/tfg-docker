package es.unex.main.Controllers;

import es.unex.main.Model.Cultivo;
import es.unex.main.Repositories.TiposRepository;
import es.unex.main.Services.CultivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
@RestController
@RequestMapping("/cultivos")
public class CultivoController {

    @Autowired
    private CultivoService cultivoService;

    @Autowired
    private TiposRepository tiposRepository;

    @PostMapping
    public Cultivo guardarCultivo(@RequestBody Cultivo cultivo) {
        return this.cultivoService.saveCultivo(cultivo);
    }
    @PutMapping(path = "/{codigo}/{year}")
    public void updateCultivo(@PathVariable("codigo") String codSigpac, @PathVariable("year") int year, @RequestBody Cultivo cultivo){
        this.cultivoService.updateCultivo(codSigpac, year, cultivo);
    }
    @PutMapping(path = "/deleteFile/{cod}/{year}")
    public void eliminarFichero(@PathVariable("cod")String codSigpac, @PathVariable("year")int year){
        this.cultivoService.eliminarFichero(codSigpac, year);
    }
    @DeleteMapping(path = "/delete/{codigo}/{year}")
    public boolean eliminarCultivo(@PathVariable("codigo") String codSigpac, @PathVariable("year") int year){
        return this.cultivoService.delete(codSigpac, year);
    }
    @GetMapping(path = "/{codigo}/{year}")
    public Cultivo getCultivo(@PathVariable("codigo") String codSigpac, @PathVariable("year") int year){
        return this.cultivoService.getCultivo(codSigpac, year);
    }
    @GetMapping
    public ArrayList<Cultivo> obtenerCultivos(){
        return (ArrayList<Cultivo>) this.cultivoService.getAll();
    }
    @GetMapping(path = "/year/{year}/{dni}")
    public ArrayList<Cultivo> obtenerPorYear(@PathVariable("year") int year, @PathVariable("dni")String dni){
        return this.cultivoService.getByYear(year, dni);
    }
    @GetMapping(path = "/range/{year}/{dni}")
    public ArrayList<Cultivo> obtenerCultivosRecientes(@PathVariable("year") int year, @PathVariable("dni")String dni){
        return this.cultivoService.getByRange(year, dni);
    }
    @GetMapping(path = "/type/{tipo}/{dni}")
    public ArrayList<Cultivo> obtenerCultivosTipo(@PathVariable("tipo") String tipo, @PathVariable("dni")String dni){
        return this.cultivoService.getByType(tipo, dni);
    }
    @GetMapping(path= "/propietario/{dni}")
    public ArrayList<Cultivo> obtenerCultivosPropietario(@PathVariable("dni") String dni){
        return this.cultivoService.getByPropietario(dni);
    }
    @GetMapping(path="/cultivo/{cod}")
    public ArrayList<Cultivo> obtenerCultivosParcela(@PathVariable("cod") String codSigpac){
        return this.cultivoService.getCultivosParcela(codSigpac);
    }
    @GetMapping(path = "/tipo")
    public ArrayList<String> tipos(){
        return this.tiposRepository.obtenerTipos();
    }
    @GetMapping(path = "/comparator")
    public ArrayList<Cultivo> compararTipos(@RequestParam(required = false) String tipo, @RequestParam(required = false) Integer provincia,
                                            @RequestParam(required = false) Integer poblacion, @RequestParam(required = false) Integer yearS,
                                            @RequestParam(required = false) Integer yearE, @RequestParam(required = false)String codSigpac,
                                            @RequestParam(required = false) Integer year, @RequestParam(required = false) Double distancia,
                                            @RequestParam(required = false) Double longitude, @RequestParam(required = false) Double latitude){

        return this.cultivoService.compararTipo(tipo, provincia, poblacion, yearS, yearE, codSigpac, year, distancia, longitude, latitude);
    }
    @GetMapping(path="/centro/{cod}")
    public Object[] encontrarCentro(@PathVariable("cod")String codSigpac){
        return this.cultivoService.encontrarCentro(codSigpac);
    }
}
