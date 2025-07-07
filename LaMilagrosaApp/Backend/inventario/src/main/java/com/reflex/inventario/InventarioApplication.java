package com.reflex.inventario;

import com.reflex.inventario.provider.Provider;
import com.reflex.inventario.provider.ProviderRepository;
import com.reflex.inventario.role.Role;
import com.reflex.inventario.role.RoleName;
import com.reflex.inventario.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class InventarioApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventarioApplication.class, args);
	}

	@Bean
	public CommandLineRunner runner(
			RoleRepository roleRepository,
			ProviderRepository providerRepository
	){
		return args -> {
			if(roleRepository.findByName(RoleName.EMPLOYEE).isEmpty()) {
				roleRepository.save(Role.builder().name(RoleName.EMPLOYEE).build());
			}
			if(roleRepository.findByName(RoleName.ADMIN).isEmpty()) {
				roleRepository.save(Role.builder().name(RoleName.ADMIN).build());
			}
			var provider = Provider.builder()
					.name("Proveedor Ejemplo")
					.phone(3124567890L)
					.address("Calle 123 #45-67")
					.email("proveedor@ejemplo.com")
					.build();
			providerRepository.save(provider);
		};

	}
}
