import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ArrowRight, CreditCard, Palette, Wand2 } from "lucide-react";
import type { Product } from "@shared/schema";

export default function AICardMaker() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const memorialCards = products.filter(p => p.category === "memorial-cards");

  return (
    <div className="min-h-screen bg-background" data-testid="ai-card-maker-page">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-3" data-testid="heading-ai-card-maker">
            AI Memorial Card Designer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Create beautiful, personalized memorial cards with AI-generated designs.
            Our intelligent design system creates unique artwork based on your descriptions.
          </p>
          <Badge variant="secondary" className="text-sm" data-testid="badge-ai-price">
            AI Design: $9.99
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Describe Your Vision</h3>
              <p className="text-sm text-muted-foreground">
                Tell us what you envision - peaceful gardens, butterflies, sunsets, or any meaningful imagery
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Creates Your Design</h3>
              <p className="text-sm text-muted-foreground">
                Our AI generates a unique, beautiful design based on your description in seconds
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Order & Receive</h3>
              <p className="text-sm text-muted-foreground">
                Finalize your order with personalized text and receive beautiful printed cards
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Choose a Memorial Card to Customize</h2>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : memorialCards.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">No memorial cards available at the moment.</p>
              <Link href="/products">
                <Button variant="outline">
                  Browse All Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memorialCards.map((product) => (
              <Card key={product.id} className="overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
                {product.images && product.images.length > 0 ? (
                  <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-primary/30" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <Badge variant="secondary">${parseFloat(product.basePrice).toFixed(2)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Design Available
                    </Badge>
                  </div>
                  <Link href={`/products/${product.id}/customize`}>
                    <Button className="w-full" data-testid={`button-customize-${product.id}`}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Customize with AI
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Looking for other memorial products?</p>
          <Link href="/products">
            <Button variant="outline" data-testid="button-browse-all">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
