package com.japaneixxx.pmp.controller;

import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository,
                             PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    record AlterarSenhaRequest(String senhaAtual, String novaSenha) {}

    @PatchMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaRequest req,
                                          @AuthenticationPrincipal Usuario usuario) {
        if (!passwordEncoder.matches(req.senhaAtual(), usuario.getSenha())) {
            return ResponseEntity.badRequest().body("Senha atual incorreta");
        }
        if (req.novaSenha().length() < 6) {
            return ResponseEntity.badRequest().body("A nova senha deve ter pelo menos 6 caracteres");
        }

        usuario.setSenha(passwordEncoder.encode(req.novaSenha()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Senha alterada com sucesso");
    }
}