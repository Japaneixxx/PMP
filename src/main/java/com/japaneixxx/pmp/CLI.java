package com.japaneixxx.pmp;

import com.japaneixxx.pmp.model.Prescricao;
import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import com.japaneixxx.pmp.service.UsuarioService;
import com.japaneixxx.pmp.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;
import java.util.Scanner;

@Component
public class CLI {

    @Autowired
    private UsuarioService us;

    public void displayMenu(Usuario usuario) {
        boolean running = true;
        Scanner sc = new Scanner(System.in);

        while (running) {
            if (usuario == null) {
                System.out.println("Usuario inexistente");
                running = false;
            } else {
                Util.cleanConsole();
                System.out.println("Bem-vindo "+usuario.getNome()+", ao PMP - Prontuario Medico Pessoal");
                System.out.println("1. Adicionar nova prescrição de medicamento");
                System.out.println("2. Visualizar minhas prescrições de medicamentos");
                System.out.println("3. Marcar prescrição como finalizada/não finalizada");
                System.out.println("4. Sair");
                System.out.print("Escolha uma opção: ");
                int choice = sc.nextInt();
                List<Prescricao> prescricoes = us.getPrescricoes(usuario.getId());
                sc.nextLine();
                switch (choice) {
                    case 1:
                        System.out.println("Insira o Nome do remedio");
                        String remedio = sc.nextLine();
                        System.out.println("Insira a Dosagem do remedio");
                        String dosagem = sc.nextLine();
                        System.out.println("Insira o Intervalo entre uma dosagem e outra");
                        int intervalo = sc.nextInt();
                        System.out.println("Insira o horario da primeira dosagem (Horas e Minutos)");
                        int hora = sc.nextInt();
                        int minuto = sc.nextInt();
                        System.out.println(hora + ":" + minuto);
                        LocalTime horarioInicio = LocalTime.of(hora, minuto);
                        us.addPrescricao(usuario.getId(), new Prescricao(remedio, dosagem, intervalo, horarioInicio));
//                        usuario.addPrescricao(usuario,new Prescricao(remedio, dosagem, intervalo, horarioInicio));

                        break;
                    case 2:


                        for (int i = 0; i < prescricoes.size(); i++){
                            Util.cleanConsole();
                            System.out.println("-------" +(i+1)+"/"+prescricoes.size()+"-------\n");
//                            usuario.visualizarPrescricao(i);

                            System.out.println(
                          "> Nome: " + prescricoes.get(i).getRemedio() + "\n"
                        + "> Dosagem: " + prescricoes.get(i).getDosagem()+ "\n"
                        + "> Intervalo: " + prescricoes.get(i).getIntervalo() + "\n"
                        + "> Horario de Inicio: " + prescricoes.get(i).getHorarioInicio() + "\n"
                        + "> Continua tomando: " + prescricoes.get(i).getAtivo() + "\n"
        );

                            System.out.println("-------" +(i+1)+"/"+prescricoes.size()+"-------");
                            System.out.println("Pressione ENTER para a pagina seguinte ou voltar ao menu principal");
                            sc.nextLine();
                        }
                        break;
                    case 3:
                        Util.cleanConsole();
                        System.out.println("Voce deseja marcar como");
                        System.out.println("1. Finalizada");
                        System.out.println("2. Não Finalizada");
                        int choiceFinalizada = sc.nextInt();
                        int q=0;

                        if (choiceFinalizada == 1){
                            Util.cleanConsole();
                            for (int i = 0; i < prescricoes.size(); i++){
                                if (prescricoes.get(i).getAtivo()){
                                    System.out.println((i+1) +". "+ prescricoes.get(i).getRemedio());
                                    q++;
                                }
                            }
                            if (q>0){
                                System.out.println(prescricoes.size() + 1 +". Voltar ao menu principal");
                                System.out.println("Qual deseja marcar como finalizada");
                                int r = sc.nextInt();
                                if (r <= prescricoes.size()){
                                us.changeStatus(usuario.getId(), (r-1), false);
                                }
                            }
                        } else if (choiceFinalizada == 2){
                            Util.cleanConsole();
                            for (int i = 0; i < prescricoes.size(); i++){
                                if (!prescricoes.get(i).getAtivo()){
                                    System.out.println((i+1) +". "+ prescricoes.get(i).getRemedio());
                                    q++;
                                }
                            }
                            if (q>0){
                                System.out.println("Qual deseja marcar como não finalizada");
                                int r = sc.nextInt();
                                if (r <= prescricoes.size()){
                                    us.changeStatus(usuario.getId(),(r-1), true);
                                }
                            }
                        } else {
                            Util.cleanConsole();
                            System.out.println("Opção inválida");
                            sc.nextLine();
                        }
                        break;
                    case 4:
                        running = false;
                        break;
                    default:
                        System.out.println("Opção inválida. Tente novamente.");
                }
            }
        }
    }
}
