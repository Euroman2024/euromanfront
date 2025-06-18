"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Car } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { apiVehiculos, apiClientes } from "@/lib/api"

interface VehiculoData {
  cliente_id: number | ""
  marca: string
  modelo: string
  anio: string
  placa: string
  color: string
  vin: string
  motor: string
  combustible: string
  transmision: string
  kilometraje: string
  estado: string
}

const estados = ["activo", "inactivo"]
const combustibles = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"]
const transmisiones = ["Manual", "Automática", "CVT"]

export default function NuevoVehiculoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<VehiculoData>({
    cliente_id: "",
    marca: "",
    modelo: "",
    anio: "",
    placa: "",
    color: "",
    vin: "",
    motor: "",
    combustible: "Gasolina",
    transmision: "Manual",
    kilometraje: "",
    estado: "activo",
  })
  const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>([])
  const [busquedaCliente, setBusquedaCliente] = useState("")

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}
    if (!formData.marca.trim()) nuevosErrores.marca = "La marca es requerida"
    if (!formData.modelo.trim()) nuevosErrores.modelo = "El modelo es requerido"
    if (!formData.anio.trim()) nuevosErrores.anio = "El año es requerido"
    if (!formData.placa.trim()) nuevosErrores.placa = "La placa es requerida"
    if (!formData.color.trim()) nuevosErrores.color = "El color es requerido"
    if (!formData.kilometraje.trim()) nuevosErrores.kilometraje = "El kilometraje es requerido"
    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardarVehiculo = async () => {
    if (!validarFormulario()) return
    setLoading(true)
    try {
      const vehiculoData = {
        ...formData,
        anio: Number(formData.anio),
        kilometraje: Number(formData.kilometraje),
        cliente_id: formData.cliente_id ? Number(formData.cliente_id) : null,
      }
      await apiVehiculos.create(vehiculoData)
      router.push("/vehiculos")
    } catch (error) {
      console.error("Error al guardar el vehículo:", error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar clientes al montar
  useEffect(() => {
    apiClientes.list().then((data) => {
      setClientes(Array.isArray(data) ? data.map((c: any) => ({ id: c.id, nombre: c.nombre })) : [])
    })
  }, [])

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Link href="/vehiculos" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Car className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Nuevo Vehículo</h1>
            <p className="text-muted-foreground">Agregar un nuevo vehículo al sistema</p>
          </div>
        </div>
      </div>
      {Object.keys(errors).length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Por favor, corrija los errores en el formulario antes de continuar.
          </AlertDescription>
        </Alert>
      )}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Datos del Vehículo</CardTitle>
            <CardDescription>Complete la información del vehículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca *</Label>
              <Input id="marca" value={formData.marca} onChange={e => setFormData(prev => ({ ...prev, marca: e.target.value }))} className={errors.marca ? "border-red-500" : ""} />
              {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input id="modelo" value={formData.modelo} onChange={e => setFormData(prev => ({ ...prev, modelo: e.target.value }))} className={errors.modelo ? "border-red-500" : ""} />
              {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="anio">Año *</Label>
              <Input id="anio" type="number" value={formData.anio} onChange={e => setFormData(prev => ({ ...prev, anio: e.target.value }))} className={errors.anio ? "border-red-500" : ""} />
              {errors.anio && <p className="text-sm text-red-500">{errors.anio}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="placa">Placa *</Label>
              <Input id="placa" value={formData.placa} onChange={e => setFormData(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))} className={errors.placa ? "border-red-500" : ""} />
              {errors.placa && <p className="text-sm text-red-500">{errors.placa}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input id="color" value={formData.color} onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))} className={errors.color ? "border-red-500" : ""} />
              {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" value={formData.vin} onChange={e => setFormData(prev => ({ ...prev, vin: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motor">Motor</Label>
              <Input id="motor" value={formData.motor} onChange={e => setFormData(prev => ({ ...prev, motor: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="combustible">Combustible</Label>
              <select id="combustible" value={formData.combustible} onChange={e => setFormData(prev => ({ ...prev, combustible: e.target.value }))} className="w-full border rounded px-2 py-1">
                {combustibles.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmision">Transmisión</Label>
              <select id="transmision" value={formData.transmision} onChange={e => setFormData(prev => ({ ...prev, transmision: e.target.value }))} className="w-full border rounded px-2 py-1">
                {transmisiones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kilometraje">Kilometraje *</Label>
              <Input id="kilometraje" type="number" value={formData.kilometraje} onChange={e => setFormData(prev => ({ ...prev, kilometraje: e.target.value }))} className={errors.kilometraje ? "border-red-500" : ""} />
              {errors.kilometraje && <p className="text-sm text-red-500">{errors.kilometraje}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select id="estado" value={formData.estado} onChange={e => setFormData(prev => ({ ...prev, estado: e.target.value }))} className="w-full border rounded px-2 py-1">
                {estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente_id">Dueño *</Label>
              <Input
                id="busquedaCliente"
                placeholder="Buscar cliente..."
                value={busquedaCliente}
                onChange={e => setBusquedaCliente(e.target.value)}
                className="mb-2"
              />
              <select
                id="cliente_id"
                value={formData.cliente_id}
                onChange={e => setFormData(prev => ({ ...prev, cliente_id: e.target.value ? Number(e.target.value) : "" }))}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Selecciona un cliente</option>
                {clientes.filter(cliente => cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())).map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 mt-6">
          <Button onClick={guardarVehiculo} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Vehículo
              </>
            )}
          </Button>
          <Link href="/vehiculos" className="flex-1">
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
