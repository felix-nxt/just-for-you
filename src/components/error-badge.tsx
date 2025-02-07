import { Badge } from "@/components/ui/badge"
import { CiCircleAlert } from "react-icons/ci"

interface ErrorBadgeProps {
  message: string
}

export default function ErrorBadge({ message }: ErrorBadgeProps) {
  return (
    <Badge variant="outline" className="h-8 mt-4 bg-red-100 text-red-800">
      <CiCircleAlert className="w-4 h-4 mr-2" />
      <span>{message}</span>
    </Badge>
  )
}

