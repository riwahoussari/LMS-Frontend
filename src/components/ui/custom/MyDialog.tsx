import { useState, type ReactNode } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export default function MyDialog({
  onClear,
  icon,
  children,
}: {
  onClear?: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50  h-9 px-4 py-2 has-[>svg]:px-3">
          {icon}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription />
        <DialogTitle />

        {children}

        <div className="flex gap-5">
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            OK
          </Button>
          {onClear && (
            <Button
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
