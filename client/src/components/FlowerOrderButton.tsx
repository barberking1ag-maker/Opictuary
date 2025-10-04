import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flower2, MapPin, Star, Phone } from "lucide-react";
import { useState } from "react";

interface FlowerShop {
  id: string;
  name: string;
  distance: string;
  rating: number;
  phone: string;
  address: string;
  specialties: string[];
}

interface FlowerOrderButtonProps {
  memorialName?: string;
  deliveryLocation?: string;
}

export default function FlowerOrderButton({
  memorialName,
  deliveryLocation
}: FlowerOrderButtonProps) {
  const [open, setOpen] = useState(false);

  //todo: remove mock functionality
  const mockShops: FlowerShop[] = [
    {
      id: '1',
      name: 'Riverside Florist',
      distance: '0.8 miles',
      rating: 4.9,
      phone: '(555) 123-4567',
      address: '123 Main St, Suite 100',
      specialties: ['Funeral Arrangements', 'Sympathy Flowers']
    },
    {
      id: '2',
      name: 'Garden of Remembrance',
      distance: '1.2 miles',
      rating: 4.8,
      phone: '(555) 234-5678',
      address: '456 Oak Avenue',
      specialties: ['Memorial Wreaths', 'Custom Tributes']
    },
    {
      id: '3',
      name: 'Eternal Blooms',
      distance: '2.3 miles',
      rating: 4.7,
      phone: '(555) 345-6789',
      address: '789 Elm Street',
      specialties: ['Same-Day Delivery', 'Casket Sprays']
    }
  ];

  const handleOrderClick = (shop: FlowerShop) => {
    console.log('Order from shop:', shop.name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="bg-chart-3 hover:bg-chart-3 text-white"
          data-testid="button-send-flowers"
        >
          <Flower2 className="w-5 h-5 mr-2" />
          Send Flowers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl" data-testid="modal-flower-shops">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Send Flowers</DialogTitle>
          <DialogDescription>
            {deliveryLocation 
              ? `Choose a local florist to deliver flowers to ${deliveryLocation}`
              : 'Choose a local florist for flower delivery'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto py-4">
          {mockShops.map((shop) => (
            <Card key={shop.id} className="p-4" data-testid={`card-flower-shop-${shop.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground" data-testid={`text-shop-name-${shop.id}`}>
                      {shop.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{shop.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{shop.address} • {shop.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{shop.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {shop.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleOrderClick(shop)}
                  data-testid={`button-order-${shop.id}`}
                >
                  Order Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Flowers will be delivered to the specified location with a memorial card from you
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
