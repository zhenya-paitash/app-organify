import { Separator } from "@/components/ui/separator"

interface SeparatorWithTextProps extends React.ComponentProps<typeof Separator> {
  text: string
}

export const SeparatorWithText = ({ text, ...props }: SeparatorWithTextProps) => (
  <div className="flex items-center gap-4 font-heading">
    <Separator className="flex-1" {...props} />
    <span className="text-muted-foreground">{text}</span>
    <Separator className="flex-1" {...props} />
  </div>
)
