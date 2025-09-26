import { useState, type ReactNode } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MyDialog({
  onClear,
  icon,
  children,
}: {
  onClear: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="font-normal">
          {icon}
        </Button>
      </DialogTrigger>
      <DialogContent>
        {children}

        <div className="flex gap-5">
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            OK
          </Button>
          <Button
            onClick={() => {
              onClear();
              setOpen(false);
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
