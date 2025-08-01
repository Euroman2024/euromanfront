"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, FileText, Package, Users } from "lucide-react"
import Link from "next/link"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardStatsVisual } from "@/components/dashboard-stats-visual"
import { RecentProformas } from "@/components/recent-proformas"
import { useEffect, useState } from "react"
import { apiProformas, apiClientes, apiRepuestos } from "@/lib/api"

export default function Home() {
  const [stats, setStats] = useState({
    totalProformas: 0,
    proformasPendientes: 0,
    clientes: 0,
    repuestos: 0,
    repuestosBajoStock: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const [proformas, clientes, repuestos] = await Promise.all([
          apiProformas.list(),
          apiClientes.list(),
          apiRepuestos.list(),
        ])
        setStats({
          totalProformas: Array.isArray(proformas) ? proformas.length : 0,
          proformasPendientes: Array.isArray(proformas) ? proformas.filter((p: any) => p.estado === "pendiente").length : 0,
          clientes: Array.isArray(clientes) ? clientes.length : 0,
          repuestos: Array.isArray(repuestos) ? repuestos.length : 0,
          repuestosBajoStock: Array.isArray(repuestos) ? repuestos.filter((r: any) => Number(r.stock) <= Number(r.stockMinimo)).length : 0,
        })
      } catch {
        setStats({ totalProformas: 0, proformasPendientes: 0, clientes: 0, repuestos: 0, repuestosBajoStock: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-xl font-bold">Sistema de Proformas</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Gestión de proformas para repuestos de vehículos</p>
          </div>

          {/* Estadísticas visuales */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <DashboardStatsVisual
              title="Total Proformas"
              value={loading ? "-" : stats.totalProformas.toString()}
              description="Total registradas en el sistema"
              icon={<FileText className="h-8 w-8 text-blue-600" />}
              color="bg-blue-100"
              progress={stats.totalProformas > 0 ? 100 : 0}
            />
            <DashboardStatsVisual
              title="Proformas Pendientes"
              value={loading ? "-" : stats.proformasPendientes.toString()}
              description="Requieren seguimiento"
              icon={<CalendarDays className="h-8 w-8 text-yellow-500" />}
              color="bg-yellow-100"
              progress={stats.totalProformas > 0 ? Math.round((stats.proformasPendientes / stats.totalProformas) * 100) : 0}
            />
            <DashboardStatsVisual
              title="Clientes"
              value={loading ? "-" : stats.clientes.toString()}
              description="Total registrados"
              icon={<Users className="h-8 w-8 text-green-600" />}
              color="bg-green-100"
              progress={stats.clientes > 0 ? 100 : 0}
            />
            <DashboardStatsVisual
              title="Repuestos"
              value={loading ? "-" : stats.repuestos.toString()}
              description={`${stats.repuestosBajoStock} con stock bajo`}
              icon={<Package className="h-8 w-8 text-red-500" />}
              color="bg-red-100"
              progress={stats.repuestos > 0 ? Math.round((stats.repuestosBajoStock / stats.repuestos) * 100) : 0}
            />
          </div>

          {/* Tarjetas de navegación */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {/* Proformas */}
            <Card className="bg-blue-50 flex flex-col justify-between min-h-[270px] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-blue-200">
              <CardHeader className="flex flex-col items-center justify-center gap-2 flex-1">
                <FileText className="h-12 w-12 text-blue-600 mb-2 transition-colors duration-300 group-hover:text-blue-900" />
                <CardTitle className="text-xl text-center">Proformas</CardTitle>
                <CardDescription className="text-center">Gestiona y visualiza las proformas</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pb-4">
                <Link href="/proformas" className="w-full">
                  <Button variant="default" className="w-full">Ir a Proformas</Button>
                </Link>
              </CardFooter>
            </Card>
            {/* Clientes */}
            <Card className="bg-green-50 flex flex-col justify-between min-h-[270px] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-green-200">
              <CardHeader className="flex flex-col items-center justify-center gap-2 flex-1">
                <Users className="h-12 w-12 text-green-600 mb-2 transition-colors duration-300 group-hover:text-green-900" />
                <CardTitle className="text-xl text-center">Clientes</CardTitle>
                <CardDescription className="text-center">Gestiona la información de tus clientes</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pb-4">
                <Link href="/clientes" className="w-full">
                  <Button variant="default" className="w-full">Ir a Clientes</Button>
                </Link>
              </CardFooter>
            </Card>
            {/* Repuestos */}
            <Card className="bg-red-50 flex flex-col justify-between min-h-[270px] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-red-200">
              <CardHeader className="flex flex-col items-center justify-center gap-2 flex-1">
                <Package className="h-12 w-12 text-red-500 mb-2 transition-colors duration-300 group-hover:text-red-900" />
                <CardTitle className="text-xl text-center">Inventario de Repuestos</CardTitle>
                <CardDescription className="text-center">Gestiona tu inventario de repuestos</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center pb-4">
                <Link href="/repuestos" className="w-full">
                  <Button variant="default" className="w-full">Ir a Repuestos</Button>
                </Link>
              </CardFooter>
            </Card>
          {/* Vehículos */}
          <Card className="bg-yellow-50 flex flex-col justify-between min-h-[270px] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-yellow-200">
            <CardHeader className="flex flex-col items-center justify-center gap-2 flex-1">
              <CalendarDays className="h-12 w-12 text-yellow-500 mb-2 transition-colors duration-300 group-hover:text-yellow-900" />
              <CardTitle className="text-xl text-center">Vehículos</CardTitle>
              <CardDescription className="text-center">Gestiona la información de vehículos</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pb-4">
              <Link href="/vehiculos" className="w-full">
                <Button variant="default" className="w-full">Ir a Vehículos</Button>
              </Link>
            </CardFooter>
          </Card>
          {/* Reportes */}
          <Card className="bg-indigo-50 flex flex-col justify-between min-h-[270px] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-indigo-200">
            <CardHeader className="flex flex-col items-center justify-center gap-2 flex-1">
              <FileText className="h-12 w-12 text-indigo-600 mb-2 transition-colors duration-300 group-hover:text-indigo-900" />
              <CardTitle className="text-xl text-center">Reportes</CardTitle>
              <CardDescription className="text-center">Visualiza reportes de proformas y más</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pb-4">
              <Link href="/reportes" className="w-full">
                <Button variant="default" className="w-full">Ir a Reportes</Button>
              </Link>
            </CardFooter>
          </Card>
          {/* Entidades */}
          <Card className="bg-purple-50 flex flex-col justify-between min-h-[270px] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 hover:bg-purple-200">
            <CardHeader className="flex flex-col items-center justify-center gap-2 flex-1">
              <FileText className="h-12 w-12 text-purple-600 mb-2 transition-colors duration-300 group-hover:text-purple-900" />
              <CardTitle className="text-xl text-center">Entidades</CardTitle>
              <CardDescription className="text-center">Gestiona la información de tu empresa y sucursales</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pb-4">
              <Link href="/entidades" className="w-full">
                <Button variant="default" className="w-full">Ir a Entidades</Button>
              </Link>
            </CardFooter>
          </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Sistema de Gestión de Proformas. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
