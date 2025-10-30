// Initialize demo accounts for testing
export const initDemoData = () => {
  const existingUsers = localStorage.getItem('users');
  
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 'demo-customer',
        email: 'customer@demo.com',
        password: 'customer123',
        name: 'Demo Customer',
        role: 'customer'
      },
      {
        id: 'demo-rider',
        email: 'rider@demo.com',
        password: 'rider123',
        name: 'Demo Rider',
        role: 'rider'
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }
};
