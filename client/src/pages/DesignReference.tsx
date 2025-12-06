import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Design reference images - using placeholder URLs since original images are not available
const designImages = [
  { id: "0721", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", label: "Design Reference 1" },
  { id: "0722", src: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop", label: "Design Reference 2" },
  { id: "0723", src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop", label: "Design Reference 3" },
  { id: "0724", src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop", label: "Design Reference 4" },
  { id: "0725", src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop", label: "Design Reference 5" },
  { id: "0726", src: "https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=400&h=300&fit=crop", label: "Design Reference 6" },
  { id: "0727", src: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=300&fit=crop", label: "Design Reference 7" },
  { id: "0728", src: "https://images.unsplash.com/photo-1557682260-96773eb01377?w=400&h=300&fit=crop", label: "Design Reference 8" },
  { id: "0729", src: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400&h=300&fit=crop", label: "Design Reference 9" },
];

export default function DesignReference() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-title">
            Design Reference Gallery
          </h1>
          <p className="text-muted-foreground" data-testid="text-subtitle">
            Your uploaded design mockups for the Opictuary platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designImages.map((image) => (
            <Card key={image.id} data-testid={`card-design-${image.id}`} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg" data-testid={`text-label-${image.id}`}>
                  {image.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={image.src}
                  alt={image.label}
                  className="w-full h-auto object-contain bg-muted"
                  data-testid={`img-design-${image.id}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-card rounded-lg border" data-testid="card-instructions">
          <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
          <p className="text-muted-foreground">
            Review these design references and let me know which elements you'd like to implement:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-muted-foreground">
            <li>Color scheme and backgrounds</li>
            <li>Layout and navigation structure</li>
            <li>Typography and font styles</li>
            <li>Button styles and components</li>
            <li>Any new features or sections</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
