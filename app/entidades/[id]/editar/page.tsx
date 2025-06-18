"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Building2, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { apiEntidades } from "@/lib/api"

interface EntidadData {
  nombre: string
  propietario: string
  ruc: string
  direccion: string
  telefono: string
  email: string
  tipo: string
  estado: string
  logo?: string | null
}

const tipos = ["matriz", "sucursal"]
const estados = ["activo", "inactivo"]

export default function EditarEntidadPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<EntidadData | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    apiEntidades.get(id).then((data) => {
      setFormData({
        nombre: data.nombre || "",
        propietario: data.propietario || "",
        ruc: data.ruc || "",
        direccion: data.direccion || "",
        telefono: data.telefono || "",
        email: data.email || "",
        tipo: data.tipo || "matriz",
        estado: data.estado || "activo",
        logo: data.logo || null
      })
      setLogoPreview(data.logo || null)
    })
  }, [id])

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}
    if (!formData) return false
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido"
    if (!formData.propietario.trim()) nuevosErrores.propietario = "El propietario es requerido"
    if (!formData.ruc.trim()) nuevosErrores.ruc = "El RUC es requerido"
    if (!formData.direccion.trim()) nuevosErrores.direccion = "La dirección es requerida"
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido"
    if (!formData.email.trim()) nuevosErrores.email = "El email es requerido"
    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const actualizarEntidad = async () => {
    if (!formData || !validarFormulario()) return
    setLoading(true)
    try {
      await apiEntidades.update(id, formData)
      router.push("/entidades")
    } catch (error) {
      console.error("Error al actualizar la entidad:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
        setFormData((prev) => prev ? { ...prev, logo: result } : prev)
      }
      reader.readAsDataURL(file)
    }
  }

  const quitarLogo = () => {
    setFormData((prev) => prev ? { ...prev, logo: null } : prev)
    setLogoPreview(null)
  }

  if (!formData) return <div className="container py-10">Cargando...</div>

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Link href="/entidades" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Editar Entidad</h1>
            <p className="text-muted-foreground">Modificar los datos de la entidad</p>
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
            <CardTitle>Datos de la Entidad</CardTitle>
            <CardDescription>Modifique la información de la empresa o sucursal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" value={formData.nombre} onChange={e => setFormData(prev => prev ? { ...prev, nombre: e.target.value } : prev)} className={errors.nombre ? "border-red-500" : ""} />
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="propietario">Propietario *</Label>
              <Input id="propietario" value={formData.propietario} onChange={e => setFormData(prev => prev ? { ...prev, propietario: e.target.value } : prev)} className={errors.propietario ? "border-red-500" : ""} />
              {errors.propietario && <p className="text-sm text-red-500">{errors.propietario}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC *</Label>
              <Input id="ruc" value={formData.ruc} onChange={e => setFormData(prev => prev ? { ...prev, ruc: e.target.value } : prev)} className={errors.ruc ? "border-red-500" : ""} />
              {errors.ruc && <p className="text-sm text-red-500">{errors.ruc}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input id="direccion" value={formData.direccion} onChange={e => setFormData(prev => prev ? { ...prev, direccion: e.target.value } : prev)} className={errors.direccion ? "border-red-500" : ""} />
              {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input id="telefono" value={formData.telefono} onChange={e => setFormData(prev => prev ? { ...prev, telefono: e.target.value } : prev)} className={errors.telefono ? "border-red-500" : ""} />
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" value={formData.email} onChange={e => setFormData(prev => prev ? { ...prev, email: e.target.value } : prev)} className={errors.email ? "border-red-500" : ""} />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <select id="tipo" value={formData.tipo} onChange={e => setFormData(prev => prev ? { ...prev, tipo: e.target.value } : prev)} className="w-full border rounded px-2 py-1">
                {tipos.map(tipo => <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <select id="estado" value={formData.estado} onChange={e => setFormData(prev => prev ? { ...prev, estado: e.target.value } : prev)} className="w-full border rounded px-2 py-1">
                {estados.map(estado => <option key={estado} value={estado}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} />
              {logoPreview && (
                <div className="relative inline-block mt-2">
                  <img src={logoPreview} alt="Logo preview" className="h-16 rounded border" />
                  <button type="button" onClick={quitarLogo} className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-100">
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 mt-6">
          <Button onClick={actualizarEntidad} disabled={loading} className="flex-1">
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
          <Link href="/entidades" className="flex-1">
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
