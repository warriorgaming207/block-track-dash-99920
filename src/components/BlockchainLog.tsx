import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Shield, Hash, Clock } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useDelivery } from "@/contexts/DeliveryContext";

export const BlockchainLog = () => {
  const { transactions } = useDelivery();
  
  const latestHash = transactions.length > 0 
    ? transactions[transactions.length - 1].hash 
    : '0x0000000000000000000000000000000000000000';
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Blockchain Transaction Log</h2>
          <p className="text-sm text-muted-foreground">Immutable delivery records</p>
        </div>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Latest Block Hash</span>
        </div>
        <code className="text-xs text-muted-foreground break-all">
          {latestHash}
        </code>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {transaction.id}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.action}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      {transaction.timestamp}
                    </div>
                  </div>
                </div>
                {transaction.verified && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="mt-3 p-2 rounded bg-muted/50">
                <div className="flex items-center gap-1 mb-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Transaction Hash</span>
                </div>
                <code className="text-xs text-foreground break-all">
                  {transaction.hash}
                </code>
              </div>
            </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-success" />
          <span className="font-medium">All transactions are cryptographically secured</span>
        </div>
      </div>
    </Card>
  );
};
