import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './components/Landing/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import UserDashboard from './components/User/UserDashboard';
import CartModal from './components/Cart/CartModal';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    user?.role?.toUpperCase() === 'EMPLOYEE' ? 'dashboard' : 'productos'
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {user && (
        <>
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            onCartClick={() => setIsCartOpen(true)}
          />

          <div className="flex">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            {/* Main content */}
            {/* Cambié de md:ml-60 a md:ml-48 para que el contenido se corra menos */}
            <main className="flex-1 md:ml-35 p-6 bg-gray-50 min-h-screen">
              {user?.role?.toUpperCase() === 'EMPLOYEE' ? (
                <EmployeeDashboard activeSection={activeSection} />
              ) : (
                <UserDashboard activeSection={activeSection} />
              )}
            </main>
          </div>
        </>
      )}

      {!user && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm onToggleForm={() => {}} />} />
          <Route path="/register" element={<RegisterForm onToggleForm={() => {}} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {user?.role?.toUpperCase() === 'USER' && (
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </Router>
  );
};

export default App;







