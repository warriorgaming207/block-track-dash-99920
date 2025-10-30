import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrderTracking } from "@/components/OrderTracking";
import { BlockchainLog } from "@/components/BlockchainLog";
import { DeliveryHeader } from "@/components/DeliveryHeader";
import { useDelivery } from "@/contexts/DeliveryContext";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user } = useDelivery();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <DeliveryHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
            <Package className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            DeliveryChain
          </h1>
          <p className="text-muted-foreground text-lg">
            Blockchain-powered delivery tracking system
          </p>
          
          {!user && (
            <div className="mt-6">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get Started - Login or Sign Up
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <OrderTracking />
          <BlockchainLog />
        </div>
      </main>
    </div>
  );
};

export default Index;
