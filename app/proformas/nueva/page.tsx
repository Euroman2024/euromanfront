"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // <--- CORREGIDO AQUÍ
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
  repuestoId: number | null;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  stockDisponible: number;
}

export default function NuevaProformaPage() {
  // Ref para el input activo y estado para la posición del dropdown
  const inputCodigoRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  // Estado para el índice del input activo y su valor
  const [codigoActivoIdx, setCodigoActivoIdx] = useState<number | null>(null);
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showManualTab, setShowManualTab] = useState(false);
  // Estados principales
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [km, setKm] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [items, setItems] = useState<ItemProforma[]>([]);
  const [notaAviso, setNotaAviso] = useState("Esta proforma tiene validez de 15 días.");
  const [aviso, setAviso] = useState("Los precios incluyen IVA. Garantía de 30 días en repuestos.");
  const router = useRouter()

  // Estados básicos
  const [numeroProforma, setNumeroProforma] = useState("")
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])

  // Asignar número automáticamente
  useEffect(() => {
    const asignarNumero = async () => {
      const proformas = await apiProformas.list();
      let maxNum = 0;
      proformas.forEach((p: any) => {
        const match = p.numero && p.numero.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      const nextNum = (maxNum + 1).toString().padStart(3, "0");
      const year = new Date().getFullYear();
      setNumeroProforma(`PRO-${year}-${nextNum}`);
    };
    asignarNumero();
  }, []);

  // Estados derivados (definidos aquí para asegurar que siempre existan)
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<Vehiculo[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);

  // Sincronizar clienteSeleccionado y vehiculosFiltrados cuando clientes o clienteId cambian
  useEffect(() => {
    const cliente = clientes.find((c) => c.id.toString() === clienteId) || null;
    setClienteSeleccionado(cliente);

    const vehiculosCliente = vehiculos.filter((v) => v.cliente_id?.toString() === clienteId);
    setVehiculosFiltrados(vehiculosCliente);

    // Asegurarse de que el vehículo seleccionado siga siendo válido para el nuevo cliente
    // Opcionalmente, si hay un solo vehículo para el nuevo cliente, seleccionarlo automáticamente
    if (vehiculoId && !vehiculosCliente.some(v => v.id.toString() === vehiculoId)) {
      setVehiculoId("");
      setVehiculoSeleccionado(null);
    } else if (vehiculoId) { // Si ya hay un vehiculoId, asegúrate de que el objeto esté bien seteado
      setVehiculoSeleccionado(vehiculosCliente.find(v => v.id.toString() === vehiculoId) || null);
    } else if (vehiculosCliente.length === 1) { // Si solo hay un vehículo para el cliente, seleccionarlo
        setVehiculoId(vehiculosCliente[0].id.toString());
        setVehiculoSeleccionado(vehiculosCliente[0]);
    } else { // Si no hay vehiculoId y múltiples vehiculos, deseleccionar
        setVehiculoSeleccionado(null);
    }
  }, [clienteId, clientes, vehiculos]);

  // Sincronizar vehiculoSeleccionado cuando vehiculoId cambia (y vehiculosFiltrados ya se ha actualizado)
  // Este useEffect es menos propenso a errores ahora porque vehiculosFiltrados ya es manejado
  // en el useEffect anterior cuando clienteId cambia.
  useEffect(() => {
    // Solo busca si vehiculosFiltrados tiene elementos y vehiculoId está seteado
    if (vehiculoId && vehiculosFiltrados.length > 0) {
        const vehiculo = vehiculosFiltrados.find((v) => v.id.toString() === vehiculoId) || null;
        setVehiculoSeleccionado(vehiculo);
    } else if (!vehiculoId) { // Si vehiculoId se vacía, asegurar que vehiculoSeleccionado sea null
        setVehiculoSeleccionado(null);
    }
  }, [vehiculoId, vehiculosFiltrados]); // Depende de vehiculosFiltrados para asegurar orden


  // Estados para búsqueda
  const [busquedaRepuesto, setBusquedaRepuesto] = useState("")
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState<Repuesto | null>(null)
  const [cantidad, setCantidad] = useState(1)
  // Estados exclusivos para item manual
  const [codigoManual, setCodigoManual] = useState("");
  const [precioManual, setPrecioManual] = useState(0)
  const [descripcionManual, setDescripcionManual] = useState("")
  const [cantidadManual, setCantidadManual] = useState(1);
  const [mostrarLista, setMostrarLista] = useState(false)

  const [repuestosFiltrados, setRepuestosFiltrados] = useState<Repuesto[]>([])

  // Estados para modal de nuevo cliente/vehículo
  const [showNuevoClienteModal, setShowNuevoClienteModal] = useState(false)
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', ruc: '', direccion: '', telefono: '', email: '' })
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ marca: '', modelo: '', anio: '', placa: '', color: '' })
  const [loadingNuevoCliente, setLoadingNuevoCliente] = useState(false)
  const [errorNuevoCliente, setErrorNuevoCliente] = useState('')

  // Estados UI
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mensaje, setMensaje] = useState("")

  // Cargar clientes, vehículos y repuestos reales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientes = await apiClientes.list();
        setClientes(clientes);
        const vehiculos = await apiVehiculos.list();
        setVehiculos(vehiculos);
        let repuestos = [];
        try {
          const res = await apiRepuestos.list();
          repuestos = Array.isArray(res) ? res : [];
        } catch (error) {
          setMensaje('❌ Error al cargar los repuestos.');
          repuestos = [];
        }
        setRepuestos(repuestos);
      } catch (error) {
        setMensaje('❌ Error general al cargar datos.');
        setClientes([]);
        setVehiculos([]);
        setRepuestos([]);
      }
    };
    fetchData();
  }, []);

  // Filtrar repuestos
  useEffect(() => {
    // Solo buscar si el input de búsqueda de repuesto está activo (no el de item manual)
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
    // El useEffect de clienteId ahora se encargará de actualizar vehiculosFiltrados y vehiculoSeleccionado
  }

  const handleVehiculoChange = (value: string) => {
    setVehiculoId(value)
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

  // Permitir agregar item manual (sin repuesto)
  const agregarItem = () => {
    // Solo agregar si hay repuesto seleccionado (flujo repuesto)
    if (repuestoSeleccionado && typeof repuestoSeleccionado === 'object') {
      if (cantidad <= 0) {
        setMensaje("❌ La cantidad debe ser mayor a 0")
        return
      }
      if (cantidad > (repuestoSeleccionado?.stock ?? 0)) {
        setMensaje(`❌ Stock insuficiente. Disponible: ${repuestoSeleccionado?.stock ?? 0}`)
        return
      }
      const itemExistente = items.find((item) => item.repuestoId === repuestoSeleccionado?.id)
      if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad
        if (nuevaCantidad > (repuestoSeleccionado?.stock ?? 0)) {
          setMensaje(`❌ Stock insuficiente. Ya tienes ${itemExistente.cantidad}`)
          return
        }
        setItems(
          items.map((item) =>
            item.repuestoId === repuestoSeleccionado?.id ? { ...item, cantidad: nuevaCantidad } : item,
          ),
        )
      } else {
        const nuevoItem: ItemProforma = {
          id: Date.now(),
          repuestoId: repuestoSeleccionado?.id ?? null,
          codigo: repuestoSeleccionado?.codigo ?? '',
          descripcion: repuestoSeleccionado?.descripcion ?? '',
          cantidad: cantidad,
          precio: repuestoSeleccionado?.precio ?? 0,
          categoria: repuestoSeleccionado?.categoria ?? '',
          stockDisponible: repuestoSeleccionado?.stock ?? 0,
        }
        setItems([...items, nuevoItem])
      }
      limpiarSeleccion()
      setMensaje(`✅ ${repuestoSeleccionado?.descripcion ?? ''} agregado`)
      setTimeout(() => setMensaje(""), 3000)
      return
    }
    // Si no hay repuesto seleccionado, no hacer nada aquí (el flujo manual es independiente)
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
    const errores: Record<string, string> = {};

    if (!numeroProforma.trim()) errores["numeroProforma"] = "Requerido";
    if (!clienteId) errores["clienteId"] = "Requerido";
    if (!vehiculoId) errores["vehiculoId"] = "Requerido";
    if (!descripcion.trim()) errores["descripcion"] = "Requerido";
    if (items.length === 0) errores["items"] = "Agrega al menos un item";

    setErrors(errores);
    return Object.keys(errores).length === 0;
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
      // Guardar items (enviando código y descripción editables, y permitiendo repuestoId nulo)
      for (const item of items) {
        await apiProformaItems.create({
          proforma_id: res.id,
          repuesto_id: item.repuestoId ?? null,
          codigo: item.codigo ?? null,
          descripcion: item.descripcion ?? '',
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
                    readOnly
                    className={errors.numeroProforma ? "border-red-500" : "bg-gray-100 cursor-not-allowed"}
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
                  <div className="flex gap-2 items-center">
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
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowNuevoClienteModal(true)}>
                      + Nuevo
                    </Button>
                  </div>
                  {errors.clienteId && <p className="text-sm text-red-500">{errors.clienteId}</p>}

                  {clienteSeleccionado && (
                    clienteSeleccionado.nombre && clienteSeleccionado.ruc ? (
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                        <p>
                          RUC: {clienteSeleccionado.ruc}
                        </p>
                        <p>
                          Teléfono: {clienteSeleccionado.telefono}
                        </p>
                      </div>
                    ) : null
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
                        Año: {vehiculoSeleccionado.anio}
                      </p>
                      <p>
                        Color: {vehiculoSeleccionado.color}
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

          {/* Modal para nuevo cliente y vehículo */}
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
                        .filter((c: Cliente, idx: number, arr: Cliente[]) => arr.findIndex((x: Cliente) => x.id === c.id) === idx)
                        .filter((c: Cliente) => c.nombre && c.ruc);
                      setClientes(finalClientes);

                      // Update vehicles state
                      const finalVehiculos = [...vehiculosActualizados, vehiculoCreado]
                        .filter((v, idx, arr) => arr.findIndex(x => x.id === v.id) === idx);
                      setVehiculos(finalVehiculos);

                      // --- INICIO: Actualizaciones cruciales e inmediatas de estado para mostrar los datos ---
                      // Seleccionar el cliente y vehículo recién creados
                      setClienteId(clienteCreado.id.toString());
                      setClienteSeleccionado(clienteCreado); // <-- ¡Importante! Asigna el objeto completo directamente

                      // Filtrar vehículos del cliente y asegurar solo uno por id
                      // Asegúrate de que vehiculosForNewClient se calcule a partir de finalVehiculos
                      const vehiculosForNewClient = finalVehiculos
                        .filter((v: Vehiculo) => v.cliente_id === clienteCreado.id)
                        .filter((v: Vehiculo) => v.marca && v.modelo && v.placa); // Mantén este filtro si es necesario
                      setVehiculosFiltrados(vehiculosForNewClient); // Actualiza la lista filtrada

                      setVehiculoId(vehiculoCreado.id.toString());
                      setVehiculoSeleccionado(vehiculoCreado); // <-- ¡Importante! Asigna el objeto completo directamente
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
                  }} disabled={loadingNuevoCliente}>
                    {loadingNuevoCliente ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </div>
            </div>
          )}



          {/* Lista de Items con botón + para mostrar el formulario de agregar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Items de la Proforma ({items.length})</CardTitle>
                {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}
              </div>
              <Button size="sm" variant="outline" onClick={() => {
                // Agregar una nueva fila vacía al final de la tabla
                setItems(prev => ([
                  ...prev,
                  {
                    id: Date.now(),
                    repuestoId: null,
                    codigo: '',
                    descripcion: '',
                    cantidad: 1,
                    precio: 0,
                    categoria: 'Manual',
                    stockDisponible: 0,
                  }
                ]));
              }} title="Agregar fila">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border-r border-gray-300">Código</TableHead>
                      <TableHead className="border-r border-gray-300 min-w-[220px] w-[220px]">Descripción</TableHead>
                      <TableHead className="text-center border-r border-gray-300">Cantidad</TableHead>
                      <TableHead className="text-right border-r border-gray-300">Precio</TableHead>
                      <TableHead className="text-right border-r border-gray-300">Total</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No hay items agregados
                          <br />
                          <span className="text-sm">Presiona el botón + para agregar repuestos o items manuales</span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, idx) => (
                        <TableRow key={item.id} style={{ position: 'relative' }}>
                          <TableCell className="font-mono border-r border-gray-300" style={{ position: 'relative' }}>
                            <Input
                              ref={el => { inputCodigoRefs.current[idx] = el; }}
                              value={item.codigo}
                              onFocus={e => {
                                setCodigoActivoIdx(idx);
                                setCodigoBusqueda(item.codigo);
                                const rect = e.target.getBoundingClientRect();
                                setDropdownPos({
                                  top: rect.bottom + window.scrollY,
                                  left: rect.left + window.scrollX,
                                  width: rect.width
                                });
                              }}
                              onBlur={() => {
                                setTimeout(() => setCodigoActivoIdx(null), 200);
                              }}
                              onChange={e => {
                                const nuevoCodigo = e.target.value;
                                setCodigoBusqueda(nuevoCodigo);
                                setItems(prev => prev.map(i => i.id === item.id ? {
                                  ...i,
                                  codigo: nuevoCodigo,
                                } : i));
                                const el = inputCodigoRefs.current[idx];
                                if (el) {
                                  const rect = el.getBoundingClientRect();
                                  setDropdownPos({
                                    top: rect.bottom + window.scrollY,
                                    left: rect.left + window.scrollX,
                                    width: rect.width
                                  });
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
                                // Only allow integer values
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
                              value={item.precio}
                              onChange={e => {
                                const nuevoPrecio = Number.parseFloat(e.target.value) || 0;
                                setItems(prev => prev.map(i => i.id === item.id ? { ...i, precio: nuevoPrecio } : i));
                              }}
                              className="w-full h-10 text-right font-mono font-light px-0 py-0 border-none bg-transparent focus:outline-none focus:bg-blue-50 focus:shadow-none"
                              style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none', padding: 0, margin: 0, height: '40px', minHeight: '40px', fontSize: '14px', lineHeight: '1.2' }}
                            />
                          </TableCell>
                          <TableCell className="text-right border-r border-gray-300">${(item.cantidad * item.precio).toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" onClick={() => eliminarItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Dropdown de coincidencias como portal superpuesto */}
              {typeof window !== 'undefined' && codigoActivoIdx !== null && codigoBusqueda.trim() !== "" && dropdownPos && (
                require('react-dom').createPortal(
                  <div style={{
                    position: 'absolute',
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    minWidth: Math.max(dropdownPos.width, 220),
                    maxWidth: 420,
                    zIndex: 9999,
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    marginTop: '4px',
                    padding: '6px 0',
                    fontSize: '15px',
                    lineHeight: '1.35',
                    letterSpacing: '0.01em',
                  }}>
                    {repuestos.filter(r =>
                      r.codigo.toLowerCase().includes(codigoBusqueda.toLowerCase()) ||
                      r.descripcion.toLowerCase().includes(codigoBusqueda.toLowerCase())
                    ).slice(0, 8).map(r => (
                      <div
                        key={r.id}
                        style={{
                          padding: '10px 18px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f6f6f6',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background 0.15s',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                        }}
                        onMouseDown={() => {
                          setItems(prev => prev.map(i => i.id === items[codigoActivoIdx].id ? {
                            ...i,
                            codigo: r.codigo,
                            descripcion: r.descripcion,
                            precio: r.precio,
                            categoria: r.categoria,
                            repuestoId: r.id,
                            stockDisponible: r.stock,
                          } : i));
                          setCodigoActivoIdx(null);
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e6f0ff'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span className="font-mono text-sm text-blue-700" style={{ minWidth: 80, fontWeight: 500 }}>{r.codigo}</span>
                        <span className="text-sm text-gray-800" style={{ flex: 1 }}>{r.descripcion}</span>
                      </div>
                    ))}
                    {repuestos.filter(r =>
                      r.codigo.toLowerCase().includes(codigoBusqueda.toLowerCase()) ||
                      r.descripcion.toLowerCase().includes(codigoBusqueda.toLowerCase())
                    ).length === 0 && (
                      <div style={{ padding: '12px 20px', color: '#999', fontSize: '15px', textAlign: 'center' }}>Sin coincidencias</div>
                    )}
                  </div>,
                  document.body
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Totales y notas */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>IVA (12%):</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={guardarProforma} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Guardando..." : "Guardar Proforma"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notas y Avisos</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notaAviso">Nota / Aviso (Validez)</Label>
              <Textarea
                id="notaAviso"
                value={notaAviso}
                onChange={(e) => setNotaAviso(e.target.value)}
                rows={3}
                className="mb-4"
              />
              <Label htmlFor="avisoGeneral">Aviso General</Label>
              <Textarea
                id="avisoGeneral"
                value={aviso}
                onChange={(e) => setAviso(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
