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

  // Estados para modal de nuevo cliente/vehículo
  const [showNuevoClienteModal, setShowNuevoClienteModal] = useState(false)
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', ruc: '', direccion: '', telefono: '', email: '' })
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ marca: '', modelo: '', anio: '', placa: '', color: '' })
  const [loadingNuevoCliente, setLoadingNuevoCliente] = useState(false)
  const [errorNuevoCliente, setErrorNuevoCliente] = useState("")

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
                  <div className="flex gap-2 items-center">
                    <Select value={formData?.clienteId} onValueChange={handleClienteChange}>
                      <SelectTrigger className={errors.clienteId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            <span className="font-medium">{cliente.nombre}</span>
                            <span className="text-sm text-muted-foreground">{cliente.ruc}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowNuevoClienteModal(true)}>
                      + Nuevo
                    </Button>
                  </div>
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



          {/* Edición directa de items en la tabla */}
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
                      <TableHead className="text-center border-r border-gray-300">N°</TableHead>
                      <TableHead className="border-r border-gray-300">Código</TableHead>
                      <TableHead className="border-r border-gray-300 min-w-[220px] w-[220px]">Descripción</TableHead>
                      <TableHead className="text-center border-r border-gray-300">Cantidad</TableHead>
                      <TableHead className="text-right border-r border-gray-300">P. Unitario</TableHead>
                      <TableHead className="text-right border-r border-gray-300">Total</TableHead>
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
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="text-center font-mono text-xs border-r border-gray-300">{index + 1}</TableCell>
                            <TableCell className="font-mono border-r border-gray-300">
                              <Input
                                value={item.codigo}
                                onChange={e => {
                                  const nuevoCodigo = e.target.value;
                                  const rep = repuestos.find(r => r.codigo.toLowerCase() === nuevoCodigo.trim().toLowerCase());
                                  if (rep) {
                                    setItems(prev => prev.map(i => i.id === item.id ? {
                                      ...i,
                                      codigo: rep.codigo,
                                      descripcion: rep.descripcion,
                                      precioUnitario: rep.precio,
                                      categoria: rep.categoria,
                                      repuestoId: rep.id,
                                      stock: rep.stock,
                                    } : i));
                                  } else {
                                    setItems(prev => prev.map(i => i.id === item.id ? {
                                      ...i,
                                      codigo: nuevoCodigo,
                                      repuestoId: null,
                                      categoria: 'Manual',
                                      stock: 0,
                                    } : i));
                                  }
                                }}
                                className="w-full h-10 font-mono font-light px-0 py-0 border-none bg-transparent focus:outline-none focus:bg-blue-50 focus:shadow-none text-left"
                                style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none', padding: 0, margin: 0, height: '40px', minHeight: '40px', fontSize: '14px', lineHeight: '1.2' }}
                              />
                            </TableCell>
                            <TableCell className="border-r border-gray-300 min-w-[220px] w-[220px]">
                              <Input
                                value={item.descripcion}
                                onChange={e => {
                                  const nuevaDescripcion = e.target.value;
                                  setItems(prev => prev.map(i => i.id === item.id ? { ...i, descripcion: nuevaDescripcion } : i));
                                }}
                                className="w-full h-10 font-light px-0 py-0 border-none bg-transparent focus:outline-none focus:bg-blue-50 focus:shadow-none text-left"
                                style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none', padding: 0, margin: 0, height: '40px', minHeight: '40px', fontSize: '14px', lineHeight: '1.2' }}
                              />
                            </TableCell>
                            <TableCell className="text-center border-r border-gray-300">
                              <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="1"
                                value={item.cantidad}
                                onChange={e => {
                                  const val = e.target.value.replace(/[^0-9]/g, "");
                                  const nuevaCantidad = val === "" ? 0 : Number.parseInt(val);
                                  setItems(prev => prev.map(i => i.id === item.id ? { ...i, cantidad: nuevaCantidad } : i));
                                }}
                                className="w-full h-10 text-center px-0 py-0 border-none bg-transparent focus:outline-none focus:bg-blue-50 focus:shadow-none hide-number-spin"
                                style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none', padding: 0, margin: 0, height: '40px', minHeight: '40px', fontSize: '14px', lineHeight: '1.2' }}
                              />
                            </TableCell>
                            <TableCell className="text-right border-r border-gray-300">
                              <Input
                                type="text"
                                value={item.precioUnitario}
                                onChange={e => {
                                  const nuevoPrecio = Number.parseFloat(e.target.value) || 0;
                                  setItems(prev => prev.map(i => i.id === item.id ? { ...i, precioUnitario: nuevoPrecio } : i));
                                }}
                                className="w-full h-10 text-right font-mono font-light px-0 py-0 border-none bg-transparent focus:outline-none focus:bg-blue-50 focus:shadow-none"
                                style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none', padding: 0, margin: 0, height: '40px', minHeight: '40px', fontSize: '14px', lineHeight: '1.2' }}
                              />
                            </TableCell>
                            <TableCell className="text-right border-r border-gray-300">${(item.cantidad * item.precioUnitario).toFixed(2)}</TableCell>
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
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setItems(prev => ([
                      ...prev,
                      {
                        id: Date.now(),
                        repuestoId: null,
                        codigo: '',
                        descripcion: '',
                        cantidad: 1,
                        precioUnitario: 0,
                        categoria: 'Manual',
                        stock: 0,
                      }
                    ]));
                  }}
                  title="Agregar fila"
                >
                  <Plus className="h-4 w-4" /> Agregar fila
                </Button>
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

      {/* MODAL NUEVO CLIENTE Y VEHICULO */}
      {showNuevoClienteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowNuevoClienteModal(false)}>
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold mb-2">Nuevo Cliente y Vehículo</h2>
            {errorNuevoCliente && errorNuevoCliente.startsWith('<') ? (
              <div className="mb-2 p-2 border border-red-300 bg-red-50 rounded text-xs overflow-auto" dangerouslySetInnerHTML={{ __html: errorNuevoCliente }} />
            ) : errorNuevoCliente && (
              <p className="text-sm text-red-500 mb-2">{errorNuevoCliente}</p>
            )}
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div>
                <Label>Nombre *</Label>
                <Input value={nuevoCliente.nombre} onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} />
              </div>
              <div>
                <Label>RUC *</Label>
                <Input value={nuevoCliente.ruc} onChange={e => setNuevoCliente({ ...nuevoCliente, ruc: e.target.value })} />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input value={nuevoCliente.direccion} onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={nuevoCliente.telefono} onChange={e => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={nuevoCliente.email} onChange={e => setNuevoCliente({ ...nuevoCliente, email: e.target.value })} />
              </div>
            </div>
            <h3 className="font-semibold mb-2 mt-2">Vehículo</h3>
            <div className="grid gap-4 md:grid-cols-2 mb-4">
              <div>
                <Label>Marca *</Label>
                <Input value={nuevoVehiculo.marca} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })} />
              </div>
              <div>
                <Label>Modelo *</Label>
                <Input value={nuevoVehiculo.modelo} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })} />
              </div>
              <div>
                <Label>Año *</Label>
                <Input value={nuevoVehiculo.anio} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, anio: e.target.value })} />
              </div>
              <div>
                <Label>Placa *</Label>
                <Input value={nuevoVehiculo.placa} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, placa: e.target.value })} />
              </div>
              <div>
                <Label>Color</Label>
                <Input value={nuevoVehiculo.color} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, color: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNuevoClienteModal(false)}>Cancelar</Button>
              <Button onClick={async () => {
                setLoadingNuevoCliente(true);
                setErrorNuevoCliente("");
                // Validación simple
                if (!nuevoCliente.nombre.trim() || !nuevoCliente.ruc.trim() || !nuevoVehiculo.marca.trim() || !nuevoVehiculo.modelo.trim() || !nuevoVehiculo.anio.trim() || !nuevoVehiculo.placa.trim()) {
                  setErrorNuevoCliente("Completa todos los campos obligatorios");
                  setLoadingNuevoCliente(false);
                  return;
                }
                try {
                  // Crear cliente
                  const clienteCreado = await apiClientes.create(nuevoCliente);
                  if (!clienteCreado || !clienteCreado.id) throw new Error("No se pudo crear el cliente");
                  // Crear vehículo
                  const vehiculoCreado = await apiVehiculos.create({ ...nuevoVehiculo, cliente_id: clienteCreado.id });
                  if (!vehiculoCreado || !vehiculoCreado.id) throw new Error("No se pudo crear el vehículo");
                  // Recargar listas completas desde la API para asegurar datos correctos
                  const clientesActualizados = await apiClientes.list();
                  const vehiculosActualizados = await apiVehiculos.list();
                  // Actualizar clientes state
                  const finalClientes = [...clientesActualizados, clienteCreado]
                    .filter((c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx)
                    .filter((c) => c.nombre && c.ruc);
                  setClientes(finalClientes);
                  // Update vehicles state
                  const finalVehiculos = [...vehiculosActualizados, vehiculoCreado]
                    .filter((v, idx, arr) => arr.findIndex(x => x.id === v.id) === idx);
                  setVehiculos(finalVehiculos);
                  // --- INICIO: Actualizaciones cruciales e inmediatas de estado para mostrar los datos ---
                  // Seleccionar el cliente y vehículo recién creados
                  setFormData((prev: typeof formData) => ({
                    ...prev,
                    clienteId: clienteCreado.id.toString(),
                    vehiculoId: vehiculoCreado.id.toString(),
                  }));
                  setClienteSeleccionado(clienteCreado);
                  // Filtrar vehículos del cliente y asegurar solo uno por id
                  const vehiculosForNewClient = finalVehiculos
                    .filter((v) => v.cliente_id === clienteCreado.id)
                    .filter((v) => v.marca && v.modelo && v.placa);
                  setVehiculosFiltrados(vehiculosForNewClient);
                  setVehiculoSeleccionado(vehiculoCreado);
                  // --- FIN: Actualizaciones cruciales ---
                  // Cerrar modal y limpiar
                  setShowNuevoClienteModal(false);
                  setNuevoCliente({ nombre: '', ruc: '', direccion: '', telefono: '', email: '' });
                  setNuevoVehiculo({ marca: '', modelo: '', anio: '', placa: '', color: '' });
                } catch (err: any) {
                  setErrorNuevoCliente(err?.message || (typeof err === "string" ? err : "Error al crear cliente o vehículo"));
                } finally {
                  setLoadingNuevoCliente(false);
                }
              }}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
