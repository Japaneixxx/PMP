package com.japaneixxx.pmp.controller;

import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import com.japaneixxx.pmp.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // DTO Records (Java 17+)
    record CadastroRequest(
            @NotBlank String nome,
            @Email @NotBlank String email,
            @Size(min = 6) @NotBlank String senha,
            @NotBlank String perfil, // "MEDICO" ou "PACIENTE"
            String crm,
            String especialidade,
            String telefone
    ) {}

    record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String senha
    ) {}

    record AuthResponse(String token, UsuarioDTO usuario) {}

    record UsuarioDTO(Long id, String nome, String email, String perfil, String crm, String especialidade) {}

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastro(@Valid @RequestBody CadastroRequest req) {
        if (usuarioRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado");
        }

        var usuario = new Usuario();
        usuario.setNome(req.nome());
        usuario.setEmail(req.email());
        usuario.setSenha(passwordEncoder.encode(req.senha()));
        usuario.setPerfil(Usuario.TipoPerfil.valueOf(req.perfil()));
        usuario.setCrm(req.crm());
        usuario.setEspecialidade(req.especialidade());
        usuario.setTelefone(req.telefone());

        usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario.getEmail(), usuario.getId(), usuario.getPerfil().name());
        return ResponseEntity.ok(new AuthResponse(token, toDTO(usuario)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        var usuario = usuarioRepository.findByEmail(req.email()).orElse(null);

        if (usuario == null || !passwordEncoder.matches(req.senha(), usuario.getSenha())) {
            return ResponseEntity.status(401).body("E-mail ou senha incorretos");
        }

        String token = jwtService.gerarToken(usuario.getEmail(), usuario.getId(), usuario.getPerfil().name());
        return ResponseEntity.ok(new AuthResponse(token, toDTO(usuario)));
    }

    private UsuarioDTO toDTO(Usuario u) {
        return new UsuarioDTO(u.getId(), u.getNome(), u.getEmail(),
                u.getPerfil().name(), u.getCrm(), u.getEspecialidade());
    }
}
