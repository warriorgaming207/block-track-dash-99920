import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useDelivery } from "@/contexts/DeliveryContext";

export const OrderTracking = () => {
  const { orders, user } = useDelivery();
  
  // Get the first order for the current user or the first available order
  const order = orders.find(o => o.customerId === user?.id) || orders[0];

  if (!order) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg">
        <p className="text-center text-muted-foreground">No orders available</p>
      </Card>
    );
  }
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Track Your Order</h2>
          <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none">
          {order.status}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Your order is on the way!</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              Arrives in {order.estimatedTime}
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
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">Current Location:</span>
            <span className="text-muted-foreground">{order.currentLocation}</span>
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
