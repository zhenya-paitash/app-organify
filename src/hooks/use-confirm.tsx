"use client";

import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UseConfirmProps {
  title: string;
  message: string;
  variant?: ButtonProps["variant"];
}

export const useConfirm = ({ title, message, variant }: UseConfirmProps): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () => new Promise((resolve) => setPromise({ resolve }));
  const close = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    close();
  }
  const handleCancel = () => {
    promise?.resolve(false);
    close();
  }

  const ConfirmDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={close} variantModal="confirm">
      <Card className="w-full h-full border-none shadown-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="w-full flex flex-col lg:flex-row gap-x-2 gap-y-2 items-center justify-end pt-4">
            <Button onClick={handleCancel} variant="outline" className="w-full lg:w-auto">Cancel</Button>
            <Button onClick={handleConfirm} variant={variant} className="w-full lg:w-auto">Confirm</Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmDialog, confirm];
};
