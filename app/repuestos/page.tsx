"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MoreHorizontal, Plus, Search, Edit, Trash2, Package, AlertTriangle } from "lucide-react"
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

// Datos de ejemplo para repuestos
const repuestosData = [
  {
    id: 1,
    codigo: "REP001",
    descripcion: "Filtro de aceite Toyota Original",
    categoria: "Filtros",
    precio: 12.5,
    precioIva: 14.0,
    stock: 25,
    stockMinimo: 10,
    proveedor: "Toyota Ecuador",
    ubicacion: "A1-B2",
    estado: "activo",
  },
  {
    id: 2,
    codigo: "REP002",
    descripcion: "Pastillas de freno delanteras",
    categoria: "Frenos",
    precio: 45.0,
    precioIva: 50.4,
    stock: 15,
    stockMinimo: 5,
    proveedor: "Brembo",
    ubicacion: "B2-C3",
    estado: "activo",
  },
  {
    id: 3,
    codigo: "REP003",
    descripcion: "Amortiguador trasero",
    categoria: "Suspensión",
    precio: 85.0,
    precioIva: 95.2,
    stock: 3,
    stockMinimo: 5,
    proveedor: "Monroe",
    ubicacion: "C1-D2",
    estado: "activo",
  },
  {
    id: 4,
    codigo: "REP004",
    descripcion: "Batería 12V 60Ah",
    categoria: "Eléctrico",
    precio: 120.0,
    precioIva: 134.4,
    stock: 12,
    stockMinimo: 3,
    proveedor: "Bosch",
    ubicacion: "D3-E1",
    estado: "activo",
  },
  {
    id: 5,
    codigo: "REP005",
    descripcion: "Kit de distribución completo",
    categoria: "Motor",
    precio: 180.0,
    precioIva: 201.6,
    stock: 2,
    stockMinimo: 3,
    proveedor: "Gates",
    ubicacion: "E2-F3",
    estado: "activo",
  },
  {
    id: 6,
    codigo: "REP006",
    descripcion: "Aceite motor 5W-30 (4 litros)",
    categoria: "Lubricantes",
    precio: 28.0,
    precioIva: 31.36,
    stock: 30,
    stockMinimo: 15,
    proveedor: "Castrol",
    ubicacion: "F1-G2",
    estado: "activo",
  },
  {
    id: 7,
    codigo: "REP007",
    descripcion: "Filtro de aire",
    categoria: "Filtros",
    precio: 15.75,
    precioIva: 17.64,
    stock: 20,
    stockMinimo: 8,
    proveedor: "Mann Filter",
    ubicacion: "A2-B1",
    estado: "activo",
  },
  {
    id: 8,
    codigo: "REP008",
    descripcion: "Bujías NGK (set 4 unidades)",
    categoria: "Motor",
    precio: 32.0,
    precioIva: 35.84,
    stock: 18,
    stockMinimo: 10,
    proveedor: "NGK",
    ubicacion: "G3-H1",
    estado: "activo",
  },
]

