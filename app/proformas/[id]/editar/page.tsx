"use client"

import { useEffect, useState } from "react"
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
import { apiProformas, apiClientes, apiVehiculos, apiProformaItems, apiRepuestos } from "@/lib/api"

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
  const [formData, setFormData] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [repuestos, setRepuestos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id
        if (!id) {
          setError("ID de proforma no válido")
          setLoading(false)
          return
        }
        const proforma = await apiProformas.get(id)
        setFormData({
          numeroProforma: proforma.numeroProforma ?? proforma.numero ?? "",
          fecha: proforma.fecha ?? "",
          clienteId: proforma.clienteId?.toString() ?? proforma.cliente_id?.toString() ?? "",
          vehiculoId: proforma.vehiculoId?.toString() ?? proforma.vehiculo_id?.toString() ?? "",
          km: proforma.km ?? proforma.kilometraje ?? "",
          descripcion: proforma.descripcion ?? "",
          notaAviso: proforma.notaAviso ?? proforma.nota_aviso ?? "",
          aviso: proforma.aviso ?? "",
          items: [], // items se maneja por separado
        })
        setClientes(await apiClientes.list())
        setVehiculos(await apiVehiculos.list())
        setRepuestos(await apiRepuestos.list())
        // Cargar items y mapear campos del backend al frontend
        const itemsApi = await apiProformaItems.list(id)
        setItems(
          itemsApi.map((item: any) => ({
            id: item.id,
            repuestoId: item.repuesto_id,
            codigo: item.codigo,
            descripcion: item.descripcion,
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precio_unitario),
            precioTotal: Number(item.cantidad) * Number(item.precio_unitario),
            stock: item.stock ?? 0,
            categoria: item.categoria ?? "",
          }))
        )
      } catch (e: any) {
        setError("No se pudo cargar la proforma")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  // Estados del formulario - inicializar con datos existentes
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null)

  // Estados para agregar items
  const [busquedaRepuesto, setBusquedaRepuesto] = useState("")
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState<any>(null)
  const [cantidad, setCantidad] = useState<number>(1)
  const [repuestosFiltrados, setRepuestosFiltrados] = useState<any[]>([])
  const [mostrarLista, setMostrarLista] = useState(false)

  // Cargar datos iniciales y sincronizar vehículos al cambiar cliente
  useEffect(() => {
    // Cargar cliente seleccionado
    const cliente = clientes.find((c) => c.id.toString() === formData?.clienteId)
    setClienteSeleccionado(cliente)

    // Filtrar vehículos por cliente (ambos campos)
    if (formData?.clienteId) {
      const clienteId = Number(formData.clienteId)
      const filtrados = vehiculos.filter(
        (v) => v.clienteId?.toString() === clienteId.toString() || v.cliente_id?.toString() === clienteId.toString()
      )
      setVehiculosFiltrados(filtrados)

      // Buscar el vehículo seleccionado en toda la lista de vehículos
      const vehiculo = vehiculos.find(
        (v) => v.id?.toString() === formData.vehiculoId || v.vehiculoId?.toString() === formData.vehiculoId || v.vehiculo_id?.toString() === formData.vehiculoId
      )
      setVehiculoSeleccionado(vehiculo || null)
      // Si el vehículo no pertenece al nuevo cliente, límpialo
      if (
        vehiculo &&
        !(
          vehiculo.clienteId?.toString() === clienteId.toString() ||
          vehiculo.cliente_id?.toString() === clienteId.toString()
        )
      ) {
        setVehiculoSeleccionado(null)
        setFormData((prev: typeof formData) => ({ ...prev, vehiculoId: "" }))
      }
    } else {
      setVehiculosFiltrados([])
      setVehiculoSeleccionado(null)
      setFormData((prev: typeof formData) => ({ ...prev, vehiculoId: "" }))
    }
  }, [formData?.clienteId, formData?.vehiculoId, clientes, vehiculos])

  // Calcular totales y unidades a partir de items
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + Number(item.precioUnitario ?? item.precio_unitario ?? 0) * Number(item.cantidad ?? 0),
    0,
  )
  const iva = subtotal * 0.12
  const total = subtotal + iva
  const unidades = items.reduce((sum: number, item: any) => sum + Number(item.cantidad ?? 0), 0)

  // Manejar cambio de cliente
  const handleClienteChange = (value: string) => {
    const cliente = clientes.find((c) => c.id.toString() === value)
    setClienteSeleccionado(cliente)
    setFormData((prev: typeof formData) => ({ ...prev, clienteId: value, vehiculoId: "" }))
    setVehiculoSeleccionado(null)
    // Filtrar vehículos por cliente
    const clienteId = Number.parseInt(value)
    const filtrados = vehiculos.filter((v) => v.clienteId === clienteId || v.cliente_id === clienteId)
    setVehiculosFiltrados(filtrados)
  }

  // Manejar cambio de vehículo
  const handleVehiculoChange = (value: string) => {
    // Buscar en ambos posibles campos de id
    const vehiculo = vehiculosFiltrados.find((v) => v.id?.toString() === value || v.vehiculoId?.toString() === value || v.vehiculo_id?.toString() === value)
    setVehiculoSeleccionado(vehiculo)
    setFormData((prev: typeof formData) => ({ ...prev, vehiculoId: value }))
  }

  // Filtrar repuestos por búsqueda
  useEffect(() => {
    if (busquedaRepuesto.trim() === "") {
      setRepuestosFiltrados([])
      setMostrarLista(false)
    } else {
      const filtrados = repuestos.filter(
        (repuesto) =>
          (repuesto.codigo || "").toLowerCase().includes(busquedaRepuesto.toLowerCase()) ||
          (repuesto.descripcion || "").toLowerCase().includes(busquedaRepuesto.toLowerCase()) ||
          (repuesto.categoria || "").toLowerCase().includes(busquedaRepuesto.toLowerCase()),
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
    const existeItem = items.find((item) => item.repuestoId === repuestoSeleccionado.id)
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
      const itemsActualizados = items.map((item) =>
        item.repuestoId === repuestoSeleccionado.id
          ? {
              ...item,
              cantidad: nuevaCantidadTotal,
              precioTotal: nuevaCantidadTotal * item.precioUnitario,
            }
          : item,
      )
      setItems(itemsActualizados)
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

      setItems((prev) => [...prev, nuevoItem])
    }

    // Limpiar selección
    limpiarSeleccion()
  }

  // Eliminar item de la proforma
  const eliminarItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Actualizar cantidad de un item
  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(id)
      return
    }

    const item = items.find((i) => i.id === id)
    if (item && nuevaCantidad > item.stock) {
      alert(`No hay suficiente stock. Stock disponible: ${item.stock}`)
      return
    }

    const itemsActualizados = items.map((item) =>
      item.id === id
        ? {
            ...item,
            cantidad: nuevaCantidad,
            precioTotal: nuevaCantidad * item.precioUnitario,
          }
        : item,
    )
    setItems(itemsActualizados)
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
    if (items.length === 0) {
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
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      // 1. Actualizar datos principales de la proforma
      await apiProformas.update(id, {
        numero: formData.numeroProforma,
        fecha: formData.fecha,
        cliente_id: formData.clienteId,
        vehiculo_id: formData.vehiculoId,
        kilometraje: formData.km,
        descripcion: formData.descripcion,
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        total: total.toFixed(2),
        nota_aviso: formData.notaAviso,
        aviso: formData.aviso,
      })
      // 2. Eliminar todos los items existentes y crear los nuevos
      const itemsExistentes = await apiProformaItems.list(id)
      // Eliminar todos los items existentes de forma secuencial
      for (const item of itemsExistentes) {
        await apiProformaItems.delete(item.id)
      }
      // Crear los nuevos items de forma secuencial
      for (const item of items.filter((item: any) => item.repuestoId)) {
        await apiProformaItems.create({
          proforma_id: id,
          repuesto_id: item.repuestoId,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          codigo: item.codigo,
          descripcion: item.descripcion,
        })
      }
      // Redirigir a la vista de la proforma
      router.push(`/proformas/${id}`)
    } catch (error) {
      console.error("Error al actualizar la proforma:", error)
      setError("No se pudo guardar la proforma. Intente nuevamente.")
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
            Editar Proforma {formData?.numeroProforma}
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
                    value={formData?.numeroProforma ?? ""}
                    readOnly
                    className={errors.numeroProforma ? "border-red-500" : "bg-gray-100 cursor-not-allowed"}
                  />
                  {errors.numeroProforma && <p className="text-sm text-red-500">{errors.numeroProforma}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData?.fecha ?? ""}
                    onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, fecha: e.target.value }))}
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
                  <Select value={formData?.clienteId} onValueChange={handleClienteChange}>
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
                    value={formData?.vehiculoId}
                    onValueChange={handleVehiculoChange}
                    disabled={!formData?.clienteId}
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
                    value={formData?.km ?? ""}
                    onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, km: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del trabajo *</Label>
                  <Input
                    id="descripcion"
                    placeholder="Mantenimiento preventivo"
                    value={formData?.descripcion ?? ""}
                    onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, descripcion: e.target.value }))}
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
                                <p className="font-medium text-sm">${Number(repuesto.precio).toFixed(2)}</p>
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
                        <p className="font-medium">${Number(repuestoSeleccionado.precio).toFixed(2)}</p>
                        <p className="text-sm font-medium text-blue-600">
                          Total: ${(Number(repuestoSeleccionado.precio) * cantidad).toFixed(2)}
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
                Detalle de la Proforma ({items.length} items)
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
                      <TableHead className="text-center">N°</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-right">P. Unitario</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No hay items registrados en esta proforma
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item: any, index: number) => {
                        const repuesto = repuestos.find((r) => r.id === (item.repuestoId ?? item.repuesto_id))
                        return (
                          <TableRow key={index}>
                            <TableCell className="text-center font-mono text-xs">{index + 1}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {repuesto?.codigo || item.codigo || item.repuestoId || item.repuesto_id}
                            </TableCell>
                            <TableCell>{repuesto?.descripcion || item.descripcion || "-"}</TableCell>
                            <TableCell className="text-right">{item.cantidad}</TableCell>
                            <TableCell className="text-right">
                              ${Number(item.precioUnitario ?? item.precio_unitario ?? 0).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${Number((item.cantidad ?? 0) * (item.precioUnitario ?? item.precio_unitario ?? 0)).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => eliminarItem(item.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
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
                    value={formData?.notaAviso}
                    onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, notaAviso: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aviso">Términos y condiciones</Label>
                  <Textarea
                    id="aviso"
                    placeholder="Términos y condiciones de la proforma"
                    rows={3}
                    value={formData?.aviso}
                    onChange={(e) => setFormData((prev: typeof formData) => ({ ...prev, aviso: e.target.value }))}
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
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unidades:</span>
                  <span>{unidades}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Descuento:</span>
                  <span>- ${Number(formData?.descuento || 0).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (12%):</span>
                  <span>${Number(iva).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${Number(total).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={guardarCambios} disabled={loading || items.length === 0}>
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
