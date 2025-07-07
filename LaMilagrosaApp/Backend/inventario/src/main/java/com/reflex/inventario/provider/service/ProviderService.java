package com.reflex.inventario.provider.service;

import com.reflex.inventario.product.dto.ProductReqDTO;
import com.reflex.inventario.product.dto.ProductResDTO;
import com.reflex.inventario.provider.Provider;
import com.reflex.inventario.provider.dto.ProviderReqDTO;
import com.reflex.inventario.provider.dto.ProviderResDTO;

import java.util.Set;

public interface ProviderService {
    ProviderResDTO getProviderById(Integer id);
    Set<ProviderResDTO> getProviders();
    ProviderResDTO addProvider(ProviderReqDTO providerReqDTO);
    ProviderResDTO updateProvider(Integer id ,ProviderReqDTO providerReqDTO);
    void deleteProvider(Integer id);

}
