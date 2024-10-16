package es.unex.main.Services;

import es.unex.main.Model.Propietario;
import es.unex.main.Repositories.PropietarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PropietarioService {

    @Autowired
    private PropietarioRepository propietarioRepository;

    public Propietario findByDniPropietario(String dni){
        return this.propietarioRepository.findByDniPropietario(dni);
    }

    public void update(String dni, Propietario propietario){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        propietario.setPassword(passwordEncoder.encode(propietario.getPassword()));
        this.propietarioRepository.updatePropietario(dni, propietario.getDniPropietario(), propietario.getNombre(), propietario.getApellidos(), propietario.getEmail(), propietario.getTelefono(), propietario.getPassword());
    }

    public Propietario findByEmail(String email){
        return this.propietarioRepository.findByEmail(email);
    }

    public Propietario guardarPropietario(Propietario propietario) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        propietario.setPassword(passwordEncoder.encode(propietario.getPassword()));
        return this.propietarioRepository.save(propietario);
    }

    public boolean eliminarPorDni(String dni) {
        try {
            Propietario propietario = this.propietarioRepository.findByDniPropietario(dni);
            this.propietarioRepository.delete(propietario);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
