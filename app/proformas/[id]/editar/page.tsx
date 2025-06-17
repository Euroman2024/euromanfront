"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Save, Trash2, Search, Calculator, FileText, X, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

// Datos de ejemplo (mismos que en nueva proforma)
const clientes = [
  {
    id: 1,
    nombre: "Juan Pérez García",
    ruc: "1234567890001",
    direccion: "Av. Principal 123, Quito",
    telefono: "+593 99 123-4567",
    email: "juan.perez@email.com",
  },
  {
    id: 2,
    nombre: "María López Sánchez",
    ruc: "9876543210001",
    direccion: "Calle Secundaria 456, Guayaquil",
    telefono: "+593 98 765-4321",
    email: "maria.lopez@email.com",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz Mendoza",
    ruc: "5678901234001",
    direccion: "Av. Amazonas 789, Cuenca",
    telefono: "+593 97 555-1234",
    email: "carlos.ruiz@email.com",
  },
]

const vehiculos = [
  { id: 1, clienteId: 1, marca: "Toyota", modelo: "Corolla", anio: "2018", placa: "ABC-123", color: "Blanco" },
  { id: 2, clienteId: 1, marca: "Nissan", modelo: "Sentra", anio: "2020", placa: "DEF-456", color: "Gris" },
  { id: 3, clienteId: 2, marca: "Chevrolet", modelo: "Aveo", anio: "2019", placa: "GHI-789", color: "Rojo" },
  { id: 4, clienteId: 3, marca: "Kia", modelo: "Sportage", anio: "2021", placa: "JKL-012", color: "Negro" },
  { id: 5, clienteId: 2, marca: "Hyundai", modelo: "Accent", anio: "2022", placa: "MNO-345", color: "Azul" },
]

const repuestos = [
  {
    id: 1,
    codigo: "REP001",
    descripcion: "Filtro de aceite Toyota Original",
    precio: 12.5,
    precioIva: 14.0,
    stock: 25,
    categoria: "Filtros",
  },
  {
    id: 2,
    codigo: "REP002",
    descripcion: "Pastillas de freno delanteras",
    precio: 45.0,
    precioIva: 50.4,
    stock: 15,
    categoria: "Frenos",
  },
  {
    id: 3,
    codigo: "REP003",
    descripcion: "Amortiguador trasero",
    precio: 85.0,
    precioIva: 95.2,
    stock: 8,
    categoria: "Suspensión",
  },
  {
    id: 4,
    codigo: "REP004",
    descripcion: "Batería 12V 60Ah",
    precio: 120.0,
    precioIva: 134.4,
    stock: 12,
    categoria: "Eléctrico",
  },
  {
    id: 5,
    codigo: "REP005",
    descripcion: "Kit de distribución completo",
    precio: 180.0,
    precioIva: 201.6,
    stock: 5,
    categoria: "Motor",
  },
  {
    id: 6,
    codigo: "REP006",
    descripcion: "Aceite motor 5W-30 (4 litros)",
    precio: 28.0,
    precioIva: 31.36,
    stock: 30,
    categoria: "Lubricantes",
  },
  {
    id: 7,
    codigo: "REP007",
    descripcion: "Filtro de aire",
    precio: 15.75,
    precioIva: 17.64,
    stock: 20,
    categoria: "Filtros",
  },
  {
    id: 8,
    codigo: "REP008",
    descripcion: "Bujías NGK (set 4 unidades)",
    precio: 32.0,
    precioIva: 35.84,
    stock: 18,
    categoria: "Motor",
  },
  {
    id: 9,
    codigo: "SER001",
    descripcion: "Mano de obra - Mantenimiento básico",
    precio: 35.0,
    precioIva: 39.2,
    stock: 999,
    categoria: "Servicios",
  },
  {
    id: 10,
    codigo: "SER002",
    descripcion: "Mano de obra - Cambio de frenos",
    precio: 25.0,
    precioIva: 28.0,
    stock: 999,
    categoria: "Servicios",
  },
]

