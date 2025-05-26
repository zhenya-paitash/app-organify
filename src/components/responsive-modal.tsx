"use client";

import { useMedia } from "react-use";
import { usePathname } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  variant?: "default" | "confirm";
  onOpenChange: (open: boolean) => void;
};

export const ResponsiveModal = ({ children, open, variant, onOpenChange }: ResponsiveModalProps) => {
  const isMobile = useMedia("(max-width: 768px)");
  const pathname = usePathname();

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent variant={variant ?? "default"} className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar bg-card">
        {children}
      </DialogContent>
    </Dialog>
  );
}

