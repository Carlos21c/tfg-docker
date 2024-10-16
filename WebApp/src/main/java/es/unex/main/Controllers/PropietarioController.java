package es.unex.main.Controllers;

import es.unex.main.Model.Propietario;
import es.unex.main.Services.JwtUtilService;
import es.unex.main.Services.PropietarioService;
import es.unex.main.dto.AuthRequestDto;
import es.unex.main.dto.AuthResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api")
public class PropietarioController {
    @Autowired
    private PropietarioService propietarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtilService jwtUtilService;

    @PutMapping(path = "/update/{dni}")
    public void updateParcela(@PathVariable("dni")String dni, @RequestBody Propietario propietario){
        this.propietarioService.update(dni, propietario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> auth(@RequestBody AuthRequestDto authRequestDto) {
        try {
            // 1. Authenticate the user
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authRequestDto.getEmail(), authRequestDto.getPassword()
            ));

            // 2. Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequestDto.getEmail());
            Propietario propietario = propietarioService.findByEmail(authRequestDto.getEmail());

            // 3. Generate JWT token
            String jwt = jwtUtilService.generateToken(userDetails);

            // 4. Create response
            AuthResponseDto authResponseDto = new AuthResponseDto();
            authResponseDto.setToken(jwt);
            authResponseDto.setDniPropietario(propietario.getDniPropietario());

            return ResponseEntity.ok(authResponseDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error Authentication: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public Propietario crear(@RequestBody Propietario propietario) {
        return propietarioService.guardarPropietario(propietario);
    }

    @GetMapping("/dni/{dni}")
    public Propietario getByDni(@PathVariable("dni")String dni){
        return this.propietarioService.findByDniPropietario(dni);
    }


    @GetMapping("/email/{email}")
    public Propietario getByEmail(@PathVariable("email")String email){
        return this.propietarioService.findByEmail(email);
    }

    @DeleteMapping("/{dni}")
    public Boolean eliminar(@PathVariable("dni") String dni) {
        return propietarioService.eliminarPorDni(dni);
    }
}

