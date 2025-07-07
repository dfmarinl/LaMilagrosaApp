import React from 'react';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingBag, 
  Truck, 
  BarChart3, 
  User,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const { user } = useAuth();

  const userMenuItems = [
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'mis-pedidos', label: 'Mis Pedidos', icon: ShoppingBag },
  ];

  const employeeMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
    { id: 'proveedores', label: 'Proveedores', icon: Truck },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  ];

  const menuItems = user?.role === 'employee' ? employeeMenuItems : userMenuItems;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-0
      `}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {user?.role === 'employee' ? 'Panel Admin' : 'Mi Cuenta'}
            </h2>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors
                  ${activeSection === item.id ? 'bg-red-50 text-red-600 border-r-2 border-red-600' : 'text-gray-700'}
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;