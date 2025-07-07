import React from 'react';
import { ShoppingCart, User, LogOut, Store, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

interface HeaderProps {
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onMenuClick }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold">Salsamentaria Gourmet</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#productos" className="hover:text-yellow-400 transition-colors">
              Productos
            </a>
            <a href="#sobre-nosotros" className="hover:text-yellow-400 transition-colors">
              Sobre Nosotros
            </a>
            <a href="#contacto" className="hover:text-yellow-400 transition-colors">
              Contacto
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user?.role === 'user' && (
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-red-700 rounded-full transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>

            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;