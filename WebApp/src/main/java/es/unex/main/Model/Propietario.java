package es.unex.main.Model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name="propietarios")
public class Propietario implements UserDetails{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="idpropietario")
	private int idUsuario;
	@Column(name="nombre")
	private String nombre;
	@Column(name="apellidos")
	private String apellidos;
	@Column(name="dnipropietario")
	private String dniPropietario;
	@Column(name="passw")
	private String password;
	@Transient
	private String confirmPassword;
	@Column(name="correo")
	private String email;
	@Column(name="telefono")
	private int telefono;

	public Propietario() {
		super();
	}

	public Propietario(String nombre, String apellidos, String dniPropietario, String email, String password, int telefono) {
		this.telefono = telefono;
		this.email = email;
		this.password = password;
		this.dniPropietario = dniPropietario;
		this.apellidos = apellidos;
		this.nombre = nombre;
	}

	public Integer getIdUsuario() {
		return idUsuario;
	}
	public void setIdUsuario(int idUsuario) {
		this.idUsuario = idUsuario;
	}
	public String getNombre() {
		return nombre;
	}
	public String getApellidos() { return apellidos; }
	public void setApellidos(String apellidos) { this.apellidos = apellidos; }
	public void setNombre(String nombre) { this.nombre = nombre; }
	public String getDniPropietario() {
		return dniPropietario;
	}
	public void setDniPropietario(String dniUsuario) {
		this.dniPropietario = dniUsuario;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Integer getTelefono() {
		return telefono;
	}
	public void setTelefono(int telefono) {
		this.telefono = telefono;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getConfirmPassword() { return confirmPassword; }
	public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// Asignar roles o autoridades al usuario. Puedes cambiarlo según tus necesidades.
		return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
	}
	@Override
	public String getPassword() {
		return this.password;
	}
	@Override
	public String getUsername() {
		return this.email;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}
}
