import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package, MapPin, Clock, CheckCircle2, Truck, User } from "lucide-react";
import { Progress } from "./ui/progress";
import { useDelivery } from "@/contexts/DeliveryContext";
import { useEffect } from "react";

export const OrderTracking = () => {
  const { orders, user } = useDelivery();
  
  // Get the first order for the current user or the first available order
  const order = orders.find(o => o.customerId === user?.id) || orders[0];

  // Auto-refresh to show real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This will trigger re-render when localStorage changes
      window.dispatchEvent(new Event('storage'));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg">
        <div className="text-center py-8">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
          <p className="text-muted-foreground">No orders available</p>
          {user && user.role === 'customer' && (
            <p className="text-sm text-muted-foreground mt-2">Create your first order to start tracking</p>
          )}
        </div>
      </Card>
    );
  }
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Track Your Order
          </h2>
          <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none animate-pulse">
          {order.status}
        </Badge>
      </div>

      {/* Delivery Agent Info */}
      {order.riderName && (
        <div className="mb-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm font-medium">Delivery Agent</p>
              <p className="text-sm text-muted-foreground">{order.riderName}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-top-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Package className="w-6 h-6 text-primary-foreground animate-bounce" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {order.status === 'Delivered' ? '✓ Order Delivered!' : 'Your order is on the way!'}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {order.status === 'Delivered' ? 'Completed' : `Arrives in ${order.estimatedTime}`}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Delivery Progress</span>
            <span className="text-primary">{order.progress}%</span>
          </div>
          <Progress value={order.progress} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-accent animate-pulse" />
              <span className="font-medium">Current Location:</span>
              <span className="text-muted-foreground font-mono">{order.currentLocation}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-6">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Delivery Timeline</h3>
          {order.deliverySteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="relative">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted" />
                )}
                {index < order.deliverySteps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-5 w-0.5 h-8 -ml-px ${
                      step.completed ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground">{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border">
          <h4 className="font-medium text-sm mb-2">Order Items</h4>
          <ul className="space-y-1">
            {order.items.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                • {item.quantity}x {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
