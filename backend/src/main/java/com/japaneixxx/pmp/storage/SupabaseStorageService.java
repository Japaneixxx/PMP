package com.japaneixxx.pmp.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final WebClient webClient;

    public SupabaseStorageService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public String uploadArquivo(MultipartFile arquivo, Long usuarioId) {
        String extensao = getExtensao(arquivo.getOriginalFilename());
        String nomeArquivo = "usuarios/" + usuarioId + "/" + UUID.randomUUID() + "." + extensao;

        try {
            webClient.post()
                    .uri(supabaseUrl + "/storage/v1/object/" + bucket + "/" + nomeArquivo)
                    .header("Authorization", "Bearer " + supabaseKey)
                    .header("apikey", supabaseKey)
                    .contentType(MediaType.parseMediaType(arquivo.getContentType()))
                    .bodyValue(arquivo.getBytes())
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + nomeArquivo;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload do arquivo: " + e.getMessage());
        }
    }

    public void deletarArquivo(String url) {
        try {
            String path = url.substring(url.indexOf(bucket + "/") + bucket.length() + 1);

            webClient.delete()
                    .uri(supabaseUrl + "/storage/v1/object/" + bucket + "/" + path)
                    .header("Authorization", "Bearer " + supabaseKey)
                    .header("apikey", supabaseKey)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
        } catch (Exception e) {
            // Log mas não lança exceção — arquivo pode não existir
            System.err.println("Erro ao deletar arquivo: " + e.getMessage());
        }
    }

    private String getExtensao(String nomeArquivo) {
        if (nomeArquivo == null || !nomeArquivo.contains(".")) return "bin";
        return nomeArquivo.substring(nomeArquivo.lastIndexOf(".") + 1).toLowerCase();
    }
}
