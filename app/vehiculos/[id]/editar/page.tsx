"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function EditarVehiculoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<VehiculoData | null>(null)
  const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>([])
  const [busquedaCliente, setBusquedaCliente] = useState("")

  useEffect(() => {
    if (!id) return
    apiVehiculos.get(id).then((data) => {
      setFormData({
        cliente_id: data.cliente_id ?? "",
        marca: data.marca || "",
        modelo: data.modelo || "",
        anio: String(data.anio ?? ""),
        placa: data.placa || "",
        color: data.color || "",
        vin: data.vin || "",
        motor: data.motor || "",
        combustible: data.combustible || "Gasolina",
        transmision: data.transmision || "Manual",
        kilometraje: String(data.kilometraje ?? ""),
        estado: data.estado || "activo",
      })
    })
  }, [id])

  useEffect(() => {
    apiClientes.list().then((data) => {
      setClientes(Array.isArray(data) ? data.map((c: any) => ({ id: c.id, nombre: c.nombre })) : [])
    })
  }, [id])

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}
    if (!formData) return false
    if (!formData.marca.trim()) nuevosErrores.marca = "La marca es requerida"
    if (!formData.modelo.trim()) nuevosErrores.modelo = "El modelo es requerido"
    if (!formData.anio.trim()) nuevosErrores.anio = "El año es requerido"
    if (!formData.placa.trim()) nuevosErrores.placa = "La placa es requerida"
    if (!formData.color.trim()) nuevosErrores.color = "El color es requerido"
    if (!formData.kilometraje.trim()) nuevosErrores.kilometraje = "El kilometraje es requerido"
    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const actualizarVehiculo = async () => {
    if (!formData || !validarFormulario()) return
    setLoading(true)
    try {
      const vehiculoData = {
        ...formData,
        anio: Number(formData.anio),
        kilometraje: Number(formData.kilometraje),
        cliente_id: formData.cliente_id ? Number(formData.cliente_id) : null,
      }
      // Convertir a x-www-form-urlencoded
      const urlEncoded = new URLSearchParams()
      Object.entries(vehiculoData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) urlEncoded.append(key, String(value))
      })
      await apiVehiculos.update(id, urlEncoded)
      router.push("/vehiculos")
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!formData) return <div className="container py-10">Cargando...</div>

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
            <h1 className="text-3xl font-bold">Editar Vehículo</h1>
            <p className="text-muted-foreground">Modificar los datos del vehículo</p>
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
            <CardDescription>Modifique la información del vehículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca *</Label>
              <Input id="marca" value={formData.marca} onChange={e => setFormData(prev => prev ? { ...prev, marca: e.target.value } : prev)} className={errors.marca ? "border-red-500" : ""} />
              {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input id="modelo" value={formData.modelo} onChange={e => setFormData(prev => prev ? { ...prev, modelo: e.target.value } : prev)} className={errors.modelo ? "border-red-500" : ""} />
              {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="anio">Año *</Label>
              <Input id="anio" type="number" value={formData.anio} onChange={e => setFormData(prev => prev ? { ...prev, anio: e.target.value } : prev)} className={errors.anio ? "border-red-500" : ""} />
              {errors.anio && <p className="text-sm text-red-500">{errors.anio}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="placa">Placa *</Label>
              <Input id="placa" value={formData.placa} onChange={e => setFormData(prev => prev ? { ...prev, placa: e.target.value.toUpperCase() } : prev)} className={errors.placa ? "border-red-500" : ""} />
              {errors.placa && <p className="text-sm text-red-500">{errors.placa}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Input id="color" value={formData.color} onChange={e => setFormData(prev => prev ? { ...prev, color: e.target.value } : prev)} className={errors.color ? "border-red-500" : ""} />
              {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" value={formData.vin} onChange={e => setFormData(prev => prev ? { ...prev, vin: e.target.value } : prev)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motor">Motor</Label>
              <Input id="motor" value={formData.motor} onChange={e => setFormData(prev => prev ? { ...prev, motor: e.target.value } : prev)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="combustible">Combustible</Label>
              <select id="combustible" value={formData.combustible} onChange={e => setFormData(prev => prev ? { ...prev, combustible: e.target.value } : prev)} className="w-full border rounded px-2 py-1">
                {combustibles.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmision">Transmisión</Label>
              <select id="transmision" value={formData.transmision} onChange={e => setFormData(prev => prev ? { ...prev, transmision: e.target.value } : prev)} className="w-full border rounded px-2 py-1">
                {transmisiones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kilometraje">Kilometraje *</Label>
              <Input id="kilometraje" type="number" value={formData.kilometraje} onChange={e => setFormData(prev => prev ? { ...prev, kilometraje: e.target.value } : prev)} className={errors.kilometraje ? "border-red-500" : ""} />
              {errors.kilometraje && <p className="text-sm text-red-500">{errors.kilometraje}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select id="estado" value={formData.estado} onChange={e => setFormData(prev => prev ? { ...prev, estado: e.target.value } : prev)} className="w-full border rounded px-2 py-1">
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
                onChange={e => setFormData(prev => prev ? { ...prev, cliente_id: e.target.value ? Number(e.target.value) : "" } : prev)}
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
          <Button onClick={actualizarVehiculo} disabled={loading} className="flex-1">
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
