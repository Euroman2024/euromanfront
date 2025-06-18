"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MoreHorizontal, Plus, Search, Edit, Trash2, Car } from "lucide-react"
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
import { apiVehiculos } from "@/lib/api"

// Datos de ejemplo para vehículos
const vehiculosData = [
  {
    id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    anio: "2018",
    placa: "ABC-123",
    color: "Blanco",
    clienteId: 1,
    clienteNombre: "Juan Pérez García",
    vin: "1HGBH41JXMN109186",
    motor: "1.8L 4 cilindros",
    combustible: "Gasolina",
    transmision: "Manual",
    kilometraje: "45000",
    estado: "activo",
    fechaRegistro: "2023-01-20",
  },
  {
    id: 2,
    marca: "Nissan",
    modelo: "Sentra",
    anio: "2020",
    placa: "DEF-456",
    color: "Gris",
    clienteId: 1,
    clienteNombre: "Juan Pérez García",
    vin: "3N1AB7AP5LY123456",
    motor: "1.6L 4 cilindros",
    combustible: "Gasolina",
    transmision: "CVT",
    kilometraje: "25000",
    estado: "activo",
    fechaRegistro: "2023-02-15",
  },
  {
    id: 3,
    marca: "Chevrolet",
    modelo: "Aveo",
    anio: "2019",
    placa: "GHI-789",
    color: "Rojo",
    clienteId: 2,
    clienteNombre: "María López Sánchez",
    vin: "KL1TD66E09B123456",
    motor: "1.4L 4 cilindros",
    combustible: "Gasolina",
    transmision: "Manual",
    kilometraje: "38000",
    estado: "activo",
    fechaRegistro: "2023-03-10",
  },
  {
    id: 4,
    marca: "Kia",
    modelo: "Sportage",
    anio: "2021",
    placa: "JKL-012",
    color: "Negro",
    clienteId: 3,
    clienteNombre: "Carlos Ruiz Mendoza",
    vin: "KNDPM3AC5M7123456",
    motor: "2.0L 4 cilindros",
    combustible: "Gasolina",
    transmision: "Automática",
    kilometraje: "15000",
    estado: "activo",
    fechaRegistro: "2023-04-05",
  },
  {
    id: 5,
    marca: "Hyundai",
    modelo: "Accent",
    anio: "2022",
    placa: "MNO-345",
    color: "Azul",
    clienteId: 2,
    clienteNombre: "María López Sánchez",
    vin: "KMHC65LA5NU123456",
    motor: "1.6L 4 cilindros",
    combustible: "Gasolina",
    transmision: "Manual",
    kilometraje: "8000",
    estado: "activo",
    fechaRegistro: "2023-05-12",
  },
]

interface Vehiculo {
  id: number;
  cliente_id: number;
  marca: string;
  modelo: string;
  anio: number | string;
  placa: string;
  color: string;
  vin?: string;
  motor?: string;
  combustible: string;
  transmision: string;
  kilometraje: number | string;
  estado: string;
  fechaRegistro?: string;
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [ordenamiento, setOrdenamiento] = useState("placa")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehiculos = async () => {
      setLoading(true)
      try {
        const data = await apiVehiculos.list()
        setVehiculos(Array.isArray(data) ? data : [])
      } catch {
        setVehiculos([])
      } finally {
        setLoading(false)
      }
    }
    fetchVehiculos()
  }, [])

  const eliminarVehiculo = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vehículo?")) return
    await apiVehiculos.delete(id)
    setVehiculos(vehiculos.filter((v) => v.id !== id))
  }

  // Filtrar y ordenar vehículos
  const vehiculosFiltrados = vehiculos
    .filter((vehiculo) => {
      const coincideBusqueda =
        (vehiculo.marca?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
        (vehiculo.modelo?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
        (vehiculo.placa || "").includes(busqueda) ||
        (vehiculo.color?.toLowerCase() || "").includes(busqueda.toLowerCase())
      const coincideEstado = filtroEstado === "todos" || vehiculo.estado === filtroEstado
      return coincideBusqueda && coincideEstado
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "placa":
          return a.placa.localeCompare(b.placa)
        default:
          return 0
      }
    })

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Car className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Vehículos</h1>
            <p className="text-muted-foreground">Gestiona la información de vehículos de tus clientes</p>
          </div>
        </div>
        <Link href="/vehiculos/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Vehículo
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Regresar</Button>
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por placa, marca, modelo o color..."
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
            <SelectItem value="activo">Activos</SelectItem>
            <SelectItem value="inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ordenamiento} onValueChange={setOrdenamiento}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placa">Placa</SelectItem>
            <SelectItem value="marca">Marca</SelectItem>
            <SelectItem value="anio">Año</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de vehículos */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Motor</TableHead>
              <TableHead>Transmisión</TableHead>
              <TableHead className="text-center">Kilometraje</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehiculosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron vehículos
                </TableCell>
              </TableRow>
            ) : (
              vehiculosFiltrados.map((vehiculo) => (
                <TableRow key={vehiculo.id}>
                  <TableCell className="font-mono font-medium">{vehiculo.placa}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {vehiculo.marca} {vehiculo.modelo}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {vehiculo.anio} - {vehiculo.color}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{vehiculo.clienteNombre}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{vehiculo.motor}</div>
                      <div className="text-muted-foreground">{vehiculo.combustible}</div>
                    </div>
                  </TableCell>
                  <TableCell>{vehiculo.transmision}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{Number(vehiculo.kilometraje).toLocaleString()} km</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
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
                          <Link href={`/vehiculos/${vehiculo.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/vehiculos/${vehiculo.id}/editar`}>
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
                                Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo{" "}
                                <strong>{vehiculo.placa}</strong> y todos sus datos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => eliminarVehiculo(vehiculo.id)}
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
          Mostrando <strong>{vehiculosFiltrados.length}</strong> de <strong>{vehiculos.length}</strong> vehículos
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
