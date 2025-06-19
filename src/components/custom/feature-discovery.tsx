"use client"
import { langkah } from "@/data/step"
import { useState, useEffect } from "react"
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride"

interface FeatureDiscoveryProps {
  run: boolean
  onClose: () => void
}

export default function FeatureDiscovery({ run, onClose }: FeatureDiscoveryProps) {
  const [steps] = useState<Step[]>(langkah)

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data

    if (["finished", "skipped"].includes(status as "finished" | "skipped")) {
      onClose()
    }
  }

  return (
    <>
      <div className="absolute top-0 left-0 z-50 flex items-center justify-between w-full">
        <Joyride
          steps={steps}
          run={run}
          continuous
          showProgress
          showSkipButton
          styles={{
            options: {
              primaryColor: "hsl(var(--primary))",
              textColor: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--background))",
            },
            tooltip: {
              padding: "16px",
              borderRadius: "8px",
              border: "2px solid #06b6d4",
              boxShadow: "0 0 0 4px rgba(6, 182, 212, 0.3)",
            },
            tooltipContainer: {
              border: "2px solid #06b6d4",
            },
            buttonNext: {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              border: "1px solid #06b6d4",
            },
            buttonBack: {
              color: "hsl(var(--muted-foreground))",
              border: "1px solid #06b6d4",
            },
            spotlight: {
              backgroundColor: "rgba(6, 182, 212, 0.2)",
              borderRadius: "8px",
              border: "2px dashed #06b6d4",
            },
            beacon: {
              backgroundColor: "rgba(6, 182, 212, 0.4)",
              boxShadow: "0 0 0 4px rgba(6, 182, 212, 0.3)",
            },
          }}
          callback={handleJoyrideCallback}
          disableOverlayClose
          disableCloseOnEsc
        />
      </div>
    </>
  )
}