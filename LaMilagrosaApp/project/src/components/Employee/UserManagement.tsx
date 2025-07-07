import React, { useState, useEffect } from 'react';
import {
  Search, Filter, User, Mail, Phone, MapPin,
  Plus, Edit2, Trash2, X, Save
} from 'lucide-react';
import { User as UserType } from '../../types';
import * as userApi from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'EMPLOYEE' as 'EMPLOYEE' | 'ADMIN',
  });

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

  const handleOpenModal = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'EMPLOYEE',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'EMPLOYEE',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...formData }
          : user
      ));
    } else {
      const newUser: UserType = {
        id: Date.now().toString(),
        ...formData,
      };
      setUsers([...users, newUser]);
    }

    handleCloseModal();
  };

  // ✅ Eliminar usuario corregido - comparación por email ya que currentUser no tiene id
  const handleDelete = async (userId: string) => {
    // ✅ Buscar si el usuario a eliminar tiene el mismo email que el usuario actual
    const userToDelete = users.find(user => user.id === userId);
    const isCurrentUser = userToDelete?.email === currentUser?.email;
    
    if (isCurrentUser) {
      alert('No puedes eliminar tu propia cuenta desde esta interfaz.');
      return;
    }

    // ✅ Verificar si un empleado intenta eliminar a un administrador
    const currentUserRole = (currentUser?.role || '').replace('ROLE_', '').toUpperCase();
    const targetUserRole = userToDelete?.role?.toUpperCase();
    
    if (currentUserRole === 'EMPLOYEE' && targetUserRole === 'ADMIN') {
      alert('No tienes permisos para eliminar a un administrador.');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await userApi.deleteUserById(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error: any) {
        alert(error.message || 'Ocurrió un error al intentar eliminar el usuario.');
        console.error('Error en eliminación:', error);
      }
    }
  };

  // ✅ Cargar usuarios corregido - mapeo de datos consistente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await userApi.getAllUsers();
        const parsedUsers: UserType[] = userList.map((user: any) => ({
          id: user.id?.toString() ?? '',
          // ✅ Mapear correctamente nombre/name
          name: user.nombre ?? user.name ?? 'Sin nombre',
          email: user.email ?? 'Sin correo',
          phone: user.telefono ?? user.phone ?? '',
          address: user.direccion ?? user.address ?? '',
          // ✅ Solo EMPLOYEE y ADMIN - normalizar roles que pueden venir con ROLE_ prefix
          role: (user.rol ?? user.role ?? 'EMPLOYEE').replace('ROLE_', '').toUpperCase(),
        }));
        setUsers(parsedUsers);
      } catch (error: any) {
        console.error('Error al cargar los usuarios:', error.message);
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
                {currentUser?.role === 'ROLE_EMPLOYEE' || currentUser?.role === 'EMPLOYEE'
                  ? 'Empleado'
                  : currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN'
                    ? 'Administrador'
                    : currentUser?.role || 'Desconocido'}
              </span>
            </div>
          </div>

          {(currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN') && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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

        {/* 👥 Lista de usuarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            // ✅ Verificar si es el usuario actual - comparación por email
            const isCurrentUser = user.email === currentUser?.email;
            
            // ✅ Verificar si un empleado intenta eliminar a un admin
            const currentUserRole = (currentUser?.role || '').replace('ROLE_', '').toUpperCase();
            const canDelete = !isCurrentUser && !(currentUserRole === 'EMPLOYEE' && user.role === 'ADMIN');
            
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
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={!canDelete}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios.</p>
          </div>
        )}
      </div>

      {/* Modal para crear/editar usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'EMPLOYEE' | 'ADMIN'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="EMPLOYEE">Empleado</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingUser ? 'Actualizar' : 'Crear'}</span>
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

