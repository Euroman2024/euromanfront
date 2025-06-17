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

// Datos de ejemplo para proformas
const proformas = [
  {
    id: 1,
    numero: "PRO-2023-001",
    cliente: "Juan Pérez",
    vehiculo: "Toyota Corolla",
    placa: "ABC-123",
    fecha: "2023-05-15",
    total: 245.6,
    estado: "pendiente",
  },
  {
    id: 2,
    numero: "PRO-2023-002",
    cliente: "María López",
    vehiculo: "Chevrolet Aveo",
    placa: "DEF-456",
    fecha: "2023-05-14",
    total: 189.3,
    estado: "aprobada",
  },
  {
    id: 3,
    numero: "PRO-2023-003",
    cliente: "Carlos Ruiz",
    vehiculo: "Kia Sportage",
    placa: "GHI-789",
    fecha: "2023-05-12",
    total: 567.8,
    estado: "facturada",
  },
  {
    id: 4,
    numero: "PRO-2023-004",
    cliente: "Ana Gómez",
    vehiculo: "Hyundai Tucson",
    placa: "JKL-012",
    fecha: "2023-05-10",
    total: 320.45,
    estado: "rechazada",
  },
  {
    id: 5,
    numero: "PRO-2023-005",
    cliente: "Roberto Suárez",
    vehiculo: "Nissan X-Trail",
    placa: "MNO-345",
    fecha: "2023-05-08",
    total: 412.75,
    estado: "pendiente",
  },
  {
    id: 6,
    numero: "PRO-2023-006",
    cliente: "Lucía Martínez",
    vehiculo: "Ford Escape",
    placa: "PQR-678",
    fecha: "2023-05-07",
    total: 289.95,
    estado: "aprobada",
  },
  {
    id: 7,
    numero: "PRO-2023-007",
    cliente: "Pedro Sánchez",
    vehiculo: "Mazda CX-5",
    placa: "STU-901",
    fecha: "2023-05-05",
    total: 378.2,
    estado: "pendiente",
  },
  {
    id: 8,
    numero: "PRO-2023-008",
    cliente: "Carmen Rodríguez",
    vehiculo: "Volkswagen Golf",
    placa: "VWX-234",
    fecha: "2023-05-03",
    total: 156.8,
    estado: "facturada",
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

export default function ProformasPage() {
  return (
    <div className="container py-10">
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
          <Input type="search" placeholder="Buscar por cliente, número o placa..." className="pl-8" />
        </div>
        <Select defaultValue="todos">
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
        <Select defaultValue="reciente">
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
            {proformas.map((proforma) => (
              <TableRow key={proforma.id}>
                <TableCell className="font-medium">{proforma.numero}</TableCell>
                <TableCell>{proforma.cliente}</TableCell>
                <TableCell>{proforma.vehiculo}</TableCell>
                <TableCell>{proforma.placa}</TableCell>
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
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

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando <strong>8</strong> de <strong>8</strong> proformas
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
