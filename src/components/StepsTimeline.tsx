import { ScrollArea } from '@/components/ui/scroll-area'

interface Step {
  content: string
}

interface StepsTimelineProps {
  steps: Step[]
}

export function StepsTimeline({ steps }: StepsTimelineProps) {
  if (!steps.length) return null
  return (
    <ScrollArea className="max-h-[400px] pr-2">
      <div className="space-y-0">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-8 pb-4 border-l-2 border-muted last:border-transparent last:pb-0">
            <div className="absolute -left-[0.65rem] top-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow">
              {idx + 1}
            </div>
            <div
              className="text-sm text-muted-foreground [&_p]:my-1 [&_ul]:my-1 [&_ul]:pl-4"
              dangerouslySetInnerHTML={{ __html: step.content }}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export type { Step }
