package com.swarparikshan.deepfake.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class PythonModelService {
    
    @Value("${python.service.url:http://localhost:5000}")
    private String pythonServiceUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public PythonModelService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    public JsonNode predict(MultipartFile file) throws IOException {
        // Create temporary file
        Path tempFile = Files.createTempFile("audio_", ".wav");
        Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
        
        try {
            // Prepare multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("audio", new FileSystemResource(tempFile.toFile()));
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = 
                new HttpEntity<>(body, headers);
            
            // Call Python service
            ResponseEntity<String> response = restTemplate.exchange(
                pythonServiceUrl + "/predict",
                HttpMethod.POST,
                requestEntity,
                String.class
            );
            
            // Parse response
            return objectMapper.readTree(response.getBody());
            
        } finally {
            // Clean up temporary file
            Files.deleteIfExists(tempFile);
        }
    }
    
    public boolean isServiceHealthy() {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                pythonServiceUrl + "/health",
                String.class
            );
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }
}
