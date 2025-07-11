"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface MonevParameterChartProps {
  data: Array<{
    tahapan_id: number
    tahapan_name: string
    subtahapans: Array<{
      sub_tahapan_id: number
      sub_tahapan_name: string | null
      parameters: Array<{
        parameter_id: number
        parameter_name: string
        pengamatans: Array<{
          pengamatan_id: number
          pengamatan_name: string
          is_selected: boolean
          value_description?: string | null
        }>
      }>
    }>
  }>
}
export function MonevParameterChart({ data }: MonevParameterChartProps) {
  // Flatten all parameters for analysis
  const allParameters = data.flatMap((stage) =>
    stage.subtahapans.flatMap((substage) =>
      substage.parameters.map((parameter) => ({
        ...parameter,
        stageName: stage.tahapan_name,
        substageName: substage.sub_tahapan_name,
      })),
    ),
  )

  const getParameterStatus = (parameter: any) => {
    const selectedObs = parameter.pengamatans.find((obs: any) => obs.is_selected)
    if (!selectedObs) return "not-assessed"

    const isCompliant =
      selectedObs.pengamatan_name.toLowerCase().includes("sesuai") ||
      selectedObs.pengamatan_name.toLowerCase().includes("dilakukan") ||
      selectedObs.pengamatan_name.toLowerCase().includes("ada") ||
      selectedObs.pengamatan_name.toLowerCase().includes("dipasang") ||
      selectedObs.pengamatan_name.toLowerCase().includes("bebas") ||
      selectedObs.pengamatan_name.toLowerCase().includes("tidak berpotensi") ||
      selectedObs.pengamatan_name.toLowerCase().includes("tidak ada serangan") ||
      selectedObs.pengamatan_name.toLowerCase().includes("diagonal arah barisan") ||
      selectedObs.pengamatan_name.toLowerCase().includes("rutin")

    return isCompliant ? "compliant" : "non-compliant"
  }

  const statusCounts = {
    compliant: allParameters.filter((p) => getParameterStatus(p) === "compliant").length,
    "non-compliant": allParameters.filter((p) => getParameterStatus(p) === "non-compliant").length,
    "not-assessed": allParameters.filter((p) => getParameterStatus(p) === "not-assessed").length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "non-compliant":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "non-compliant":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Compliant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statusCounts.compliant}</div>
            <Progress value={(statusCounts.compliant / allParameters.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-400 text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Non-Compliant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statusCounts["non-compliant"]}</div>
            <Progress value={(statusCounts["non-compliant"] / allParameters.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-400 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Not Assessed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statusCounts["not-assessed"]}</div>
            <Progress value={(statusCounts["not-assessed"] / allParameters.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Parameter List */}
      <div className="space-y-3 max-h-[400px] overflow-auto">
        {allParameters.map((parameter, index) => {
          const status = getParameterStatus(parameter)
          const selectedObs = parameter.pengamatans.find((obs: any) => obs.is_selected)

          return (
            <Card key={`${parameter.parameter_id}-${index}`} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <h4 className="font-medium text-white text-sm">{parameter.parameter_name}</h4>
                    </div>
                    <div className="text-xs text-gray-400">
                      {parameter.stageName}
                      {parameter.substageName && ` • ${parameter.substageName}`}
                    </div>
                    {selectedObs && (
                      <Badge variant="outline" className={getStatusColor(status)}>
                        {selectedObs.pengamatan_name}
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className={`ml-4 ${getStatusColor(status)}`}>
                    {status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
