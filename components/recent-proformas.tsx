"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, MoreHorizontal, Printer } from "lucide-react"
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

export function RecentProformas() {
  const [proformas, setProformas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any>({})
  const [vehiculos, setVehiculos] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await apiProformas.list()
        setProformas(Array.isArray(data) ? data.slice(0, 10) : [])
        // Obtener clientes y vehículos únicos
        const clienteIds = [...new Set(data.map((p: any) => String(p.cliente_id)).filter(Boolean))] as string[];
        const vehiculoIds = [...new Set(data.map((p: any) => String(p.vehiculo_id)).filter(Boolean))] as string[];
        const clientesObj: Record<string, any> = {}
        const vehiculosObj: Record<string, any> = {}
        await Promise.all([
          ...clienteIds.map(async (id) => {
            try {
              clientesObj[id] = await apiClientes.get(id)
            } catch {}
          }),
          ...vehiculoIds.map(async (id) => {
            try {
              vehiculosObj[id] = await apiVehiculos.get(id)
            } catch {}
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
    fetchData()
  }, [])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Vehículo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Cargando...
              </TableCell>
            </TableRow>
          ) : proformas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No hay proformas recientes
              </TableCell>
            </TableRow>
          ) : (
            proformas.map((proforma) => (
              <TableRow key={proforma.id}>
                <TableCell className="font-medium">{proforma.numero}</TableCell>
                <TableCell>{clientes[proforma.cliente_id]?.nombre || proforma.cliente_id || "-"}</TableCell>
                <TableCell>{vehiculos[proforma.vehiculo_id]?.marca ? `${vehiculos[proforma.vehiculo_id]?.marca} ${vehiculos[proforma.vehiculo_id]?.modelo}` : proforma.vehiculo_id || "-"}</TableCell>
                <TableCell>{new Date(proforma.fecha).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">${Number(proforma.total).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(proforma.estado)} variant="outline">
                    {proforma.estado.charAt(0).toUpperCase() + proforma.estado.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/proformas/${proforma.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalles</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        <span>Imprimir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Generar factura</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
