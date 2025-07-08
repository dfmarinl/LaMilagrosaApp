import { Product, Order, SupplierOrder } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Jamón Serrano Premium',
    description: 'Jamón serrano curado artesanalmente durante 24 meses. Sabor intenso y textura perfecta.',
    price: 45000,
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Jamones',
    stock: 25,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    expirationDate: '2025-07-10' // vence pronto
  },
  {
    id: '2',
    name: 'Chorizo Español',
    description: 'Chorizo tradicional español con especias selectas. Perfecto para aperitivos y platos principales.',
    price: 18000,
    image: 'https://images.pexels.com/photos/4958790/pexels-photo-4958790.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Embutidos',
    stock: 3, // stock crítico
    isActive: true,
    createdAt: new Date('2024-01-01'),
    expirationDate: '2025-07-05' // muy pronto a vencer
  },
  {
    id: '3',
    name: 'Queso Manchego',
    description: 'Queso manchego curado, elaborado con leche de oveja. Sabor único y textura cremosa.',
    price: 32000,
    image: 'https://images.pexels.com/photos/4109943/pexels-photo-4109943.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Quesos',
    stock: 0, // agotado
    isActive: true,
    createdAt: new Date('2024-01-01'),
    expirationDate: '2025-07-03' // vencido
  },
  {
    id: '4',
    name: 'Salchichón Ibérico',
    description: 'Salchichón ibérico de bellota, curado al natural con especias tradicionales.',
    price: 28000,
    image: 'https://images.pexels.com/photos/4958791/pexels-photo-4958791.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Embutidos',
    stock: 8, // bajo stock
    isActive: true,
    createdAt: new Date('2024-01-01'),
    expirationDate: '2025-08-15'
  },
  {
    id: '5',
    name: 'Aceitunas Gourmet',
    description: 'Aceitunas verdes y negras premium, marinadas en aceite de oliva virgen extra.',
    price: 12000,
    image: 'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Conservas',
    stock: 50,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    expirationDate: '2025-09-01'
  },
  {
    id: '6',
    name: 'Vino Tinto Reserva',
    description: 'Vino tinto reserva con denominación de origen. Maridaje perfecto para carnes curadas.',
    price: 85000,
    image: 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Vinos',
    stock: 15,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    expirationDate: '2026-01-01'
  },
];
