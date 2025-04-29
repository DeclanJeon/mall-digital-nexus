
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="w-full border border-dashed">
      <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="rounded-full bg-muted p-4">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            <Plus className="mr-2 h-4 w-4" /> {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
