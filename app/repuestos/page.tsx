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
import { apiRepuestos } from "@/lib/api"

// Tipado para los repuestos
interface Repuesto {
  id: number;
  codigo: string;
  descripcion: string;
  categoria: string;
  precio: number | string;
  precioIva: number | string;
  stock: number;
  stockMinimo: number;
  proveedor: string;
  ubicacion: string;
  estado: string;
}

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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") + "/repuestos"

export default function RepuestosPage() {
  // Login overlay state
  const [showLogin, setShowLogin] = useState(true);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [backendError, setBackendError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === "ADMIN" && loginPass === "ADMIN123") {
      setShowLogin(false);
      setLoginError("");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  } 
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [total, setTotal] = useState(0)
  const [busqueda, setBusqueda] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroStock, setFiltroStock] = useState("todos")
  const [ordenamiento, setOrdenamiento] = useState("codigo")
  const [loading, setLoading] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(20)

  // Obtener repuestos desde el backend
  useEffect(() => {
    const fetchRepuestos = async () => {
      setLoading(true)
      setBackendError(null)
      const params = new URLSearchParams()
      if (busqueda) params.append("busqueda", busqueda)
      if (filtroCategoria && filtroCategoria !== "todas") params.append("categoria", filtroCategoria)
      if (filtroStock && filtroStock !== "todos") params.append("stock", filtroStock)
      if (ordenamiento) params.append("orden", ordenamiento)
      params.append("limit", String(limite))
      params.append("offset", String((pagina - 1) * limite))
      const url = `${BACKEND_URL}?${params.toString()}`
      try {
        const res = await fetch(url, {
          headers: {
            'ngrok-skip-browser-warning': 'any'
          }
        })
        const data = await res.json()
        if ((data && data.code === 403) || data.error) {
          setBackendError(data.error || 'Error desconocido del backend');
          setRepuestos([])
          setTotal(0)
        } else if (data && Array.isArray(data.data)) {
          setRepuestos(
            data.data.map((r: any) => ({
              ...r,
              id: Number(r.id),
              stock: Number(r.stock),
              stockMinimo: Number(r.stock_minimo ?? r.stockMinimo),
              precio: Number(r.precio),
              precioIva: Number(r.precio_iva ?? r.precioIva),
            }))
          );
          setTotal(Number(data.total || 0));
        } else {
          setRepuestos([])
          setTotal(0)
        }
      } catch (e) {
        setBackendError('Error de red o formato de respuesta inválido');
        setRepuestos([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    fetchRepuestos()
  }, [busqueda, filtroCategoria, filtroStock, ordenamiento, pagina, limite])

  // Obtener categorías únicas (de los repuestos actuales)
  const categorias = Array.from(new Set(repuestos.map((r) => r.categoria)))

  // Ya no filtramos ni ordenamos en frontend, lo hace el backend
  const repuestosFiltrados = repuestos

  const eliminarRepuesto = async (id: number) => {
    try {
      await apiRepuestos.delete(id)
      setRepuestos((prev) => prev.filter((repuesto) => repuesto.id !== id))
    } catch (error) {
      alert("Error al eliminar el repuesto")
    }
  }

  return (
    <>
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
          <div className="w-full max-w-xs">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative border border-blue-200">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-blue-600 rounded-full p-3 mb-2 shadow">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-blue-700 mb-1">Acceso Inventario</h2>
                <p className="text-sm text-gray-500 mb-2">Ingresa tus credenciales para continuar</p>
              </div>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Usuario"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  className="border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  className="border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
                {loginError && <div className="text-xs text-red-600 text-center font-medium">{loginError}</div>}
                <button type="submit" className="bg-blue-600 text-white rounded-lg px-3 py-2 font-semibold shadow hover:bg-blue-700 transition">Acceder</button>
                <div className="absolute top-2 right-2 text-xs text-gray-400 select-none">ADMIN / ADMIN123</div>
              </form>
              <div className="mt-6 flex justify-center">
                <Link href="/">
                  <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium shadow border border-gray-300 transition">Regresar</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    {!showLogin ? (
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

      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Regresar</Button>
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

      {/* Error del backend */}
      {backendError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          <strong>Error:</strong> {backendError}
        </div>
      )}
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
          Mostrando <strong>{(pagina - 1) * limite + 1}</strong> - <strong>{(pagina - 1) * limite + repuestosFiltrados.length}</strong> de <strong>{total}</strong> repuestos
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1 || loading}
          >
            Anterior
          </Button>
          <span className="text-xs">Página {pagina} de {Math.max(1, Math.ceil(total / limite))}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina >= Math.ceil(total / limite) || loading}
          >
            Siguiente
          </Button>
        </div>
      </div>
      </div>
    ) : null}
    </>
  )
}
