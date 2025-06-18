"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Save, Trash2, Search, X, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiProformas, apiProformaItems, apiClientes, apiVehiculos, apiRepuestos } from "@/lib/api"

interface Cliente {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
}
interface Vehiculo {
  id: number;
  cliente_id: number;
  marca: string;
  modelo: string;
  anio: string;
  placa: string;
  color: string;
}
interface Repuesto {
  id: number;
  codigo: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
}
interface ItemProforma {
  id: number;
  repuestoId: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  stockDisponible: number;
}

export default function NuevaProformaPage() {
  const router = useRouter()

  // Estados básicos
  const [numeroProforma, setNumeroProforma] = useState("PRO-2024-001")
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [clienteId, setClienteId] = useState("")
  const [vehiculoId, setVehiculoId] = useState("")
  const [km, setKm] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [items, setItems] = useState<ItemProforma[]>([])
  const [notaAviso, setNotaAviso] = useState("Esta proforma tiene validez de 15 días.")
  const [aviso, setAviso] = useState("Los precios incluyen IVA. Garantía de 30 días en repuestos.")

  // Estados para búsqueda
  const [busquedaRepuesto, setBusquedaRepuesto] = useState("")
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState<Repuesto | null>(null)
  const [cantidad, setCantidad] = useState(1)
  const [mostrarLista, setMostrarLista] = useState(false)

  // Estados derivados
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null)
  const [repuestosFiltrados, setRepuestosFiltrados] = useState<Repuesto[]>([])

  // Estados UI
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mensaje, setMensaje] = useState("")

  // Cargar clientes, vehículos y repuestos reales
  useEffect(() => {
    const fetchData = async () => {
      const clientes = await apiClientes.list()
      setClientes(clientes)
      const vehiculos = await apiVehiculos.list()
      setVehiculos(vehiculos)
      const repuestos = await apiRepuestos.list()
      setRepuestos(repuestos)
    }
    fetchData()
  }, [])

  // Filtrar repuestos
  useEffect(() => {
    if (busquedaRepuesto.trim() === "") {
      setRepuestosFiltrados([])
      setMostrarLista(false)
    } else {
      const filtrados = repuestos.filter(
        (r) =>
          r.codigo.toLowerCase().includes(busquedaRepuesto.toLowerCase()) ||
          r.descripcion.toLowerCase().includes(busquedaRepuesto.toLowerCase()),
      )
      setRepuestosFiltrados(filtrados)
      setMostrarLista(true)
    }
  }, [busquedaRepuesto, repuestos])

  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
  const iva = subtotal * 0.12
  const total = subtotal + iva

  // Manejar cambio de cliente
  const handleClienteChange = (value: string) => {
    setClienteId(value)
    setVehiculoId("")
    setVehiculoSeleccionado(null)
    const cliente = clientes.find((c) => c.id.toString() === value) || null
    setClienteSeleccionado(cliente)
    // Filtrar usando cliente_id (dato real)
    const vehiculosCliente = vehiculos.filter((v) => v.cliente_id?.toString() === value)
    setVehiculosFiltrados(vehiculosCliente)
  }

  const handleVehiculoChange = (value: string) => {
    setVehiculoId(value)
    const vehiculo = vehiculosFiltrados.find((v) => v.id.toString() === value) || null
    setVehiculoSeleccionado(vehiculo)
  }

  const seleccionarRepuesto = (repuesto: Repuesto) => {
    setRepuestoSeleccionado(repuesto)
    setBusquedaRepuesto(`${repuesto.codigo} - ${repuesto.descripcion}`)
    setMostrarLista(false)
    setCantidad(1)
  }

  const limpiarSeleccion = () => {
    setRepuestoSeleccionado(null)
    setBusquedaRepuesto("")
    setCantidad(1)
    setMostrarLista(false)
  }

  const agregarItem = () => {
    if (!repuestoSeleccionado) {
      setMensaje("❌ Selecciona un repuesto")
      return
    }
    if (cantidad <= 0) {
      setMensaje("❌ La cantidad debe ser mayor a 0")
      return
    }
    if (cantidad > repuestoSeleccionado.stock) {
      setMensaje(`❌ Stock insuficiente. Disponible: ${repuestoSeleccionado.stock}`)
      return
    }
    const itemExistente = items.find((item) => item.repuestoId === repuestoSeleccionado.id)
    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad
      if (nuevaCantidad > repuestoSeleccionado.stock) {
        setMensaje(`❌ Stock insuficiente. Ya tienes ${itemExistente.cantidad}`)
        return
      }
      setItems(
        items.map((item) =>
          item.repuestoId === repuestoSeleccionado.id ? { ...item, cantidad: nuevaCantidad } : item,
        ),
      )
    } else {
      const nuevoItem: ItemProforma = {
        id: Date.now(),
        repuestoId: repuestoSeleccionado.id,
        codigo: repuestoSeleccionado.codigo,
        descripcion: repuestoSeleccionado.descripcion,
        cantidad: cantidad,
        precio: repuestoSeleccionado.precio,
        categoria: repuestoSeleccionado.categoria,
        stockDisponible: repuestoSeleccionado.stock,
      }
      setItems([...items, nuevoItem])
    }
    limpiarSeleccion()
    setMensaje(`✅ ${repuestoSeleccionado.descripcion} agregado`)
    setTimeout(() => setMensaje(""), 3000)
  }

  const eliminarItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId))
    setMensaje("✅ Item eliminado")
    setTimeout(() => setMensaje(""), 2000)
  }

  const actualizarCantidad = (itemId: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarItem(itemId)
      return
    }
    const item = items.find((i) => i.id === itemId)
    if (item && nuevaCantidad > item.stockDisponible) {
      setMensaje(`❌ Stock insuficiente. Máximo: ${item.stockDisponible}`)
      return
    }
    setItems(items.map((item) => (item.id === itemId ? { ...item, cantidad: nuevaCantidad } : item)))
  }

  // Validar formulario
  const validarFormulario = () => {
    const errores = {}

    if (!numeroProforma.trim()) errores.numeroProforma = "Requerido"
    if (!clienteId) errores.clienteId = "Requerido"
    if (!vehiculoId) errores.vehiculoId = "Requerido"
    if (!descripcion.trim()) errores.descripcion = "Requerido"
    if (items.length === 0) errores.items = "Agrega al menos un item"

    setErrors(errores)
    return Object.keys(errores).length === 0
  }

  // Guardar proforma
  const guardarProforma = async () => {
    if (!validarFormulario()) {
      setMensaje("❌ Completa todos los campos requeridos")
      return
    }
    setLoading(true)
    try {
      // Guardar proforma principal
      const proformaData = {
        numero: numeroProforma,
        fecha,
        cliente_id: Number(clienteId),
        vehiculo_id: Number(vehiculoId),
        entidad_id: 1, // siempre enviar 1 (entidad principal)
        descripcion,
        subtotal: Number(subtotal),
        iva: Number(iva),
        total: Number(total),
        nota_aviso: notaAviso,
        aviso,
        kilometraje: km ? km : null,
        estado: "pendiente", // forzar siempre 'pendiente' al crear
        fecha_vencimiento: fecha,
        usuario_creacion: "sistema"
      }
      const res = await apiProformas.create(proformaData)
      // Guardar items
      for (const item of items) {
        await apiProformaItems.create({
          proforma_id: res.id,
          repuesto_id: item.repuestoId,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        })
      }
      setMensaje(`✅ Proforma ${numeroProforma} guardada exitosamente!`)
      setTimeout(() => {
        router.push("/proformas")
      }, 2000)
    } catch (error) {
      setMensaje("❌ Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/proformas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nueva Proforma</h1>
          <p className="text-muted-foreground">Crear nueva proforma funcional</p>
        </div>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <Alert
          className={`mb-4 ${mensaje.includes("✅") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{mensaje}</AlertDescription>
        </Alert>
      )}

      {/* Errores */}
      {Object.keys(errors).length > 0 && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Completa todos los campos requeridos</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Formulario */}
        <div className="lg:col-span-3 space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Número de Proforma *</Label>
                  <Input
                    value={numeroProforma}
                    onChange={(e) => setNumeroProforma(e.target.value)}
                    className={errors.numeroProforma ? "border-red-500" : ""}
                  />
                  {errors.numeroProforma && <p className="text-sm text-red-500">{errors.numeroProforma}</p>}
                </div>
                <div>
                  <Label>Fecha</Label>
                  <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cliente y Vehículo */}
          <Card>
            <CardHeader>
              <CardTitle>Cliente y Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Cliente *</Label>
                  <Select value={clienteId} onValueChange={handleClienteChange}>
                    <SelectTrigger className={errors.clienteId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.clienteId && <p className="text-sm text-red-500">{errors.clienteId}</p>}

                  {clienteSeleccionado && (
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                      <p>
                        <strong>RUC:</strong> {clienteSeleccionado.ruc}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {clienteSeleccionado.telefono}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Vehículo *</Label>
                  <Select value={vehiculoId} onValueChange={handleVehiculoChange} disabled={!clienteId}>
                    <SelectTrigger className={errors.vehiculoId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiculosFiltrados.map((vehiculo) => (
                        <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                          {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehiculoId && <p className="text-sm text-red-500">{errors.vehiculoId}</p>}

                  {vehiculoSeleccionado && (
                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
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
                <div>
                  <Label>Kilometraje</Label>
                  <Input placeholder="45,000" value={km} onChange={(e) => setKm(e.target.value)} />
                </div>
                <div>
                  <Label>Descripción del trabajo *</Label>
                  <Input
                    placeholder="Mantenimiento preventivo"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className={errors.descripcion ? "border-red-500" : ""}
                  />
                  {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agregar Repuestos */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Repuestos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2 relative">
                  <Label>Buscar repuesto</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por código o descripción..."
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

                  {/* Lista de repuestos */}
                  {mostrarLista && repuestosFiltrados.length > 0 && (
                    <div className="absolute z-50 w-full max-h-60 overflow-y-auto border rounded-md bg-white shadow-lg mt-1">
                      {repuestosFiltrados.map((repuesto) => (
                        <div
                          key={repuesto.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => seleccionarRepuesto(repuesto)}
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium text-sm">{repuesto.codigo}</p>
                              <p className="text-sm text-gray-600">{repuesto.descripcion}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {repuesto.categoria}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${Number(repuesto.precio).toFixed(2)}</p>
                              <p className="text-sm text-gray-600">Stock: {repuesto.stock}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {mostrarLista && repuestosFiltrados.length === 0 && busquedaRepuesto.length > 0 && (
                    <div className="absolute z-50 w-full border rounded-md bg-white shadow-lg mt-1 p-4 text-center text-gray-500">
                      No se encontraron repuestos
                    </div>
                  )}
                </div>

                <div>
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                    disabled={!repuestoSeleccionado}
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={agregarItem} disabled={!repuestoSeleccionado || cantidad <= 0} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Repuesto seleccionado */}
              {repuestoSeleccionado && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{repuestoSeleccionado.codigo}</p>
                      <p className="text-sm text-gray-600">{repuestoSeleccionado.descripcion}</p>
                      <Badge variant="outline" className="mt-1">
                        {repuestoSeleccionado.categoria}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number(repuestoSeleccionado.precio).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Stock: {repuestoSeleccionado.stock}</p>
                      <p className="text-sm font-medium text-blue-600">
                        Total: ${(Number(repuestoSeleccionado.precio) * cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items de la Proforma ({items.length})</CardTitle>
              {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No hay items agregados
                          <br />
                          <span className="text-sm">Busca y agrega repuestos usando el formulario de arriba</span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono">{item.codigo}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.descripcion}</p>
                              <Badge variant="outline" className="text-xs">
                                {item.categoria}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="1"
                              value={item.cantidad}
                              onChange={(e) => actualizarCantidad(item.id, Number.parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-right">${Number(item.precio).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.cantidad * Number(item.precio)).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => eliminarItem(item.id)}
                              className="text-red-500 hover:text-red-700"
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

          {/* Notas */}
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Nota importante</Label>
                  <Textarea rows={3} value={notaAviso} onChange={(e) => setNotaAviso(e.target.value)} />
                </div>
                <div>
                  <Label>Términos y condiciones</Label>
                  <Textarea rows={3} value={aviso} onChange={(e) => setAviso(e.target.value)} />
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unidades:</span>
                  <span>{items.reduce((sum, item) => sum + item.cantidad, 0)}</span>
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
              <Button className="w-full" onClick={guardarProforma} disabled={loading || items.length === 0}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Proforma
                  </>
                )}
              </Button>
              <Link href="/proformas" className="w-full">
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
