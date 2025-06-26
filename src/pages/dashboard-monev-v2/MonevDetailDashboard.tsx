"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  Award,
  Activity,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonevComplianceChart } from "@/components/charts-m/MonevComplianceChart"
import { MonevParameterChart } from "@/components/charts-m/MonevParameterChart"
import { MonevStageChart } from "@/components/charts-m/MonevStageChart"
import { apiService } from "@/services/api-monev-2"

interface MonevDetailData {
  data: {
    gis_id: string
    regional: string
    nama_unit: string
    kode_afdeling: string
    kode_blok: string
    luas: string
    tanggal: string
    judul_pekerjaan: string
    kertas_kerja_name: string
    created_at: string
    author_name: string
    created_by: string
    jabatan: string
    nama_vendor: string | null
    mekanis: string
    chemis: string
    preview_link: string
    kertas_kerja: Array<{
      tahapan_id: number
      tahapan_name: string
      subtahapans: Array<{
        sub_tahapan_id: number
        sub_tahapan_name: string
        parameters: Array<{
          parameter_id: number
          parameter_name: string
          pengamatans: Array<{
            pengamatan_id: number
            pengamatan_name: string
            is_selected: boolean
          }>
        }>
      }>
    }>
    main_issue: Array<{
      id: number
      keterangan: string
    }>
    rencana_kerja_tindak_lanjut: Array<{
      id: number
      keterangan: string
    }>
  }
}

