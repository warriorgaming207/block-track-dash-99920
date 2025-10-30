import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Trash2, Package } from 'lucide-react';
import { useDelivery } from '@/contexts/DeliveryContext';
import { toast } from 'sonner';

interface OrderItem {
  name: string;
  quantity: number;
}

export const CreateOrderForm = () => {
  const { user, createOrder } = useDelivery();
  const [items, setItems] = useState<OrderItem[]>([{ name: '', quantity: 1 }]);
  const [isCreating, setIsCreating] = useState(false);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = value as never;
    setItems(newItems);
  };

  const handleCreateOrder = () => {
    if (!user) {
      toast.error('Please login to create an order');
      return;
    }

    const validItems = items.filter(item => item.name.trim() !== '');
    if (validItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setIsCreating(true);
    createOrder(user.id, user.name, validItems);
    setItems([{ name: '', quantity: 1 }]);
    setIsCreating(false);
  };

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Package className="w-6 h-6 text-primary" />
        Create New Order
      </h2>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor={`item-name-${index}`}>Item Name</Label>
              <Input
                id={`item-name-${index}`}
                placeholder="e.g., Fresh Vegetables"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
              />
            </div>
            <div className="w-24">
              <Label htmlFor={`item-qty-${index}`}>Quantity</Label>
              <Input
                id={`item-qty-${index}`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
              />
            </div>
            {items.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeItem(index)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addItem}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Item
        </Button>

        <Button
          onClick={handleCreateOrder}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          size="lg"
        >
          <Package className="w-4 h-4 mr-2" />
          Create Order & Log to Blockchain
        </Button>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            Your order will be logged to the blockchain for complete transparency and tracking.
          </p>
        </div>
      </div>
    </Card>
  );
};
