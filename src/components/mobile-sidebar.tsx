"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false);
  }, [pathname])

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="lg:hidden hover:opacity-75 transition" asChild>
        <Button variant="secondary" size="sm" className="lg:hidden">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>

      {/* <SheetContent side="left" className="p-0 w-full sm:max-w-full"> */}
      <SheetContent side="left" className="p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}

