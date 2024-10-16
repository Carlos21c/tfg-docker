package es.unex.main.Controllers;

import es.unex.main.Model.Provincia;
import es.unex.main.Services.ProvinciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/provincias")
public class ProvinciaController {
    @Autowired
    private ProvinciaService provinciaService;

    @GetMapping
    public List<Provincia> getAll(){
        return this.provinciaService.getAll();
    }

    @GetMapping(path="/{nombre}")
    public Provincia obtenerNombre(@PathVariable("nombre")String nombre){
        return this.provinciaService.getByNombre(nombre);
    }

    @GetMapping(path="/cod/{codigo}")
    public Provincia obtenerCodigo(@PathVariable("codigo")int codigo){
        return this.provinciaService.getByCodigo(codigo);
    }
}
