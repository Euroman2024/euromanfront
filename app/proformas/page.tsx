"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileText, MoreHorizontal, Plus, Printer, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useEffect, useState } from "react"
import { apiProformas, apiClientes, apiVehiculos } from "@/lib/api"

// Función para obtener el color de la badge según el estado
function getStatusColor(status: string) {
  switch (status) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "aprobada":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "rechazada":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "facturada":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

interface Proforma {
  id: number;
  numero: string;
  cliente?: string;
  vehiculo?: string;
  placa?: string;
  fecha: string;
  total: number;
  estado: string;
}

export default function ProformasPage() {
  const [proformas, setProformas] = useState<Proforma[]>([])
  const [clientes, setClientes] = useState<Record<string, any>>({})
  const [vehiculos, setVehiculos] = useState<Record<string, any>>({})
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [ordenamiento, setOrdenamiento] = useState("fecha")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProformas = async () => {
      setLoading(true)
      try {
        const data = await apiProformas.list()
        setProformas(Array.isArray(data) ? data : [])
        // Obtener ids únicos
        const clienteIds = [...new Set(data.map((p: any) => String(p.cliente_id)).filter(Boolean))] as string[];
        const vehiculoIds = [...new Set(data.map((p: any) => String(p.vehiculo_id)).filter(Boolean))] as string[];
        const clientesObj: Record<string, any> = {}
        const vehiculosObj: Record<string, any> = {}
        await Promise.all([
          ...clienteIds.map(async (id) => {
            try { clientesObj[id] = await apiClientes.get(id) } catch {}
          }),
          ...vehiculoIds.map(async (id) => {
            try { vehiculosObj[id] = await apiVehiculos.get(id) } catch {}
          })
        ])
        setClientes(clientesObj)
        setVehiculos(vehiculosObj)
      } catch {
        setProformas([])
      } finally {
        setLoading(false)
      }
    }
    fetchProformas()
  }, [])

  const eliminarProforma = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta proforma?")) return
    await apiProformas.delete(id)
    setProformas(proformas.filter((p) => p.id !== id))
  }

  // Filtrar y ordenar proformas
  const proformasFiltradas = proformas
    .filter((proforma) => {
      const clienteId = (proforma as any).cliente_id || "";
      const vehiculoId = (proforma as any).vehiculo_id || "";
      const clienteNombre = proforma.cliente || clientes[clienteId]?.nombre || "";
      const vehiculoObj = vehiculos[vehiculoId] || {};
      // Combina marca y modelo para búsqueda más robusta
      const vehiculoMarca = vehiculoObj.marca || "";
      const vehiculoModelo = vehiculoObj.modelo || "";
      const vehiculoNombreCompleto = `${vehiculoMarca} ${vehiculoModelo}`.trim();
      const placa = proforma.placa || vehiculoObj.placa || "";
      const busquedaLower = busqueda.toLowerCase();
      const coincideBusqueda =
        (proforma.numero?.toLowerCase() || "").includes(busquedaLower) ||
        clienteNombre.toLowerCase().includes(busquedaLower) ||
        vehiculoMarca.toLowerCase().includes(busquedaLower) ||
        vehiculoModelo.toLowerCase().includes(busquedaLower) ||
        vehiculoNombreCompleto.toLowerCase().includes(busquedaLower) ||
        placa.toLowerCase().includes(busquedaLower);
      const coincideEstado = filtroEstado === "todos" || proforma.estado === filtroEstado;
      return coincideBusqueda && coincideEstado;
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "fecha":
        case "reciente":
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        case "antiguo":
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        case "mayor":
          return Number(b.total) - Number(a.total)
        case "menor":
          return Number(a.total) - Number(b.total)
        default:
          return 0
      }
    })

  return (
    <div className="container py-10">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Regresar</Button>
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Proformas</h1>
        <Link href="/proformas/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Proforma
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por cliente, número o placa..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select
          defaultValue="todos"
          onValueChange={(value) => setFiltroEstado(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="aprobada">Aprobada</SelectItem>
            <SelectItem value="rechazada">Rechazada</SelectItem>
            <SelectItem value="facturada">Facturada</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue="reciente"
          onValueChange={(value) => setOrdenamiento(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reciente">Más reciente</SelectItem>
            <SelectItem value="antiguo">Más antiguo</SelectItem>
            <SelectItem value="mayor">Mayor monto</SelectItem>
            <SelectItem value="menor">Menor monto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proformasFiltradas.map((proforma) => (
              <TableRow key={proforma.id}>
                <TableCell className="font-medium">{proforma.numero}</TableCell>
                <TableCell>{clientes[String((proforma as any).cliente_id)]?.nombre || "-"}</TableCell>
                <TableCell>{vehiculos[String((proforma as any).vehiculo_id)] ? `${vehiculos[String((proforma as any).vehiculo_id)]?.marca} ${vehiculos[String((proforma as any).vehiculo_id)]?.modelo}` : "-"}</TableCell>
                <TableCell>{vehiculos[String((proforma as any).vehiculo_id)]?.placa || "-"}</TableCell>
                <TableCell>{new Date(proforma.fecha).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">${Number(proforma.total).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(proforma.estado)} variant="outline">
                    {proforma.estado.charAt(0).toUpperCase() + proforma.estado.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/proformas/${proforma.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando <strong>{proformasFiltradas.length}</strong> de <strong>{proformas.length}</strong> proformas
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
