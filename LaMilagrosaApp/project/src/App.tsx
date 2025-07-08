// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer'; // 👈 Asegúrate de importar el Footer
import LandingPage from './components/Landing/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import UserDashboard from './components/User/UserDashboard';
import CartModal from './components/Cart/CartModal';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('ventas');
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
      {user ? (
        <div className="flex flex-col min-h-screen">
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            onCartClick={() => setIsCartOpen(true)}
          />

          <div className="flex flex-1">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            <main className="flex-1 p-6 bg-gray-50">
              <EmployeeDashboard activeSection={activeSection} />
            </main>
          </div>

          <Footer />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm onToggleForm={() => {}} />} />
          <Route path="/register" element={<RegisterForm onToggleForm={() => {}} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {user?.role?.toUpperCase() === 'USER' && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </Router>
  );
};

export default App;







