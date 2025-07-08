import React, { useState, useEffect } from 'react';
import {
  Search, Filter, User, Mail, Phone, MapPin,
  Plus, Edit2, Trash2, X, Save, ArrowUp
} from 'lucide-react';
import { User as UserType } from '../../types';
import * as userApi from '../../api/users';
import * as authApi from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();

  // ✅ Inicializar formData vacío por defecto
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  // ✅ Estado para forzar re-renderizado del formulario
  const [formKey, setFormKey] = useState(0);

  // ✅ Función para determinar el rol más alto (actualizada para manejar la respuesta del backend)
  const getHighestRole = (roles: string[]): string => {
    if (!roles || !Array.isArray(roles)) {
      return 'EMPLOYEE';
    }
    
    // Orden de prioridad: ADMIN > EMPLOYEE
    if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
      return 'ADMIN';
    }
    if (roles.includes('EMPLOYEE') || roles.includes('ROLE_EMPLOYEE')) {
      return 'EMPLOYEE';
    }
    
    // Si no encuentra ninguno conocido, devolver el primero o EMPLOYEE por defecto
    return roles[0] || 'EMPLOYEE';
  };

  // ✅ Función CORREGIDA para parsear el rol del usuario desde la respuesta del backend
  const parseUserRole = (user: any): string => {
    // La respuesta del backend tiene un array "roles"
    if (user.roles && Array.isArray(user.roles)) {
      return getHighestRole(user.roles);
    }
    
    // Fallback para otros formatos posibles
    if (user.authorities && Array.isArray(user.authorities)) {
      return getHighestRole(user.authorities);
    }
    
    // Si viene como campo simple (rol o role)
    const role = user.rol || user.role || 'EMPLOYEE';
    
    // Normalizar el rol removiendo prefijo ROLE_ y convirtiendo a mayúsculas
    return role.replace('ROLE_', '').toUpperCase();
  };

  // ✅ Función para verificar si el usuario es administrador
  const isAdmin = (userRole?: string): boolean => {
    const role = userRole?.toUpperCase() ?? '';
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  };

  // ✅ Función para verificar si el usuario es empleado
  const isEmployee = (userRole?: string): boolean => {
    const role = userRole?.toUpperCase() ?? '';
    return role === 'EMPLOYEE' || role === 'ROLE_EMPLOYEE';
  };

  // ✅ Filtro de usuarios corregido: búsqueda + rol
  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() ?? '';
    const email = user.email?.toLowerCase() ?? '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.includes(search) || email.includes(search);
    
    // ✅ Normalizar roles para comparación
    const userRole = user.role?.toUpperCase() ?? '';
    const matchesRole = selectedRole === 'ALL' || userRole === selectedRole;

    return matchesSearch && matchesRole;
  });

  // ✅ FUNCIÓN CORREGIDA: Abrir modal con campos vacíos para nuevo usuario
  const handleOpenModal = (user?: UserType) => {
    // Incrementar la key para forzar re-renderizado del formulario
    setFormKey(prev => prev + 1);
    
    if (user) {
      // Modo edición - llenar con datos del usuario a editar
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Contraseña siempre vacía en edición
      });
    } else {
      // Modo creación - TODOS los campos completamente vacíos
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
      });
    }
    setIsModalOpen(true);
  };

  // ✅ FUNCIÓN CORREGIDA: Cerrar modal y limpiar completamente el formulario
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    // Limpiar completamente el formulario
    setFormData({
      name: '',
      email: '',
      password: '',
    });
    // Incrementar key para forzar re-renderizado
    setFormKey(prev => prev + 1);
  };

  // ✅ Función para promover usuario a administrador
  const handlePromoteToAdmin = async (userId: string) => {
    const userToPromote = users.find(user => user.id === userId);
    
    if (!userToPromote) {
      alert('Usuario no encontrado');
      return;
    }

    if (!window.confirm(`¿Estás seguro de que quieres promover a ${userToPromote.name} a administrador?`)) {
      return;
    }

    setIsLoading(true);
    try {
      // Preparar datos según el formato que espera la API
      const promoteData = {
        nombre: userToPromote.name,
        email: userToPromote.email
      };

      await userApi.promoteUserToAdmin(userToPromote.id, promoteData);
      
      // Actualizar el usuario en la lista local
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, role: 'ADMIN' }
          : user
      ));
      
      alert(`${userToPromote.name} ha sido promovido a administrador exitosamente`);
    } catch (error: any) {
      console.error('Error al promover usuario:', error);
      
      if (error.response?.status === 400) {
        alert('Datos inválidos. Por favor, verifica la información del usuario.');
      } else {
        alert(error.message || 'Ocurrió un error al promover el usuario');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Función para actualizar usuario con petición API real
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingUser) {
        // Actualización de usuario existente
        const updatedData = {
          nombre: formData.name,
          email: formData.email,
        };

        await userApi.updateUserById(editingUser.id, updatedData);
        setUsers(users.map(user =>
          user.id === editingUser.id
            ? { ...user, name: updatedData.nombre, email: updatedData.email }
            : user
        ));
        alert('Usuario actualizado exitosamente');
      } else {
        // ✅ Registro de nuevo usuario
        const registerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        const success = await authApi.register(registerData);

        if (success) {
          alert('Usuario registrado correctamente');

          // Recargar usuarios desde el backend
          const userList = await userApi.getAllUsers();
          const parsedUsers: UserType[] = userList.map((user: any) => ({
            id: user.id?.toString() ?? '',
            name: user.nombre ?? user.name ?? 'Sin nombre',
            email: user.email ?? 'Sin correo',
            phone: user.telefono ?? '',
            address: user.direccion ?? '',
            role: parseUserRole(user), // ✅ Usar la función corregida de parseo
          }));
          setUsers(parsedUsers);
        } else {
          alert('Error al registrar usuario');
        }
      }

      handleCloseModal();
    } catch (error: any) {
      alert(error.message || 'Error al guardar el usuario');
      console.error('Error al guardar usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Eliminar usuario corregido
  const handleDelete = async (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    const isCurrentUser = userToDelete?.email === currentUser?.email;
    
    if (isCurrentUser) {
      alert('No puedes eliminar tu propia cuenta desde esta interfaz.');
      return;
    }

    // ✅ Verificar si un empleado intenta eliminar a un administrador
    const currentUserIsAdmin = isAdmin(currentUser?.role);
    const targetUserIsAdmin = isAdmin(userToDelete?.role);
    
    if (!currentUserIsAdmin && targetUserIsAdmin) {
      alert('No tienes permisos para eliminar a un administrador.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setIsLoading(true);
      try {
        await userApi.deleteUserById(userId);
        setUsers(users.filter(user => user.id !== userId));
        alert('Usuario eliminado exitosamente');
      } catch (error: any) {
        alert(error.message || 'Ocurrió un error al intentar eliminar el usuario.');
        console.error('Error en eliminación:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ✅ Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!isModalOpen) {
      // Limpiar formulario cuando se cierre el modal
      setFormData({
        name: '',
        email: '',
        password: '',
      });
      setEditingUser(null);
    }
  }, [isModalOpen]);

  // ✅ FUNCIÓN CORREGIDA: Cargar usuarios con parseo correcto del rol desde la respuesta del backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const userList = await userApi.getAllUsers();
        console.log('Respuesta del backend:', userList); // Para debugging
        
        const parsedUsers: UserType[] = userList.map((user: any) => {
          const parsedRole = parseUserRole(user);
          console.log(`Usuario: ${user.email}, Roles originales: ${JSON.stringify(user.roles)}, Rol parseado: ${parsedRole}`); // Para debugging
          
          return {
            id: user.id?.toString() ?? '',
            name: user.nombre ?? user.name ?? 'Sin nombre',
            email: user.email ?? 'Sin correo',
            phone: user.telefono ?? user.phone ?? '',
            address: user.direccion ?? user.address ?? '',
            role: parsedRole, // ✅ Usar la función corregida de parseo
          };
        });
        
        setUsers(parsedUsers);
      } catch (error: any) {
        console.error('Error al cargar los usuarios:', error.message);
        alert('Error al cargar los usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <div className="text-sm text-gray-500">
              Rol actual:{' '}
              <span className="font-semibold text-gray-800">
                {isAdmin(currentUser?.role)
                  ? 'Administrador'
                  : isEmployee(currentUser?.role)
                    ? 'Empleado'
                    : currentUser?.role || 'Desconocido'}
              </span>
            </div>
          </div>

          {/* ✅ Solo mostrar botón de nuevo usuario si es administrador */}
          {isAdmin(currentUser?.role) && (
            <button
              onClick={() => handleOpenModal()}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Usuario</span>
            </button>
          )}
        </div>

        {/* 🔍 Búsqueda y filtro */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
            >
              <option value="ALL">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="EMPLOYEE">Empleados</option>
            </select>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-gray-500 mt-2">Cargando...</p>
          </div>
        )}

        {/* 👥 Lista de usuarios */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const isCurrentUser = user.email === currentUser?.email;
              const currentUserIsAdmin = isAdmin(currentUser?.role);
              const canDelete = !isCurrentUser && !(isEmployee(currentUser?.role) && isAdmin(user.role));
              const canPromote = currentUserIsAdmin && !isAdmin(user.role) && !isCurrentUser;
              
              return (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              (Tú)
                            </span>
                          )}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isAdmin(user.role)
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isAdmin(user.role) ? 'Administrador' : 'Empleado'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {/* ✅ Botón para promover a administrador */}
                      {canPromote && (
                        <button
                          onClick={() => handlePromoteToAdmin(user.id)}
                          disabled={isLoading}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors disabled:opacity-50"
                          title="Promover a administrador"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                      )}

                      {/* ✅ Solo mostrar botón de editar si es administrador */}
                      {isAdmin(currentUser?.role) && (
                        <button
                          onClick={() => handleOpenModal(user)}
                          disabled={isLoading}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      
                      {/* ✅ Solo mostrar botón de eliminar si es administrador */}
                      {isAdmin(currentUser?.role) && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={!canDelete || isLoading}
                          className={`p-2 rounded-full transition-colors ${
                            !canDelete
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:bg-red-100'
                          }`}
                          title={
                            isCurrentUser 
                              ? 'No puedes eliminar tu propia cuenta' 
                              : !canDelete 
                                ? 'No tienes permisos para eliminar a este usuario'
                                : 'Eliminar usuario'
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios.</p>
          </div>
        )}
      </div>

      {/* Modal para crear/editar usuario - Solo para administradores */}
      {isModalOpen && isAdmin(currentUser?.role) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div key={editingUser?.id || 'new-user'} className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  key={`name-${formKey}`}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={isLoading}
                  placeholder="Ingresa el nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  key={`email-${formKey}`}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={isLoading}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              {/* ✅ Campo de contraseña solo para usuarios nuevos */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <input
                    key={`password-${formKey}`}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={isLoading}
                    placeholder="Ingresa una contraseña segura"
                  />
                </div>
              )}
              
              {/* ✅ Información sobre promoción a administrador */}
              {editingUser && !isAdmin(editingUser.role) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    💡 <strong>Nota:</strong> Para promover este usuario a administrador, usa el botón de flecha hacia arriba <ArrowUp className="inline h-4 w-4" /> en la tarjeta del usuario.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>
                    {isLoading 
                      ? 'Guardando...' 
                      : editingUser 
                        ? 'Actualizar' 
                        : 'Crear'
                    }
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

