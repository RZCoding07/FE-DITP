"use client"

import { useEffect, useState } from "react"

interface UploadStatsProps {
  files: Array<{
    name: string
    size: string
    type: string
    compressionRatio?: number | null
  }>
}

export default function UploadStats({ files }: UploadStatsProps) {
  const [fileTypeCount, setFileTypeCount] = useState<Record<string, number>>({})
  const [compressionStats, setCompressionStats] = useState({
    compressedCount: 0,
    averageRatio: 0,
  })

  useEffect(() => {
    if (!files || files.length === 0) return

    try {
      // Process file types
      const typeCount: Record<string, number> = {}
      files.forEach((file) => {
        if (!file || !file.type) return

        const type = file.type?.split("/")[0] || "other"
        typeCount[type] = (typeCount[type] || 0) + 1
      })

      setFileTypeCount(typeCount)

      // Process compression data
      const compressedFiles = files.filter((f) => f && f.compressionRatio && f.compressionRatio > 0)
      if (compressedFiles.length > 0) {
        const totalRatio = compressedFiles.reduce((acc, file) => {
          return acc + (file.compressionRatio || 0)
        }, 0)

        setCompressionStats({
          compressedCount: compressedFiles.length,
          averageRatio: totalRatio / compressedFiles.length,
        })
      }
    } catch (error) {
      console.error("Error processing upload stats:", error)
    }
  }, [files])

  if (!files || files.length === 0) return null

  return (
    <div className="mt-8 rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Upload Statistics</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Object.keys(fileTypeCount).length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-medium">File Types</h3>
            <div className="space-y-2">
              {Object.entries(fileTypeCount).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type}</span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    {count} file{count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {compressionStats.compressedCount > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-medium">Compression Results</h3>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-green-800">
                <strong>{compressionStats.compressedCount}</strong> file
                {compressionStats.compressedCount !== 1 ? "s" : ""} compressed
              </p>
              <p className="text-green-800">
                Average compression ratio: <strong>{compressionStats.averageRatio.toFixed(2)}x</strong>
              </p>
              <p className="mt-2 text-sm text-green-700">
                Compression saved approximately {((compressionStats.averageRatio - 1) * 100).toFixed(0)}% of space
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

