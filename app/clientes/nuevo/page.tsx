"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClientes } from "@/lib/api"

interface ClienteData {
  nombre: string
  ruc: string
  direccion: string
  telefono: string
  email: string
  estado: string
  notas: string
}

export default function NuevoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ClienteData>({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    email: "",
    estado: "activo",
    notas: "",
  })

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido"
    }
    if (!formData.ruc.trim()) {
      nuevosErrores.ruc = "El RUC/CI es requerido"
    } else if (formData.ruc.length < 10) {
      nuevosErrores.ruc = "El RUC/CI debe tener al menos 10 dígitos"
    }
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es requerido"
    }
    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = "El email no es válido"
    }
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = "La dirección es requerida"
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardarCliente = async () => {
    if (!validarFormulario()) {
      return
    }
    setLoading(true)
    try {
      await apiClientes.create(formData)
      router.push("/clientes")
    } catch (error) {
      console.error("Error al guardar el cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Link href="/clientes" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
            <p className="text-muted-foreground">Agregar un nuevo cliente al sistema</p>
          </div>
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

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Complete los datos del nuevo cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información básica */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  placeholder="Juan Pérez García"
                  value={formData.nombre}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                  className={errors.nombre ? "border-red-500" : ""}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruc">RUC/Cédula *</Label>
                <Input
                  id="ruc"
                  placeholder="1234567890001"
                  value={formData.ruc}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ruc: e.target.value }))}
                  className={errors.ruc ? "border-red-500" : ""}
                />
                {errors.ruc && <p className="text-sm text-red-500">{errors.ruc}</p>}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  placeholder="+593 99 123-4567"
                  value={formData.telefono}
                  onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
                  className={errors.telefono ? "border-red-500" : ""}
                />
                {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                placeholder="Av. Principal 123, Ciudad"
                value={formData.direccion}
                onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
                className={errors.direccion ? "border-red-500" : ""}
              />
              {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, estado: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notas">Notas adicionales</Label>
              <Textarea
                id="notas"
                placeholder="Información adicional sobre el cliente..."
                rows={3}
                value={formData.notas}
                onChange={(e) => setFormData((prev) => ({ ...prev, notas: e.target.value }))}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button onClick={guardarCliente} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cliente
                  </>
                )}
              </Button>
              <Link href="/clientes" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
