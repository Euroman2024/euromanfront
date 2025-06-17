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

// Datos de ejemplo para proformas recientes
const recentProformas = [
  {
    id: 1,
    numero: "PRO-2023-001",
    cliente: "Juan Pérez",
    vehiculo: "Toyota Corolla",
    fecha: "2023-05-15",
    total: 245.6,
    estado: "pendiente",
  },
  {
    id: 2,
    numero: "PRO-2023-002",
    cliente: "María López",
    vehiculo: "Chevrolet Aveo",
    fecha: "2023-05-14",
    total: 189.3,
    estado: "aprobada",
  },
  {
    id: 3,
    numero: "PRO-2023-003",
    cliente: "Carlos Ruiz",
    vehiculo: "Kia Sportage",
    fecha: "2023-05-12",
    total: 567.8,
    estado: "facturada",
  },
  {
    id: 4,
    numero: "PRO-2023-004",
    cliente: "Ana Gómez",
    vehiculo: "Hyundai Tucson",
    fecha: "2023-05-10",
    total: 320.45,
    estado: "rechazada",
  },
  {
    id: 5,
    numero: "PRO-2023-005",
    cliente: "Roberto Suárez",
    vehiculo: "Nissan X-Trail",
    fecha: "2023-05-08",
    total: 412.75,
    estado: "pendiente",
  },
]

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
          {recentProformas.map((proforma) => (
            <TableRow key={proforma.id}>
              <TableCell className="font-medium">{proforma.numero}</TableCell>
              <TableCell>{proforma.cliente}</TableCell>
              <TableCell>{proforma.vehiculo}</TableCell>
              <TableCell>{new Date(proforma.fecha).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">${proforma.total.toFixed(2)}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
