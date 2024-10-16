package es.unex.main.Controllers;

import es.unex.main.Model.Poblacion;
import es.unex.main.Services.PoblacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/poblaciones")
public class PoblacionController {
    @Autowired
    private PoblacionService poblacionService;

    @GetMapping("/nombre/{nombre}/{idProvincia}")
    public Poblacion obtenerPoblacionPorNombre(@PathVariable("nombre") String nombre, @PathVariable("idProvincia") int codProvincia){
        return this.poblacionService.getByName(nombre, codProvincia);
    }

    @GetMapping("/id/{id}/{prov}")
    public Poblacion obtenerPoblacionId(@PathVariable("id") int id, @PathVariable("prov") int prov){
        return this.poblacionService.getByCods(id, prov);
    }

    @GetMapping("/prov/{codigo}")
    public ArrayList<Poblacion> obtenerProvincia(@PathVariable("codigo") int codigo){
        return this.poblacionService.getByProvincia(codigo);
    }
}