function getStockStatus(stock: number, stockMinimo: number) {
  if (stock === 0) {
    return {
      color: "bg-red-100 text-red-800 hover:bg-red-100",
      text: "Sin stock",
      icon: <AlertTriangle className="h-3 w-3" />,
    }
  } else if (stock <= stockMinimo) {
    return {
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      text: "Stock bajo",
      icon: <AlertTriangle className="h-3 w-3" />,
    }
  } else {
    return { color: "bg-green-100 text-green-800 hover:bg-green-100", text: "En stock", icon: null }
  }
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") + "/repuestos/api_repuestos.php"

export default function RepuestosPage() {
  const [repuestos, setRepuestos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroStock, setFiltroStock] = useState("todos")
  const [ordenamiento, setOrdenamiento] = useState("codigo")
  const [loading, setLoading] = useState(true)

  // Obtener repuestos desde el backend
  useEffect(() => {
    const fetchRepuestos = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (busqueda) params.append("busqueda", busqueda)
      if (filtroCategoria && filtroCategoria !== "todas") params.append("categoria", filtroCategoria)
      if (filtroStock && filtroStock !== "todos") params.append("stock", filtroStock)
      if (ordenamiento) params.append("orden", ordenamiento)
      const url = `${BACKEND_URL}?${params.toString()}`
      try {
        const res = await fetch(url)
        const data = await res.json()
        setRepuestos(data)
      } catch (e) {
        setRepuestos([])
      } finally {
        setLoading(false)
      }
    }
    fetchRepuestos()
  }, [busqueda, filtroCategoria, filtroStock, ordenamiento])

  // Obtener categorías únicas
  const categorias = Array.from(new Set(repuestos.map((r) => r.categoria)))

  // Filtrar y ordenar repuestos
  const repuestosFiltrados = repuestos
    .filter((repuesto) => {
      const coincideBusqueda =
        repuesto.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        repuesto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        repuesto.proveedor.toLowerCase().includes(busqueda.toLowerCase())

      const coincideCategoria = filtroCategoria === "todas" || repuesto.categoria === filtroCategoria

      let coincideStock = true
      if (filtroStock === "bajo") {
        coincideStock = repuesto.stock <= repuesto.stockMinimo && repuesto.stock > 0
      } else if (filtroStock === "agotado") {
        coincideStock = repuesto.stock === 0
      } else if (filtroStock === "disponible") {
        coincideStock = repuesto.stock > repuesto.stockMinimo
      }

      return coincideBusqueda && coincideCategoria && coincideStock
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "codigo":
          return a.codigo.localeCompare(b.codigo)
        case "descripcion":
          return a.descripcion.localeCompare(b.descripcion)
        case "precio":
          return b.precio - a.precio
        case "stock":
          return a.stock - b.stock
        default:
          return 0
      }
    })

  const eliminarRepuesto = (id: number) => {
    setRepuestos(repuestos.filter((repuesto) => repuesto.id !== id))
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Inventario de Repuestos</h1>
            <p className="text-muted-foreground">Gestiona tu inventario de repuestos y servicios</p>
          </div>
        </div>
        <Link href="/repuestos/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Repuesto
          </Button>
        </Link>
      </div>

      {/* Alertas de stock */}
      {repuestos.filter((r) => r.stock <= r.stockMinimo).length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">
              {repuestos.filter((r) => r.stock === 0).length} repuestos agotados,{" "}
              {repuestos.filter((r) => r.stock <= r.stockMinimo && r.stock > 0).length} con stock bajo
            </span>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por código, descripción o proveedor..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {categorias.map((categoria, idx) => (
              <SelectItem key={categoria || idx} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroStock} onValueChange={setFiltroStock}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="bajo">Stock bajo</SelectItem>
            <SelectItem value="agotado">Agotado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ordenamiento} onValueChange={setOrdenamiento}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="codigo">Código</SelectItem>
            <SelectItem value="descripcion">Descripción</SelectItem>
            <SelectItem value="precio">Precio</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de repuestos */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead>Estado Stock</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repuestosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron repuestos
                </TableCell>
              </TableRow>
            ) : (
              repuestosFiltrados.map((repuesto, idx) => {
                const stockStatus = getStockStatus(repuesto.stock, repuesto.stockMinimo)
                return (
                  <TableRow key={repuesto.id || repuesto.codigo || idx}>
                    <TableCell className="font-mono font-medium">{repuesto.codigo}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{repuesto.descripcion}</div>
                        <div className="text-sm text-muted-foreground">Ubicación: {repuesto.ubicacion}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{repuesto.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium">
                          ${Number(repuesto.precio).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          +IVA: ${Number(repuesto.precioIva).toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium">{repuesto.stock}</div>
                      <div className="text-sm text-muted-foreground">Min: {repuesto.stockMinimo}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={stockStatus.color} variant="outline">
                        <div className="flex items-center gap-1">
                          {stockStatus.icon}
                          {stockStatus.text}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{repuesto.proveedor}</TableCell>
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
                            <Link href={`/repuestos/${repuesto.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/repuestos/${repuesto.id}/editar`}>
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
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el repuesto{" "}
                                  <strong>{repuesto.codigo}</strong> del inventario.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => eliminarRepuesto(repuesto.id)}
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
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Mostrando <strong>{repuestosFiltrados.length}</strong> de <strong>{repuestos.length}</strong> repuestos
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
