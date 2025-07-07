package com.reflex.inventario.provider;

import com.reflex.inventario.provider.dto.ProviderReqDTO;
import com.reflex.inventario.provider.dto.ProviderResDTO;
import org.springframework.stereotype.Component;

@Component
public class ProviderMapper {

    public ProviderResDTO providerToDTO(Provider provider) {
        return ProviderResDTO.builder()
                .id(provider.getId())
                .name(provider.getName())
                .phone(provider.getPhone())
                .address(provider.getAddress())
                .email(provider.getEmail())
                .build();
    }

    public Provider dtoToProvider(ProviderReqDTO providerReqDTO) {
        return Provider.builder()
                .name(providerReqDTO.getName())
                .phone(providerReqDTO.getPhone())
                .address(providerReqDTO.getAddress())
                .email(providerReqDTO.getEmail())
                .build();
    }
}
