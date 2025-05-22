interface TaskOverviewPropertyProps {
  label: string;
  children: React.ReactNode;
}

export const TaskOverviewProperty = ({ label, children }: TaskOverviewPropertyProps) => {
  return (
    <div className="flex items-start gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground pb-1 font-heading">{label}</p>
        <div className="flex items-center gap-x-2">{children}</div>
      </div>
    </div>
  );
};
