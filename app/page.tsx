"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, FileText, Package, Users } from "lucide-react"
import Link from "next/link"
import { DashboardStats } from "@/components/dashboard-stats"
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

          {/* Estadísticas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <DashboardStats
              title="Total Proformas"
              value={loading ? "-" : stats.totalProformas.toString()}
              description={loading ? "" : "Total registradas en el sistema"}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardStats
              title="Proformas Pendientes"
              value={loading ? "-" : stats.proformasPendientes.toString()}
              description={loading ? "" : `${stats.proformasPendientes} requieren seguimiento`}
              icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardStats
              title="Clientes"
              value={loading ? "-" : stats.clientes.toString()}
              description={loading ? "" : `Total registrados`}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <DashboardStats
              title="Repuestos"
              value={loading ? "-" : stats.repuestos.toString()}
              description={loading ? "" : `${stats.repuestosBajoStock} con stock bajo`}
              icon={<Package className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Tarjetas de navegación */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Proformas</CardTitle>
                <CardDescription>Gestiona y visualiza las proformas</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/proformas">
                  <Button variant="default" className="w-full">Ir a Proformas</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Clientes</CardTitle>
                <CardDescription>Gestiona la información de tus clientes</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/clientes">
                  <Button variant="default" className="w-full">Ir a Clientes</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Inventario de Repuestos</CardTitle>
                <CardDescription>Gestiona tu inventario de repuestos</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/repuestos">
                  <Button variant="default" className="w-full">Ir a Repuestos</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Vehículos</CardTitle>
                <CardDescription>Gestiona la información de vehículos</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/vehiculos">
                  <Button variant="default" className="w-full">Ir a Vehículos</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Entidades</CardTitle>
                <CardDescription>Gestiona la información de tu empresa y sucursales</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/entidades">
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
