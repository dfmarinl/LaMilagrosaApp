package com.reflex.inventario.provider.service.impl;

import com.reflex.inventario.provider.Provider;
import com.reflex.inventario.provider.ProviderMapper;
import com.reflex.inventario.provider.ProviderRepository;
import com.reflex.inventario.provider.dto.ProviderReqDTO;
import com.reflex.inventario.provider.dto.ProviderResDTO;
import com.reflex.inventario.provider.service.ProviderService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;
    private final ProviderMapper providerMapper;

    @Override
    public ProviderResDTO getProviderById(Integer id) {
        Optional<Provider> provider = providerRepository.findById(id);
        if(provider.isEmpty()) {
            throw new EntityNotFoundException("EL proveedor con el id " + id + " no existe.");
        }
        return providerMapper.providerToDTO(provider.get());
    }

    @Override
    public Set<ProviderResDTO> getProviders() {
        return providerRepository.findAll().stream()
                .map(providerMapper::providerToDTO)
                .collect(Collectors.toSet());
    }

    @Override
    public ProviderResDTO addProvider(ProviderReqDTO providerReqDTO) {
        Provider newProvider = providerMapper.dtoToProvider(providerReqDTO);
        Provider savedProvider =  providerRepository.save(newProvider);
        return providerMapper.providerToDTO(savedProvider);
    }

    @Override
    public ProviderResDTO updateProvider(Integer id, ProviderReqDTO providerReqDTO) {
        Optional<Provider> provider = providerRepository.findById(id);
        if(provider.isEmpty()) {
            throw new EntityNotFoundException("EL proveedor con el id " + id + " no existe.");
        }
        Provider updatedProvider =  provider.get();
        updatedProvider.setName(providerReqDTO.getName());
        updatedProvider.setAddress(providerReqDTO.getAddress());
        updatedProvider.setPhone(providerReqDTO.getPhone());
        updatedProvider.setEmail(providerReqDTO.getEmail());
        providerRepository.save(updatedProvider);
        return providerMapper.providerToDTO(updatedProvider);
    }

    @Override
    public void deleteProvider(Integer id) {
        providerRepository.deleteById(id);
    }
}
