import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import LandingPage from './components/Landing/LandingPage';
import UserDashboard from './components/User/UserDashboard';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import CartModal from './components/Cart/CartModal';

function App() {
  const { user, loading } = useAuth();
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    user?.role === 'employee' ? 'dashboard' : 'productos'
  );

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  const showLogin = () => {
    setIsLoginForm(true);
    setShowAuthForm(true);
  };

  const showRegister = () => {
    setIsLoginForm(false);
    setShowAuthForm(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showAuthForm) {
      return isLoginForm ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      );
    }
    
    return (
      <LandingPage 
        onLoginClick={showLogin}
        onRegisterClick={showRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={openSidebar}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 md:ml-64 p-6">
          {user.role === 'employee' ? (
            <EmployeeDashboard activeSection={activeSection} />
          ) : (
            <UserDashboard activeSection={activeSection} />
          )}
        </main>
      </div>

      {user.role === 'user' && (
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}

export default App;