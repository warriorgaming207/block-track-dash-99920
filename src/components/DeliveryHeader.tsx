import { Bell, User, LogOut, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { useDelivery } from "@/contexts/DeliveryContext";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const DeliveryHeader = () => {
  const { user, logout } = useDelivery();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">DC</span>
          </div>
          <span className="font-bold text-xl">DeliveryChain</span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <>
              {user.role === 'rider' && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/rider')}>
                  <Truck className="h-4 w-4 mr-2" />
                  Rider Dashboard
                </Button>
              )}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!user && (
            <Button onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
