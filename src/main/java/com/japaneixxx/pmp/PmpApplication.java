package com.japaneixxx.pmp;

import com.japaneixxx.pmp.model.Prescricao;
import com.japaneixxx.pmp.model.Usuario;
import org.springframework.boot.Banner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalTime;
import java.util.Arrays;

@SpringBootApplication
public class PmpApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(PmpApplication.class);
        app.setBannerMode(Banner.Mode.OFF);
        app.run(args);
    }
    @Override
    public void run(String... args) throws Exception{

        Usuario usuario = new Usuario("Japa");

        Prescricao prescricao1 = new Prescricao("Paracetamol", "1 Comprimido", 12, LocalTime.of(14,00));
        Prescricao prescricao2 = new Prescricao("Dorflex", "1 Comprimido", 6, LocalTime.of(14,00));
        usuario.addPrescricao(prescricao1);
        usuario.addPrescricao(prescricao2);

        CLI.displayMenu(usuario);
//        System.out.println(Arrays.toString(usuario.getPrescricoes()));
//        usuario.changeStatus(0, false);

//        System.out.println(Arrays.toString(usuario.getPrescricoes()));
    }

}
