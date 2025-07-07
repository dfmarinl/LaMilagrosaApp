import React from 'react';
import { Store, Star, Truck, Shield, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
  const featuredProducts = [
    {
      name: 'Jamón Serrano Premium',
      price: 45000,
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Curado artesanalmente durante 24 meses'
    },
    {
      name: 'Chorizo Español',
      price: 18000,
      image: 'https://images.pexels.com/photos/4958790/pexels-photo-4958790.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Con especias tradicionales selectas'
    },
    {
      name: 'Queso Manchego',
      price: 32000,
      image: 'https://images.pexels.com/photos/4109943/pexels-photo-4109943.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Elaborado con leche de oveja'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 to-red-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="h-10 w-10 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold">Salsamentaria Gourmet</h1>
                <p className="text-red-200 text-sm">Tradición y calidad desde 1985</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onLoginClick}
                className="px-6 py-2 border border-white text-white hover:bg-white hover:text-red-800 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onRegisterClick}
                className="px-6 py-2 bg-yellow-500 text-red-900 hover:bg-yellow-400 rounded-lg transition-colors font-semibold"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 to-yellow-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                Los Mejores
                <span className="text-red-600"> Productos Gourmet</span>
                <br />
                de España
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Descubre nuestra selección premium de jamones, embutidos, quesos y vinos. 
                Productos artesanales de la más alta calidad, importados directamente desde España.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onRegisterClick}
                  className="flex items-center justify-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
                >
                  <span>Comprar Ahora</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="flex items-center justify-center space-x-2 border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-lg font-semibold">
                  <span>Ver Catálogo</span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Jamón Serrano"
                  className="rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                />
                <img
                  src="https://images.pexels.com/photos/4109943/pexels-photo-4109943.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Quesos"
                  className="rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300 mt-8"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-red-900 px-4 py-2 rounded-full font-bold shadow-lg">
                ¡Envío Gratis!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">¿Por qué elegirnos?</h3>
            <p className="text-gray-600 text-lg">Más de 35 años ofreciendo productos de la más alta calidad</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Calidad Premium</h4>
              <p className="text-gray-600">
                Productos seleccionados cuidadosamente de los mejores productores españoles
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Envío Rápido</h4>
              <p className="text-gray-600">
                Entrega en 24-48 horas en Bogotá y principales ciudades del país
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Garantía Total</h4>
              <p className="text-gray-600">
                100% de satisfacción garantizada o te devolvemos tu dinero
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Productos Destacados</h3>
            <p className="text-gray-600 text-lg">Descubre nuestros productos más populares</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h4>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
                    <button
                      onClick={onRegisterClick}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Ver Más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Lo que dicen nuestros clientes</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                comment: "La calidad de los productos es excepcional. El jamón serrano es el mejor que he probado en Colombia.",
                rating: 5
              },
              {
                name: "Carlos Rodríguez",
                comment: "Excelente servicio y productos frescos. La entrega fue muy rápida y todo llegó en perfecto estado.",
                rating: 5
              },
              {
                name: "Ana López",
                comment: "Me encanta la variedad de quesos que manejan. Siempre encuentro productos únicos y deliciosos.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="font-semibold text-gray-800">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-red-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">Contáctanos</h3>
              <p className="text-red-200 mb-8 text-lg">
                ¿Tienes alguna pregunta? Estamos aquí para ayudarte. 
                Contáctanos y te responderemos lo antes posible.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg">+57 (1) 234-5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg">info@salsamentariagourmet.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg">Calle 85 #15-32, Bogotá, Colombia</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-6">Horarios de Atención</h4>
              <div className="space-y-3 text-red-200">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span>8:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={onRegisterClick}
                  className="bg-yellow-500 text-red-900 px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold text-lg"
                >
                  ¡Únete Ahora!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Store className="h-8 w-8 text-yellow-400" />
              <div>
                <h5 className="font-bold">Salsamentaria Gourmet</h5>
                <p className="text-gray-400 text-sm">Tradición y calidad desde 1985</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2024 Salsamentaria Gourmet. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;