package com.reflex.inventario.user.service;

import com.reflex.inventario.user.dto.UserReqDTO;
import com.reflex.inventario.user.dto.UserResDTO;

import java.util.List;

public interface UserService {
    List<UserResDTO> getAllUsers();
    UserResDTO getUserById(Integer id);
    UserResDTO updateUser(Integer id, UserReqDTO dto);
    void deleteUser(Integer id);
    UserResDTO assignAdminRole(Integer id);
}
