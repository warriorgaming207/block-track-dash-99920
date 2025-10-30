import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { initDemoData } from '@/utils/initDemoData';

export type UserRole = 'customer' | 'rider' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface DeliveryStep {
  label: string;
  completed: boolean;
  time: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  progress: number;
  estimatedTime: string;
  currentLocation: string;
  items: OrderItem[];
  deliverySteps: DeliveryStep[];
  riderId?: string;
  riderName?: string;
  createdAt: string;
}

export interface BlockchainTransaction {
  id: number;
  orderId: string;
  action: string;
  hash: string;
  timestamp: string;
  verified: boolean;
  riderId?: string;
}

interface DeliveryContextType {
  user: User | null;
  orders: Order[];
  transactions: BlockchainTransaction[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateOrderStatus: (orderId: string, newStatus: string, location: string) => void;
  createOrder: (customerId: string, customerName: string, items: OrderItem[]) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

const generateHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

const addBlockchainTransaction = (
  orderId: string,
  action: string,
  riderId?: string
): BlockchainTransaction => {
  const transactions = JSON.parse(localStorage.getItem('blockchain') || '[]');
  const newTransaction: BlockchainTransaction = {
    id: transactions.length + 1,
    orderId,
    action,
    hash: generateHash(),
    timestamp: new Date().toLocaleString(),
    verified: true,
    riderId,
  };
  transactions.push(newTransaction);
  localStorage.setItem('blockchain', JSON.stringify(transactions));
  return newTransaction;
};

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);

  useEffect(() => {
    // Initialize demo data
    initDemoData();
    
    const storedUser = localStorage.getItem('user');
    const storedOrders = localStorage.getItem('orders');
    const storedTransactions = localStorage.getItem('blockchain');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Initialize with demo data
      const demoOrder: Order = {
        id: 'ORD-2024-001',
        customerId: 'demo-customer',
        customerName: 'Demo Customer',
        status: 'In Transit',
        progress: 60,
        estimatedTime: '15 mins',
        currentLocation: 'Downtown Hub',
        items: [
          { name: 'Fresh Vegetables', quantity: 2 },
          { name: 'Dairy Products', quantity: 1 },
          { name: 'Snacks', quantity: 3 },
        ],
        deliverySteps: [
          { label: 'Order Placed', completed: true, time: new Date().toLocaleTimeString() },
          { label: 'Processing', completed: true, time: new Date().toLocaleTimeString() },
          { label: 'Out for Delivery', completed: true, time: new Date().toLocaleTimeString() },
          { label: 'Delivered', completed: false, time: 'Pending' },
        ],
        riderId: 'demo-rider',
        riderName: 'Demo Rider',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('orders', JSON.stringify([demoOrder]));
      setOrders([demoOrder]);

      // Initialize demo blockchain
      const demoTransactions = [
        addBlockchainTransaction('ORD-2024-001', 'Order Placed'),
        addBlockchainTransaction('ORD-2024-001', 'Payment Confirmed'),
        addBlockchainTransaction('ORD-2024-001', 'Order Processing'),
        addBlockchainTransaction('ORD-2024-001', 'Assigned to Delivery Partner', 'demo-rider'),
        addBlockchainTransaction('ORD-2024-001', 'Picked Up from Warehouse', 'demo-rider'),
        addBlockchainTransaction('ORD-2024-001', 'In Transit - Checkpoint 1', 'demo-rider'),
      ];
      setTransactions(demoTransactions);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Login successful!');
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      toast.error('Email already exists');
      return false;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  const updateOrderStatus = (orderId: string, newStatus: string, location: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          currentLocation: location,
          progress: Math.min(order.progress + 20, 100),
        };

        // Add blockchain transaction
        const transaction = addBlockchainTransaction(
          orderId,
          `Status Updated: ${newStatus}`,
          user?.id
        );
        setTransactions((prev) => [...prev, transaction]);

        toast.success('Order updated and logged to blockchain!');
        return updatedOrder;
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const createOrder = (customerId: string, customerName: string, items: OrderItem[]) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerId,
      customerName,
      status: 'Order Placed',
      progress: 0,
      estimatedTime: '30 mins',
      currentLocation: 'Processing Center',
      items,
      deliverySteps: [
        { label: 'Order Placed', completed: true, time: new Date().toLocaleTimeString() },
        { label: 'Processing', completed: false, time: 'Pending' },
        { label: 'Out for Delivery', completed: false, time: 'Pending' },
        { label: 'Delivered', completed: false, time: 'Pending' },
      ],
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    const transaction = addBlockchainTransaction(newOrder.id, 'Order Created', customerId);
    setTransactions((prev) => [...prev, transaction]);

    toast.success('Order created and logged to blockchain!');
  };

  return (
    <DeliveryContext.Provider
      value={{
        user,
        orders,
        transactions,
        login,
        signup,
        logout,
        updateOrderStatus,
        createOrder,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within DeliveryProvider');
  }
  return context;
};