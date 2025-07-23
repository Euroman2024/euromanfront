import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, CalendarDays, Users, Package } from "lucide-react"

interface Props {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  progress?: number // 0-100
  color?: string // tailwind color
}

export function DashboardStatsVisual({ title, value, description, icon, progress, color }: Props) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className={`rounded-full p-3 ${color || 'bg-primary/10'}`}>{icon}</div>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold mb-2">{value}</div>
        {typeof progress === "number" && (
          <Progress value={progress} className="h-2" />
        )}
      </CardContent>
    </Card>
  )
}
