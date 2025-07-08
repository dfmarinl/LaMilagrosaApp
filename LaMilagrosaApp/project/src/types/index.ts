export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'employee';
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  createdAt: Date;
  deliveryAddress: string;
}

export interface SupplierOrder {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  supplierName: string;
  status: 'pending' | 'ordered' | 'received';
  createdAt: Date;
  expectedDelivery: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

