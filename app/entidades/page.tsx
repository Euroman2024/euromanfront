"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MoreHorizontal, Plus, Search, Edit, Trash2, Building2 } from "lucide-react"
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
import { apiEntidades } from "@/lib/api"

// Eliminar datos simulados y conectar al backend
export default function EntidadesPage() {
  interface Entidad {
    id: number;
    nombre: string;
    propietario: string;
    ruc: string;
    direccion: string;
    telefono: string;
    email: string;
    tipo: string;
    estado: string;
    fechaRegistro?: string;
    logo?: string | null;
  }

  const [entidades, setEntidades] = useState<Entidad[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [ordenamiento, setOrdenamiento] = useState("nombre")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntidades = async () => {
      setLoading(true)
      try {
        const data = await apiEntidades.list()
        setEntidades(Array.isArray(data) ? data : [])
      } catch {
        setEntidades([])
      } finally {
        setLoading(false)
      }
    }
    fetchEntidades()
  }, [])

  const eliminarEntidad = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta entidad?")) return
    await apiEntidades.delete(id)
    setEntidades(entidades.filter((e) => e.id !== id))
  }

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

  function getTipoColor(tipo: string) {
    switch (tipo) {
      case "matriz":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "sucursal":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Filtrar y ordenar entidades
  const entidadesFiltradas = entidades
    .filter((entidad) => {
      const coincideBusqueda =
        (entidad.nombre?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
        (entidad.propietario?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
        (entidad.ruc || "").includes(busqueda) ||
        (entidad.email?.toLowerCase() || "").includes(busqueda.toLowerCase())

      const coincideTipo = filtroTipo === "todos" || entidad.tipo === filtroTipo
      const coincideEstado = filtroEstado === "todos" || entidad.estado === filtroEstado

      return coincideBusqueda && coincideTipo && coincideEstado
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "nombre":
          return a.nombre.localeCompare(b.nombre)
        default:
          return 0
      }
    })

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Entidades</h1>
            <p className="text-muted-foreground">Gestiona la información de tu empresa y sucursales</p>
          </div>
        </div>
        <Link href="/entidades/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Entidad
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
            placeholder="Buscar por nombre, propietario, RUC o email..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="matriz">Matriz</SelectItem>
            <SelectItem value="sucursal">Sucursal</SelectItem>
          </SelectContent>
        </Select>
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
            <SelectItem value="tipo">Tipo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de entidades */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Propietario</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entidadesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No se encontraron entidades
                </TableCell>
              </TableRow>
            ) : (
              entidadesFiltradas.map((entidad) => (
                <TableRow key={entidad.id}>
                  <TableCell>
                    {entidad.logo ? (
                      <img src={entidad.logo} alt="Logo" className="h-10 w-10 object-contain rounded border mb-1" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin logo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{entidad.nombre}</div>
                    <div className="text-sm text-muted-foreground max-w-xs truncate">{entidad.direccion}</div>
                  </TableCell>
                  <TableCell>{entidad.propietario}</TableCell>
                  <TableCell className="font-mono">{entidad.ruc}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{entidad.telefono}</div>
                      <div className="text-muted-foreground">{entidad.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoColor(entidad.tipo)} variant="outline">
                      {entidad.tipo.charAt(0).toUpperCase() + entidad.tipo.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(entidad.estado)} variant="outline">
                      {entidad.estado.charAt(0).toUpperCase() + entidad.estado.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(entidad.fechaRegistro).toLocaleDateString()}</TableCell>
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
                          <Link href={`/entidades/${entidad.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/entidades/${entidad.id}/editar`}>
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
                                Esta acción no se puede deshacer. Se eliminará permanentemente la entidad{" "}
                                <strong>{entidad.nombre}</strong> y todos sus datos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => eliminarEntidad(entidad.id)}
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
          Mostrando <strong>{entidadesFiltradas.length}</strong> de <strong>{entidades.length}</strong> entidades
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
