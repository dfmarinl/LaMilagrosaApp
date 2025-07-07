package com.reflex.inventario.provider;

import com.reflex.inventario.provider.dto.ProviderReqDTO;
import com.reflex.inventario.provider.dto.ProviderResDTO;
import com.reflex.inventario.provider.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("providers")
@RequiredArgsConstructor
public class ProviderController {
    private final ProviderService providerService;

    @GetMapping("/{id}")
    public ResponseEntity<ProviderResDTO> getProviderById(@PathVariable Integer id) {
        ProviderResDTO provider = providerService.getProviderById(id);
        return ResponseEntity.ok(provider);
    }

    @GetMapping
    public ResponseEntity<Set<ProviderResDTO>> getAllProviders() {
        Set<ProviderResDTO> providers = providerService.getProviders();
        return ResponseEntity.ok(providers);
    }

    @PostMapping
    public ResponseEntity<ProviderResDTO> createProvider(@Valid @RequestBody ProviderReqDTO providerReqDTO) {
        ProviderResDTO createdProvider = providerService.addProvider(providerReqDTO);
        return ResponseEntity.ok(createdProvider);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProviderResDTO> updateProvider(
            @PathVariable Integer id,
            @Valid @RequestBody ProviderReqDTO providerReqDTO
    ) {
        ProviderResDTO updatedProvider = providerService.updateProvider(id, providerReqDTO);
        return ResponseEntity.ok(updatedProvider);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Integer id) {
        providerService.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }
}