// Datos de ejemplo de la proforma existente
const proformaExistente = {
  id: 1,
  numeroProforma: "PRO-2023-001",
  fecha: "2023-05-15",
  clienteId: "1",
  vehiculoId: "1",
  km: "45000",
  descripcion: "Mantenimiento preventivo y cambio de repuestos",
  items: [
    {
      id: 1,
      repuestoId: 1,
      codigo: "REP001",
      descripcion: "Filtro de aceite Toyota Original",
      cantidad: 1,
      precioUnitario: 12.5,
      precioTotal: 12.5,
      stock: 25,
      categoria: "Filtros",
    },
    {
      id: 2,
      repuestoId: 2,
      codigo: "REP002",
      descripcion: "Pastillas de freno delanteras",
      cantidad: 1,
      precioUnitario: 45.0,
      precioTotal: 45.0,
      stock: 15,
      categoria: "Frenos",
    },
    {
      id: 3,
      repuestoId: 9,
      codigo: "SER001",
      descripcion: "Mano de obra - Mantenimiento básico",
      cantidad: 1,
      precioUnitario: 35.0,
      precioTotal: 35.0,
      stock: 999,
      categoria: "Servicios",
    },
  ],
  notaAviso: "Esta proforma tiene validez de 15 días a partir de la fecha de emisión.",
  aviso: "Los precios incluyen IVA. Garantía de 30 días en repuestos y 15 días en mano de obra.",
}

interface ProformaItem {
  id: number
  repuestoId: number
  codigo: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  precioTotal: number
  stock: number
  categoria: string
}

interface ProformaData {
  numeroProforma: string
  fecha: string
  clienteId: string
  vehiculoId: string
  km: string
  descripcion: string
  items: ProformaItem[]
  notaAviso: string
  aviso: string
}

