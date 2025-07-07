package com.reflex.inventario.role;

import com.reflex.inventario.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table( name = "role")
public class Role {
    @Id
    @GeneratedValue
    private Integer id;
    @Enumerated(EnumType.STRING)
    private RoleName name;

    @ManyToMany(mappedBy = "roles",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<User> users;

}
