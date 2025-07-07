package com.reflex.inventario.provider.dto;


import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProviderResDTO {
    private Integer id;
    private String name;
    private Long phone;
    private String address;
    private String email;
}
