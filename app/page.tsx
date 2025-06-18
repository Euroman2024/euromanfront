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
          <nav className="flex items-center gap-4">
            <Link href="/proformas/nueva">
              <Button>Nueva Proforma</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Gestión de proformas para repuestos de vehículos</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

          <div className="mt-8">
            <Tabs defaultValue="proformas" className="w-full">
              <TabsList className="grid w-full grid-cols-5 md:w-auto">
                <TabsTrigger value="proformas">Proformas</TabsTrigger>
                <TabsTrigger value="clientes">Clientes</TabsTrigger>
                <TabsTrigger value="repuestos">Repuestos</TabsTrigger>
                <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
                <TabsTrigger value="entidades">Entidades</TabsTrigger>
              </TabsList>
              <TabsContent value="proformas" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Proformas Recientes</CardTitle>
                    <CardDescription>Gestiona y visualiza las últimas proformas creadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentProformas />
                  </CardContent>
                  <CardFooter>
                    <Link href="/proformas">
                      <Button variant="outline">Ver todas las proformas</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="clientes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Clientes</CardTitle>
                    <CardDescription>Gestiona la información de tus clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenido de clientes...</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/clientes">
                      <Button variant="outline">Ver todos los clientes</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="repuestos" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Inventario de Repuestos</CardTitle>
                    <CardDescription>Gestiona tu inventario de repuestos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenido de repuestos...</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/repuestos">
                      <Button variant="outline">Ver todos los repuestos</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="vehiculos" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Vehículos</CardTitle>
                    <CardDescription>Gestiona la información de vehículos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenido de vehículos...</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/vehiculos">
                      <Button variant="outline">Ver todos los vehículos</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="entidades" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Entidades</CardTitle>
                    <CardDescription>Gestiona la información de tu empresa y sucursales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenido de entidades...</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/entidades">
                      <Button variant="outline">Ver todas las entidades</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
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
