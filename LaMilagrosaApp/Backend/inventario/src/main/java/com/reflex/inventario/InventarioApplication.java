package com.reflex.inventario;

import com.reflex.inventario.role.Role;
import com.reflex.inventario.role.RoleName;
import com.reflex.inventario.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class InventarioApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventarioApplication.class, args);
	}

	@Bean
	public CommandLineRunner runner(
			RoleRepository roleRepository
	){
		return args -> {
			if(roleRepository.findByName(RoleName.EMPLOYEE).isEmpty()) {
				roleRepository.save(Role.builder().name(RoleName.EMPLOYEE).build());
			}
		};
	}
}
