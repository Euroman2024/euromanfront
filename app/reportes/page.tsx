"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiProformas, apiClientes } from "@/lib/api"
import { CalendarDays, Users, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BarChartProformasPorMes, BarChartVentasPorMes, PieChartEstados } from "./RechartsClient"

export default function ReportesPage() {
  const [proformas, setProformas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [filtroCliente, setFiltroCliente] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [proformas, clientes] = await Promise.all([
          apiProformas.list(),
          apiClientes.list(),
        ])
        setProformas(Array.isArray(proformas) ? proformas : [])
        setClientes(Array.isArray(clientes) ? clientes : [])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filtro por cliente y fecha
  const proformasFiltradas = proformas.filter((p) => {
    const clienteOk = !filtroCliente || (p.cliente_nombre || "").toLowerCase().includes(filtroCliente.toLowerCase())
    const fechaOk = !filtroFecha || (p.fecha || "").startsWith(filtroFecha)
    return clienteOk && fechaOk
  })

  // Agrupar por mes (cantidad)
  const proformasPorMes: Record<string, number> = {}
  // Agrupar ventas por mes (total vendido)
  const ventasPorMes: Record<string, number> = {}
  // Contar por estado
  const estados: Record<string, number> = {}
  proformas.forEach((p) => {
    const mes = (p.fecha || "").slice(0, 7)
    if (mes) {
      proformasPorMes[mes] = (proformasPorMes[mes] || 0) + 1
      // Solo sumar ventas de proformas "aprobadas" o "finalizadas"
      if (["aprobada", "finalizada", "cerrada", "vendida"].includes((p.estado || "").toLowerCase())) {
        ventasPorMes[mes] = (ventasPorMes[mes] || 0) + Number(p.total || 0)
      }
    }
    // Contar estados
    const estado = (p.estado || "desconocido").toLowerCase()
    estados[estado] = (estados[estado] || 0) + 1
  })

  // Datos para gráficos
  const proformasPorMesData = Object.entries(proformasPorMes).map(([mes, cantidad]) => ({ mes, cantidad }))
  const ventasPorMesData = Object.entries(ventasPorMes).map(([mes, total]) => ({ mes, total }))
  const estadosData = Object.entries(estados).map(([estado, cantidad]) => ({ name: estado, value: cantidad }))


  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><FileText className="h-7 w-7 text-blue-600" /> Reportes de Proformas</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-8">
        {/* Gráfico de barras: Proformas por mes */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-500" /> Proformas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartProformasPorMes data={proformasPorMesData} />
          </CardContent>
        </Card>
        {/* Gráfico de barras: Ventas por mes */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-green-700" /> Ventas Totales por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartVentasPorMes data={ventasPorMesData} />
          </CardContent>
        </Card>
        {/* Gráfico de pastel: Proformas por estado */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-gray-600" /> Proformas por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartEstados data={estadosData} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        {/* Tabla: Proformas por Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-green-600" /> Proformas por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Buscar cliente..." value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} className="mb-2" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((c) => {
                  const count = proformas.filter((p) => p.cliente_id === c.id).length
                  if (filtroCliente && !c.nombre.toLowerCase().includes(filtroCliente.toLowerCase())) return null
                  return (
                    <TableRow key={c.id}>
                      <TableCell>{c.nombre}</TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Tabla: Proformas filtradas por fecha y cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="month" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} className="mb-2" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proformasFiltradas.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.numero}</TableCell>
                    <TableCell>{p.fecha}</TableCell>
                    <TableCell>{p.cliente_nombre || p.cliente_id}</TableCell>
                    <TableCell className="text-right">${Number(p.total).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
