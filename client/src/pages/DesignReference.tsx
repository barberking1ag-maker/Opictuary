import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import img0721 from "@assets/IMG_0721_1760000535499.jpeg";
import img0722 from "@assets/IMG_0722_1760000535499.jpeg";
import img0723 from "@assets/IMG_0723_1760000535499.jpeg";
import img0724 from "@assets/IMG_0724_1760000535499.jpeg";
import img0725 from "@assets/IMG_0725_1760000535499.jpeg";
import img0726 from "@assets/IMG_0726_1760000535499.jpeg";
import img0727 from "@assets/IMG_0727_1760000535499.jpeg";
import img0728 from "@assets/IMG_0728_1760000535499.jpeg";
import img0729 from "@assets/IMG_0729_1760000535499.jpeg";

const designImages = [
  { id: "0721", src: img0721, label: "Design Reference 1" },
  { id: "0722", src: img0722, label: "Design Reference 2" },
  { id: "0723", src: img0723, label: "Design Reference 3" },
  { id: "0724", src: img0724, label: "Design Reference 4" },
  { id: "0725", src: img0725, label: "Design Reference 5" },
  { id: "0726", src: img0726, label: "Design Reference 6" },
  { id: "0727", src: img0727, label: "Design Reference 7" },
  { id: "0728", src: img0728, label: "Design Reference 8" },
  { id: "0729", src: img0729, label: "Design Reference 9" },
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
