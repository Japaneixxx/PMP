package com.japaneixxx.pmp;

import com.japaneixxx.pmp.model.Prescricao;
import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import com.japaneixxx.pmp.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalTime;
import java.util.Arrays;

@SpringBootApplication
public class PmpApplication implements CommandLineRunner {
    @Autowired
    private UsuarioService us;
    @Autowired
    private CLI cli;

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(PmpApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.run(args);
    }
    @Override
    public void run(String... args) throws Exception{

//        Usuario usuario = new Usuario("Japa");
//        UsuarioService us = new UsuarioService();
//        Usuario usuario = us.criarUsuario("Japa");
        Usuario usuario = us.getUsuarioById("Japa");

//        Prescricao prescricao1 = new Prescricao("Paracetamol", "1 Comprimido", 12, LocalTime.of(14,00));
//        Prescricao prescricao2 = new Prescricao("Dorflex", "1 Comprimido", 6, LocalTime.of(14,00));
//
//        us.addPrescricao(usuario.getId(), prescricao1);
//        us.addPrescricao(usuario.getId(), prescricao2);

//        CLI cli = new CLI();
        cli.displayMenu(usuario);
//        System.out.println(Arrays.toString(usuario.getPrescricoes()));
//        usuario.changeStatus(0, false);

//        System.out.println(Arrays.toString(usuario.getPrescricoes()));
    }

}