export default function EditarProformaPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Estados del formulario - inicializar con datos existentes
  const [formData, setFormData] = useState<ProformaData>(proformaExistente)

  const [vehiculosFiltrados, setVehiculosFiltrados] = useState(vehiculos)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null)

  // Estados para agregar items
  const [busquedaRepuesto, setBusquedaRepuesto] = useState("")
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState<any>(null)
  const [cantidad, setCantidad] = useState<number>(1)
  const [repuestosFiltrados, setRepuestosFiltrados] = useState<any[]>([])
  const [mostrarLista, setMostrarLista] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    // Cargar cliente seleccionado
    const cliente = clientes.find((c) => c.id.toString() === formData.clienteId)
    setClienteSeleccionado(cliente)

    // Filtrar vehículos por cliente
    if (formData.clienteId) {
      const clienteId = Number.parseInt(formData.clienteId)
      const filtrados = vehiculos.filter((v) => v.clienteId === clienteId)
      setVehiculosFiltrados(filtrados)

      // Cargar vehículo seleccionado
      const vehiculo = filtrados.find((v) => v.id.toString() === formData.vehiculoId)
      setVehiculoSeleccionado(vehiculo)
    }
  }, [formData.clienteId, formData.vehiculoId])

  // Calcular totales
  const subtotal = formData.items.reduce((sum, item) => sum + item.precioTotal, 0)
  const iva = subtotal * 0.12
  const total = subtotal + iva

  // Manejar cambio de cliente
  const handleClienteChange = (value: string) => {
    const cliente = clientes.find((c) => c.id.toString() === value)
    setClienteSeleccionado(cliente)
    setFormData((prev) => ({ ...prev, clienteId: value, vehiculoId: "" }))
    setVehiculoSeleccionado(null)

    // Filtrar vehículos por cliente
    const clienteId = Number.parseInt(value)
    const filtrados = vehiculos.filter((v) => v.clienteId === clienteId)
    setVehiculosFiltrados(filtrados)

    // Limpiar errores
    if (errors.clienteId) {
      setErrors((prev) => ({ ...prev, clienteId: "" }))
    }
  }

  // Manejar cambio de vehículo
  const handleVehiculoChange = (value: string) => {
    const vehiculo = vehiculosFiltrados.find((v) => v.id.toString() === value)
    setVehiculoSeleccionado(vehiculo)
    setFormData((prev) => ({ ...prev, vehiculoId: value }))

    // Limpiar errores
    if (errors.vehiculoId) {
      setErrors((prev) => ({ ...prev, vehiculoId: "" }))
    }
  }

  // Filtrar repuestos por búsqueda
  useEffect(() => {
    if (busquedaRepuesto.trim() === "") {
      setRepuestosFiltrados([])
      setMostrarLista(false)
    } else {
      const filtrados = repuestos.filter(
        (repuesto) =>
          repuesto.codigo.toLowerCase().includes(busquedaRepuesto.toLowerCase()) ||
          repuesto.descripcion.toLowerCase().includes(busquedaRepuesto.toLowerCase()) ||
          repuesto.categoria.toLowerCase().includes(busquedaRepuesto.toLowerCase()),
      )
      setRepuestosFiltrados(filtrados)
      setMostrarLista(true)
    }
  }, [busquedaRepuesto])

  // Seleccionar repuesto
  const seleccionarRepuesto = (repuesto: any) => {
    setRepuestoSeleccionado(repuesto)
    setBusquedaRepuesto(`${repuesto.codigo} - ${repuesto.descripcion}`)
    setMostrarLista(false)
  }

  // Limpiar selección de repuesto
  const limpiarSeleccion = () => {
    setRepuestoSeleccionado(null)
    setBusquedaRepuesto("")
    setCantidad(1)
    setMostrarLista(false)
  }

  // Agregar item a la proforma
  const agregarItem = () => {
    if (!repuestoSeleccionado || cantidad <= 0) {
      return
    }

    // Verificar stock disponible
    if (cantidad > repuestoSeleccionado.stock) {
      alert(`No hay suficiente stock. Stock disponible: ${repuestoSeleccionado.stock}`)
      return
    }

    // Verificar si el repuesto ya está en la lista
    const existeItem = formData.items.find((item) => item.repuestoId === repuestoSeleccionado.id)
    if (existeItem) {
      // Verificar que la nueva cantidad total no exceda el stock
      const nuevaCantidadTotal = existeItem.cantidad + cantidad
      if (nuevaCantidadTotal > repuestoSeleccionado.stock) {
        alert(
          `No hay suficiente stock. Ya tienes ${existeItem.cantidad} en la proforma. Stock disponible: ${repuestoSeleccionado.stock}`,
        )
        return
      }

      // Actualizar cantidad del item existente
      const itemsActualizados = formData.items.map((item) =>
        item.repuestoId === repuestoSeleccionado.id
          ? {
              ...item,
              cantidad: nuevaCantidadTotal,
              precioTotal: nuevaCantidadTotal * item.precioUnitario,
            }
          : item,
      )
      setFormData((prev) => ({ ...prev, items: itemsActualizados }))
    } else {
      // Agregar nuevo item
      const precioTotal = repuestoSeleccionado.precio * cantidad

      const nuevoItem: ProformaItem = {
        id: Date.now(),
        repuestoId: repuestoSeleccionado.id,
        codigo: repuestoSeleccionado.codigo,
        descripcion: repuestoSeleccionado.descripcion,
        cantidad,
        precioUnitario: repuestoSeleccionado.precio,
        precioTotal,
        stock: repuestoSeleccionado.stock,
        categoria: repuestoSeleccionado.categoria,
      }

      setFormData((prev) => ({ ...prev, items: [...prev.items, nuevoItem] }))
    }

    // Limpiar selección
    limpiarSeleccion()
  }

  // Eliminar item de la proforma
  const eliminarItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  // Actualizar cantidad de un item
  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(id)
      return
    }

    const item = formData.items.find((i) => i.id === id)
    if (item && nuevaCantidad > item.stock) {
      alert(`No hay suficiente stock. Stock disponible: ${item.stock}`)
      return
    }

    const itemsActualizados = formData.items.map((item) =>
      item.id === id
        ? {
            ...item,
            cantidad: nuevaCantidad,
            precioTotal: nuevaCantidad * item.precioUnitario,
          }
        : item,
    )
    setFormData((prev) => ({ ...prev, items: itemsActualizados }))
  }

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.numeroProforma.trim()) {
      nuevosErrores.numeroProforma = "El número de proforma es requerido"
    }
    if (!formData.clienteId) {
      nuevosErrores.clienteId = "Debe seleccionar un cliente"
    }
    if (!formData.vehiculoId) {
      nuevosErrores.vehiculoId = "Debe seleccionar un vehículo"
    }
    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida"
    }
    if (formData.items.length === 0) {
      nuevosErrores.items = "Debe agregar al menos un repuesto o servicio"
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Guardar cambios
  const guardarCambios = async () => {
    if (!validarFormulario()) {
      return
    }

    setLoading(true)
    try {
      // Simular guardado en base de datos
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aquí iría la lógica real para actualizar en la base de datos
      console.log("Datos actualizados de la proforma:", {
        ...formData,
        subtotal,
        iva,
        total,
        cliente: clienteSeleccionado,
        vehiculo: vehiculoSeleccionado,
      })

      // Redirigir a la vista de la proforma
      router.push(`/proformas/${params.id}`)
    } catch (error) {
      console.error("Error al actualizar la proforma:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Link href={`/proformas/${params.id}`} className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Edit className="h-8 w-8" />
            Editar Proforma {formData.numeroProforma}
          </h1>
          <p className="text-muted-foreground">Modificar los datos de la proforma existente</p>
        </div>
      </div>

      {/* Alertas de error */}
      {Object.keys(errors).length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Por favor, corrija los errores en el formulario antes de continuar.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Formulario principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información de la Proforma
              </CardTitle>
              <CardDescription>Datos básicos del documento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de Proforma *</Label>
                  <Input
                    id="numero"
                    value={formData.numeroProforma}
                    onChange={(e) => setFormData((prev) => ({ ...prev, numeroProforma: e.target.value }))}
                    className={errors.numeroProforma ? "border-red-500" : ""}
                  />
                  {errors.numeroProforma && <p className="text-sm text-red-500">{errors.numeroProforma}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fecha: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del cliente y vehículo */}
          <Card>
            <CardHeader>
              <CardTitle>Cliente y Vehículo</CardTitle>
              <CardDescription>Selecciona el cliente y el vehículo para la proforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select value={formData.clienteId} onValueChange={handleClienteChange}>
                    <SelectTrigger className={errors.clienteId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{cliente.nombre}</span>
                            <span className="text-sm text-muted-foreground">{cliente.ruc}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.clienteId && <p className="text-sm text-red-500">{errors.clienteId}</p>}

                  {/* Información del cliente seleccionado */}
                  {clienteSeleccionado && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      <p>
                        <strong>Dirección:</strong> {clienteSeleccionado.direccion}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {clienteSeleccionado.telefono}
                      </p>
                      <p>
                        <strong>Email:</strong> {clienteSeleccionado.email}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehiculo">Vehículo *</Label>
                  <Select
                    value={formData.vehiculoId}
                    onValueChange={handleVehiculoChange}
                    disabled={!formData.clienteId}
                  >
                    <SelectTrigger className={errors.vehiculoId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiculosFiltrados.map((vehiculo) => (
                        <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {vehiculo.marca} {vehiculo.modelo}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {vehiculo.placa} - {vehiculo.color} ({vehiculo.anio})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehiculoId && <p className="text-sm text-red-500">{errors.vehiculoId}</p>}

                  {/* Información del vehículo seleccionado */}
                  {vehiculoSeleccionado && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      <p>
                        <strong>Marca:</strong> {vehiculoSeleccionado.marca}
                      </p>
                      <p>
                        <strong>Modelo:</strong> {vehiculoSeleccionado.modelo}
                      </p>
                      <p>
                        <strong>Año:</strong> {vehiculoSeleccionado.anio}
                      </p>
                      <p>
                        <strong>Color:</strong> {vehiculoSeleccionado.color}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="km">Kilometraje</Label>
                  <Input
                    id="km"
                    placeholder="45,000"
                    value={formData.km}
                    onChange={(e) => setFormData((prev) => ({ ...prev, km: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del trabajo *</Label>
                  <Input
                    id="descripcion"
                    placeholder="Mantenimiento preventivo"
                    value={formData.descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                    className={errors.descripcion ? "border-red-500" : ""}
                  />
                  {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agregar repuestos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Agregar Repuestos y Servicios
              </CardTitle>
              <CardDescription>Busca y agrega repuestos o servicios a la proforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Buscador de repuestos */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-2 space-y-2 relative">
                    <Label htmlFor="busqueda">Buscar repuesto</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="busqueda"
                        placeholder="Buscar por código, descripción o categoría..."
                        value={busquedaRepuesto}
                        onChange={(e) => setBusquedaRepuesto(e.target.value)}
                        className="pl-8"
                      />
                      {repuestoSeleccionado && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-8 w-8"
                          onClick={limpiarSeleccion}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Lista de repuestos filtrados */}
                    {mostrarLista && repuestosFiltrados.length > 0 && (
                      <div className="absolute z-10 w-full max-h-60 overflow-y-auto border rounded-md bg-white shadow-lg">
                        {repuestosFiltrados.map((repuesto) => (
                          <div
                            key={repuesto.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => seleccionarRepuesto(repuesto)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{repuesto.codigo}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {repuesto.categoria}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{repuesto.descripcion}</p>
                              </div>
                              <div className="text-right ml-2">
                                <p className="font-medium text-sm">${repuesto.precio.toFixed(2)}</p>
                                <Badge
                                  variant={
                                    repuesto.stock > 10 ? "default" : repuesto.stock > 0 ? "secondary" : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  Stock: {repuesto.stock}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {mostrarLista && repuestosFiltrados.length === 0 && busquedaRepuesto.length > 0 && (
                      <div className="absolute z-10 w-full border rounded-md bg-white shadow-lg">
                        <div className="p-4 text-center text-gray-500">No se encontraron repuestos</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      max={repuestoSeleccionado?.stock || 999}
                      value={cantidad}
                      onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                      disabled={!repuestoSeleccionado}
                    />
                    {repuestoSeleccionado && cantidad > repuestoSeleccionado.stock && (
                      <p className="text-sm text-red-500">Cantidad excede el stock disponible</p>
                    )}
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={agregarItem}
                      disabled={!repuestoSeleccionado || cantidad <= 0 || cantidad > (repuestoSeleccionado?.stock || 0)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>

                {/* Información del repuesto seleccionado */}
                {repuestoSeleccionado && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{repuestoSeleccionado.codigo}</p>
                          <Badge variant="outline">{repuestoSeleccionado.categoria}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{repuestoSeleccionado.descripcion}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium">${repuestoSeleccionado.precio.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Stock: {repuestoSeleccionado.stock}</p>
                        <p className="text-sm font-medium text-blue-600">
                          Total: ${(repuestoSeleccionado.precio * cantidad).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Detalle de la Proforma ({formData.items.length} items)
              </CardTitle>
              <CardDescription>
                Items agregados a la proforma
                {errors.items && <span className="text-red-500 ml-2">{errors.items}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-right">P. Unitario</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No hay repuestos agregados a la proforma
                          <br />
                          <span className="text-sm">Usa el buscador de arriba para agregar repuestos</span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{item.descripcion}</p>
                                <Badge variant="outline" className="text-xs">
                                  {item.categoria}
                                </Badge>
                              </div>
                              {item.stock <= 5 && (
                                <Badge variant="destructive" className="text-xs mt-1">
                                  Stock bajo: {item.stock}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.cantidad}
                              onChange={(e) => actualizarCantidad(item.id, Number.parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-right">${item.precioUnitario.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">${item.precioTotal.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => eliminarItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Notas y avisos */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
              <CardDescription>Notas y avisos para el cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nota">Nota importante</Label>
                  <Textarea
                    id="nota"
                    placeholder="Información importante para el cliente"
                    rows={3}
                    value={formData.notaAviso}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notaAviso: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aviso">Términos y condiciones</Label>
                  <Textarea
                    id="aviso"
                    placeholder="Términos y condiciones de la proforma"
                    rows={3}
                    value={formData.aviso}
                    onChange={(e) => setFormData((prev) => ({ ...prev, aviso: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral - Resumen */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Totales de la proforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{formData.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unidades:</span>
                  <span>{formData.items.reduce((sum, item) => sum + item.cantidad, 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (12%):</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={guardarCambios} disabled={loading || formData.items.length === 0}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Link href={`/proformas/${params.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
