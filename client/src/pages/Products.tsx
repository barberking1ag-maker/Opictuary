import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, QrCode, Sparkles } from "lucide-react";
import type { Product } from "@shared/schema";

const categories = [
  { id: "all", label: "All Products" },
  { id: "plaques", label: "Plaques" },
  { id: "headstone-markers", label: "Headstone Markers" },
  { id: "memorial-cards", label: "Memorial Cards" },
  { id: "urns", label: "Urns" },
  { id: "keepsakes", label: "Keepsakes" },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background" data-testid="products-page">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="w-10 h-10 text-primary" />
              <QrCode className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Memorial Products with QR Technology
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Beautiful physical memorial products that seamlessly connect to digital memorials. Each product features an embedded QR code, allowing visitors to access photos, videos, and memories with a simple scan.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">FILTER BY CATEGORY</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`filter-${category.id}`}
                className="transition-all"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unable to Load Products</h3>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {selectedCategory === "all" ? "Products Coming Soon" : "No Products Found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedCategory === "all"
                ? "We're preparing our collection of memorial products with QR technology. Check back soon!"
                : "No products available in this category yet."}
            </p>
            {selectedCategory !== "all" && (
              <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                View All Products
              </Button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover-elevate flex flex-col"
                data-testid={`product-card-${product.id}`}
              >
                <CardHeader className="pb-3">
                  {/* Product Image */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-muted mb-4 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Package className="w-16 h-16 text-primary/40 mx-auto mb-2" />
                        <QrCode className="w-8 h-8 text-primary/40 mx-auto" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {categories.find((c) => c.id === product.category)?.label || product.category}
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${parseFloat(product.basePrice).toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">base price</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-3">
                  <CardDescription className="line-clamp-3">{product.description}</CardDescription>
                  
                  {product.stockStatus && product.stockStatus !== "in_stock" && (
                    <div className="mt-3">
                      <Badge
                        variant={
                          product.stockStatus === "low_stock"
                            ? "default"
                            : product.stockStatus === "out_of_stock"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {product.stockStatus === "low_stock" && "Low Stock"}
                        {product.stockStatus === "out_of_stock" && "Out of Stock"}
                        {product.stockStatus === "pre_order" && "Pre-Order"}
                      </Badge>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Link href={`/products/${product.id}/customize`} className="w-full">
                    <Button
                      className="w-full gap-2"
                      disabled={product.stockStatus === "out_of_stock"}
                      data-testid={`button-customize-${product.id}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      Customize & Order
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Info Banner */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-16 bg-card border border-border rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-semibold mb-3">
                Every Product Includes QR Technology
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Each memorial product features a custom QR code that links to your loved one's digital memorial.
                Visitors can scan the code to view photos, videos, memories, and leave their own condolences—
                creating a lasting bridge between the physical and digital worlds.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