export default function MonevDetailDashboard() {
  const { monevId } = useParams()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [monevDetail, setMonevDetail] = useState<MonevDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMonevDetail = async () => {
      if (!monevId) return

      try {
        setIsLoading(true)
        const data = await apiService.getMonevDetailById(Number.parseInt(monevId))
        setMonevDetail(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch monev detail:", err)
        setError("Failed to load monitoring data")
        setMonevDetail(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMonevDetail()
  }, [monevId])

  // Calculate compliance statistics
  const complianceStats = monevDetail?.data.kertas_kerja
    ? (() => {
      let totalParameters = 0
      let compliantParameters = 0
      let notAssessedParameters = 0
      let totalObservations = 0
      let selectedObservations = 0

      monevDetail.data.kertas_kerja.forEach((stage) => {
        stage.subtahapans.forEach((substage) => {
          substage.parameters.forEach((parameter) => {
            totalParameters++
            totalObservations += parameter.pengamatans.length

            const hasSelection = parameter.pengamatans.some(obs => obs.is_selected)
            if (!hasSelection) {
              notAssessedParameters++
              return
            }

            const hasCompliantSelection = parameter.pengamatans.some(
              (obs) =>
                obs.is_selected &&
                (obs.pengamatan_name.toLowerCase().includes("sesuai") ||
                  obs.pengamatan_name.toLowerCase().includes("dilakukan") ||
                  obs.pengamatan_name.toLowerCase().includes("ada") ||
                  obs.pengamatan_name.toLowerCase().includes("dipasang") ||
                  obs.pengamatan_name.toLowerCase().includes("bebas") ||
                  obs.pengamatan_name.toLowerCase().includes("tidak berpotensi") ||
                  obs.pengamatan_name.toLowerCase().includes("tidak ada serangan") ||
                  obs.pengamatan_name.toLowerCase().includes("rutin")),
            )

            if (hasCompliantSelection) {
              compliantParameters++
            }

            selectedObservations += parameter.pengamatans.filter((obs) => obs.is_selected).length
          })
        })
      })

      return {
        totalParameters,
        compliantParameters,
        notAssessedParameters,
        totalObservations,
        selectedObservations,
        complianceRate: totalParameters > 0 ? (compliantParameters / totalParameters) * 100 : 0,
        completionRate: totalObservations > 0 ? (selectedObservations / totalObservations) * 100 : 0,
      }
    })()
    : null

  const data = monevDetail?.data

  if (isLoading) {
    return (
      <div className="  from-slate-900 to-slate-900 flex items-center h-full justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="h-full  from-slate-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold mb-2">Data Not Found</h2>
          <p className="text-gray-300">{error || "Monitoring data could not be loaded"}</p>
          <Button asChild className="mt-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard-monev">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Individual Monitoring Dashboard</h1>
                <p className="text-sm text-gray-300">Comprehensive analysis for {data.gis_id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/80 text-white hover:bg-white/10"
                onClick={() => window.open(data.preview_link, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 space-y-6 overflow-auto">
        {/* Basic Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className=" from-emerald-500/80 to-emerald-600/80 border-emerald-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-100 text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-lg font-bold text-white">{data.gis_id}</div>
              <div className="text-sm text-emerald-200">{data.regional}</div>
              <div className="text-xs text-emerald-300">
                {data.nama_unit} • {data.kode_afdeling} • {data.kode_blok}
              </div>
              <div className="text-xs text-emerald-400">Area: {Number.parseFloat(data.luas).toFixed(2)} Ha</div>
            </CardContent>
          </Card>

          <Card className=" dark:bg-slate-950 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-100 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Monitoring Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-lg font-bold text-white">
                {new Date(data.tanggal).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="text-sm text-blue-200">{data.judul_pekerjaan}</div>
              <div className="text-xs text-blue-300">{data.kertas_kerja_name}</div>
              <div className="text-xs text-blue-400">Created: {new Date(data.created_at).toLocaleString("id-ID")}</div>
            </CardContent>
          </Card>

          <Card className=" from-purple-500/80 to-purple-600/80 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-100 text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Inspector Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-lg font-bold text-white">{data.author_name}</div>
              <div className="text-sm text-purple-200">SAP: {data.created_by}</div>
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-xs">{data.jabatan}</Badge>
            </CardContent>
          </Card>

          <Card className=" from-orange-500/80 to-orange-600/80 border-orange-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-100 text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Vendor & Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-lg font-bold text-white">{data.nama_vendor || "N/A"}</div>
              <div className="text-sm text-orange-200">Mekanis: {Number.parseFloat(data.mekanis).toFixed(2)} Ha</div>
              <div className="text-sm text-orange-200">Chemis: {Number.parseFloat(data.chemis).toFixed(2)} Ha</div>
              <div className="text-xs text-orange-400">
                Total: {(Number.parseFloat(data.mekanis) + Number.parseFloat(data.chemis)).toFixed(2)} Ha
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        {complianceStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dark:bg-slate-950 border-emerald-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-100 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{complianceStats.complianceRate.toFixed(1)}%</div>
                <Progress value={complianceStats.complianceRate} className="mb-2 h-3" />
                <div className="text-xs text-emerald-200">
                  {complianceStats.compliantParameters} of {complianceStats.totalParameters} parameters compliant
                </div>
              </CardContent>
            </Card>

            <Card className=" dark:bg-slate-950 border-blue-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-100 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{complianceStats.completionRate.toFixed(1)}%</div>
                <Progress value={complianceStats.completionRate} className="mb-2 h-3" />
                <div className="text-xs text-blue-200">
                  {complianceStats.selectedObservations} of {complianceStats.totalObservations} observations completed
                </div>
              </CardContent>
            </Card>

            <Card className="  border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-100 text-sm flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {((complianceStats.complianceRate + complianceStats.completionRate) / 2).toFixed(1)}%
                </div>
                <Progress
                  value={(complianceStats.complianceRate + complianceStats.completionRate) / 2}
                  className="mb-2 h-3"
                />
                <div className="text-xs text-purple-200">Combined compliance and completion score</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Compliance Overview
              </CardTitle>
              <CardDescription className="text-gray-300">
                Distribution of compliant vs non-compliant parameters
              </CardDescription>
            </CardHeader>
            <CardContent>{complianceStats && // Then in your chart component:
              <MonevComplianceChart data={{
                compliantParameters: complianceStats.compliantParameters,
                totalParameters: complianceStats.totalParameters,
                complianceRate: complianceStats.complianceRate,
                notAssessedParameters: complianceStats.notAssessedParameters
              }} />}</CardContent>
          </Card>

          <Card className="border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stage Performance
              </CardTitle>
              <CardDescription className="text-gray-300">Performance breakdown by monitoring stages</CardDescription>
            </CardHeader>
            <CardContent>
              <MonevStageChart data={data.kertas_kerja} />
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Card className="border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Analysis
            </CardTitle>
            <CardDescription className="text-gray-300">
              Comprehensive breakdown of monitoring parameters and observations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stages" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="stages" className="text-white data-[state=active]:bg-slate-700">
                  Monitoring Stages
                </TabsTrigger>
                <TabsTrigger value="parameters" className="text-white data-[state=active]:bg-slate-700">
                  Parameters
                </TabsTrigger>
                <TabsTrigger value="issues" className="text-white data-[state=active]:bg-slate-700">
                  Issues
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-white data-[state=active]:bg-slate-700">
                  Action Plans
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stages" className="space-y-4">
                {data.kertas_kerja.map((stage, stageIndex) => (
                  <Card key={stage.tahapan_id} className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {stageIndex + 1}
                        </div>
                        {stage.tahapan_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {stage.subtahapans.map((substage) => (
                        <div key={substage.sub_tahapan_id} className="space-y-3">
                          {substage.sub_tahapan_name && (
                            <h4 className="font-semibold text-emerald-400">{substage.sub_tahapan_name}</h4>
                          )}
                          <div className="grid gap-3">
                            {substage.parameters.map((parameter) => {
                              const selectedObs = parameter.pengamatans.find((obs) => obs.is_selected)
                              const isCompliant = selectedObs
                                ? selectedObs.pengamatan_name.toLowerCase().includes("sesuai") ||
                                selectedObs.pengamatan_name.toLowerCase().includes("dilakukan") ||
                                selectedObs.pengamatan_name.toLowerCase().includes("ada") ||
                                selectedObs.pengamatan_name.toLowerCase().includes("dipasang") ||
                                selectedObs.pengamatan_name.toLowerCase().includes("bebas") ||
                                selectedObs.pengamatan_name.toLowerCase().includes("tidak berpotensi") ||
                                selectedObs.pengamatan_name.toLowerCase().includes("tidak ada serangan") ||
                                selectedObs.pengamatan_name.toLowerCase().includes("rutin")
                                : false

                              return (
                                <div
                                  key={parameter.parameter_id}
                                  className="p-3 bg-slate-700 rounded-lg border border-slate-600"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-medium text-white text-sm">{parameter.parameter_name}</h5>
                                    {selectedObs ? (
                                      <Badge
                                        className={ 
                                          isCompliant
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                        }
                                      >
                                        {isCompliant ? (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                          <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {selectedObs.pengamatan_name}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="border-gray-500 text-gray-400">
                                        Not Assessed
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {parameter.pengamatans.map((obs) => (
                                      <Badge
                                        key={obs.pengamatan_id}
                                        variant={obs.is_selected ? "default" : "outline"}
                                        className={
                                          obs.is_selected
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "border-slate-500 text-slate-100"
                                        }
                                      >
                                        {obs.pengamatan_name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="parameters" className="space-y-4">
                <MonevParameterChart data={data.kertas_kerja} />
              </TabsContent>

              <TabsContent value="issues" className="space-y-4">
                {data.main_issue.length > 0 ? (
                  <div className="space-y-3">
                    {data.main_issue.map((issue, index) => (
                      <Card key={issue.id} className="bg-red-500/10 border-red-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-400 mb-1">Main Issue #{issue.id}</h4>
                              <p className="text-white text-sm">{issue.keterangan}</p>
                            </div>
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
                    <p>No issues identified</p>
                    <p className="text-sm mt-2">All parameters are within acceptable ranges</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                {data.rencana_kerja_tindak_lanjut.length > 0 ? (
                  <div className="space-y-3">
                    {data.rencana_kerja_tindak_lanjut.map((action, index) => (
                      <Card key={action.id} className="bg-blue-500/10 border-blue-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-400 mb-1">Action Plan #{action.id}</h4>
                              <p className="text-white text-sm">{action.keterangan}</p>
                            </div>
                            <Target className="h-5 w-5 text-blue-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Target className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                    <p>No action plans required</p>
                    <p className="text-sm mt-2">Current performance meets all standards</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}