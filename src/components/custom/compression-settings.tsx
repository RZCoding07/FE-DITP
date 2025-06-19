"use client"

import { useState } from "react"

interface CompressionSettingsProps {
  onSettingsChange: (settings: {
    maxSizeMB: number
    maxWidthOrHeight: number
    initialQuality: number
    enableCompression: boolean
    strictSizeLimit: boolean
  }) => void
  defaultSettings: {
    maxSizeMB: number
    maxWidthOrHeight: number
    initialQuality: number
    enableCompression: boolean
    strictSizeLimit: boolean
  }
}

export default function CompressionSettings({ onSettingsChange, defaultSettings }: CompressionSettingsProps) {
  const [settings, setSettings] = useState(defaultSettings)
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : type === "number" ? Number.parseFloat(value) : value

    const newSettings = {
      ...settings,
      [name]: newValue,
    }

    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Compression Settings</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="text-sm text-blue-600 hover:underline">
          {isOpen ? "Hide Settings" : "Show Settings"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="enableCompression"
                checked={settings.enableCompression}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Enable Compression</span>
            </label>
            <p className="mt-1 text-sm text-gray-500">Automatically compress images before upload</p>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="strictSizeLimit"
                checked={settings.strictSizeLimit}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
                disabled={!settings.enableCompression}
              />
              <span>Force 500KB Limit</span>
            </label>
            <p className="mt-1 text-sm text-gray-500">Ensure files are under 500KB (multiple compression passes)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Size (MB)</label>
            <input
              type="number"
              name="maxSizeMB"
              value={settings.maxSizeMB}
              onChange={handleChange}
              min={0.1}
              max={10}
              step={0.1}
              disabled={!settings.enableCompression}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
            />
            <p className="mt-1 text-sm text-gray-500">Target maximum file size after compression</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Width/Height (px)</label>
            <input
              type="number"
              name="maxWidthOrHeight"
              value={settings.maxWidthOrHeight}
              onChange={handleChange}
              min={500}
              max={4000}
              step={100}
              disabled={!settings.enableCompression}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
            />
            <p className="mt-1 text-sm text-gray-500">Maximum dimension for images</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quality (0-1)</label>
            <input
              type="number"
              name="initialQuality"
              value={settings.initialQuality}
              onChange={handleChange}
              min={0.1}
              max={1}
              step={0.05}
              disabled={!settings.enableCompression}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:opacity-50"
            />
            <p className="mt-1 text-sm text-gray-500">Initial compression quality (may be reduced further if needed)</p>
          </div>
        </div>
      )}
    </div>
  )
}

