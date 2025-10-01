import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
}
