"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MoreHorizontal, Plus, Search, Edit, Trash2, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"

// Datos de ejemplo para clientes
const clientesData = [
  {
    id: 1,
    nombre: "Juan Pérez García",
    ruc: "1234567890001",
    direccion: "Av. Principal 123, Quito",
    telefono: "+593 99 123-4567",
    email: "juan.perez@email.com",
    estado: "activo",
    fechaRegistro: "2023-01-15",
    vehiculos: 2,
  },
  {
    id: 2,
    nombre: "María López Sánchez",
    ruc: "9876543210001",
    direccion: "Calle Secundaria 456, Guayaquil",
    telefono: "+593 98 765-4321",
    email: "maria.lopez@email.com",
    estado: "activo",
    fechaRegistro: "2023-02-20",
    vehiculos: 1,
  },
  {
    id: 3,
    nombre: "Carlos Ruiz Mendoza",
    ruc: "5678901234001",
    direccion: "Av. Amazonas 789, Cuenca",
    telefono: "+593 97 555-1234",
    email: "carlos.ruiz@email.com",
    estado: "inactivo",
    fechaRegistro: "2023-03-10",
    vehiculos: 1,
  },
  {
    id: 4,
    nombre: "Ana Gómez Torres",
    ruc: "1357924680001",
    direccion: "Calle Los Pinos 321, Ambato",
    telefono: "+593 96 888-9999",
    email: "ana.gomez@email.com",
    estado: "activo",
    fechaRegistro: "2023-04-05",
    vehiculos: 3,
  },
  {
    id: 5,
    nombre: "Roberto Suárez Villa",
    ruc: "2468135790001",
    direccion: "Av. Central 654, Machala",
    telefono: "+593 95 777-8888",
    email: "roberto.suarez@email.com",
    estado: "activo",
    fechaRegistro: "2023-05-12",
    vehiculos: 1,
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "activo":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "inactivo":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState(clientesData)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [ordenamiento, setOrdenamiento] = useState("nombre")

  // Filtrar y ordenar clientes
  const clientesFiltrados = clientes
    .filter((cliente) => {
      const coincideBusqueda =
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.ruc.includes(busqueda) ||
        cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.telefono.includes(busqueda)

      const coincideEstado = filtroEstado === "todos" || cliente.estado === filtroEstado

      return coincideBusqueda && coincideEstado
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "nombre":
          return a.nombre.localeCompare(b.nombre)
        case "fecha":
          return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        case "vehiculos":
          return b.vehiculos - a.vehiculos
        default:
          return 0
      }
    })

  const eliminarCliente = (id: number) => {
    setClientes(clientes.filter((cliente) => cliente.id !== id))
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">Gestiona la información de tus clientes</p>
          </div>
        </div>
        <Link href="/clientes/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, RUC, email o teléfono..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ordenamiento} onValueChange={setOrdenamiento}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nombre">Nombre</SelectItem>
            <SelectItem value="fecha">Fecha registro</SelectItem>
            <SelectItem value="vehiculos">Vehículos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de clientes */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RUC/CI</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-center">Vehículos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell className="font-mono">{cliente.ruc}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{cliente.telefono}</div>
                      <div className="text-muted-foreground">{cliente.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{cliente.direccion}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{cliente.vehiculos}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cliente.estado)} variant="outline">
                      {cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(cliente.fechaRegistro).toLocaleDateString()}</TableCell>
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
                          <Link href={`/clientes/${cliente.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/clientes/${cliente.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{" "}
                                <strong>{cliente.nombre}</strong> y todos sus datos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => eliminarCliente(cliente.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando <strong>{clientesFiltrados.length}</strong> de <strong>{clientes.length}</strong> clientes
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
