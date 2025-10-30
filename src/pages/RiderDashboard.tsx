import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDelivery } from '@/contexts/DeliveryContext';
import { DeliveryHeader } from '@/components/DeliveryHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const RiderDashboard = () => {
  const navigate = useNavigate();
  const { user, orders, updateOrderStatus } = useDelivery();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');

  if (!user || user.role !== 'rider') {
    navigate('/auth');
    return null;
  }

  const myOrders = orders.filter(
    (order) => order.riderId === user.id || !order.riderId
  );

  const handleUpdateOrder = () => {
    if (!selectedOrder || !newStatus || !newLocation) {
      toast.error('Please fill all fields');
      return;
    }

    updateOrderStatus(selectedOrder, newStatus, newLocation);
    setNewStatus('');
    setNewLocation('');
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <DeliveryHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Delivery Agent Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}!</p>
            </div>
          </div>
          <Badge className="mt-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            Active Agent
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Deliveries</p>
                <p className="text-3xl font-bold">{myOrders.filter(o => o.status !== 'Delivered').length}</p>
              </div>
              <Package className="w-10 h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
                <p className="text-3xl font-bold">{myOrders.filter(o => o.status === 'Delivered').length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-secondary" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Delivery Time</p>
                <p className="text-3xl font-bold">22m</p>
              </div>
              <Clock className="w-10 h-10 text-accent" />
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {myOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders assigned yet</p>
              ) : (
                myOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedOrder === order.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent/5'
                    }`}
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-primary to-secondary">
                        {order.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{order.currentLocation}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">ETA: {order.estimatedTime}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Items:</p>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm">
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Update Order Status
            </h2>
            {selectedOrder ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Selected Order</p>
                  <p className="font-bold text-lg">{selectedOrder}</p>
                  <Badge className="mt-2" variant="outline">Ready to Update</Badge>
                </div>

                <div>
                  <Label htmlFor="status">New Status</Label>
                  <Input
                    id="status"
                    placeholder="e.g., Arrived at destination"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Current Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Customer's address"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>

                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Quick Status Options:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { status: 'Picked Up', location: 'Warehouse' },
                      { status: 'In Transit', location: 'En route' },
                      { status: 'Nearby', location: 'Near destination' },
                      { status: 'Delivered', location: 'Customer location' }
                    ].map(({ status, location }) => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewStatus(status);
                          setNewLocation(location);
                        }}
                        className="justify-start h-auto py-2"
                      >
                        <div className="text-left">
                          <div className="font-medium text-xs">{status}</div>
                          <div className="text-xs text-muted-foreground">{location}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleUpdateOrder} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" size="lg">
                  <Package className="w-4 h-4 mr-2" />
                  Update & Log to Blockchain
                </Button>

                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    Updates are instantly logged to the blockchain and visible to customers
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select an order from the left to update its status</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RiderDashboard;