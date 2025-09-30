import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-4">{message}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
