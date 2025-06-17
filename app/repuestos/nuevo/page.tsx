"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface RepuestoData {
  codigo: string
  descripcion: string
  categoria: string
  precio: string
  stock: string
  stockMinimo: string
  proveedor: string
  ubicacion: string
  estado: string
  notas: string
}

const categorias = [
  "Filtros",
  "Frenos",
  "Suspensión",
  "Motor",
  "Eléctrico",
  "Lubricantes",
  "Llantas",
  "Refrigeración",
  "Transmisión",
  "Servicios",
]

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") + "/repuestos/api_repuestos.php"

export default function NuevoRepuestoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<RepuestoData>({
    codigo: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
    stockMinimo: "",
    proveedor: "",
    ubicacion: "",
    estado: "activo",
    notas: "",
  })

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.codigo.trim()) {
      nuevosErrores.codigo = "El código es requerido"
    }
    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida"
    }
    if (!formData.categoria) {
      nuevosErrores.categoria = "La categoría es requerida"
    }
    if (!formData.precio.trim()) {
      nuevosErrores.precio = "El precio es requerido"
    } else if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser un número válido mayor a 0"
    }
    if (!formData.stock.trim()) {
      nuevosErrores.stock = "El stock es requerido"
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      nuevosErrores.stock = "El stock debe ser un número válido mayor o igual a 0"
    }
    if (!formData.stockMinimo.trim()) {
      nuevosErrores.stockMinimo = "El stock mínimo es requerido"
    } else if (isNaN(Number(formData.stockMinimo)) || Number(formData.stockMinimo) < 0) {
      nuevosErrores.stockMinimo = "El stock mínimo debe ser un número válido mayor o igual a 0"
    }
    if (!formData.proveedor.trim()) {
      nuevosErrores.proveedor = "El proveedor es requerido"
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardarRepuesto = async () => {
    if (!validarFormulario()) {
      return
    }

    setLoading(true)
    try {
      const repuestoData = {
        ...formData,
        precio: Number(formData.precio),
        precioIva: Number(formData.precio) * 1.12,
        stock: Number(formData.stock),
        stockMinimo: Number(formData.stockMinimo),
      }

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuestoData),
      })

      if (!response.ok) throw new Error("Error al guardar el repuesto")

      // Redirigir a la lista de repuestos
      router.push("/repuestos")
    } catch (error) {
      console.error("Error al guardar el repuesto:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Link href="/repuestos" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Nuevo Repuesto</h1>
            <p className="text-muted-foreground">Agregar un nuevo repuesto al inventario</p>
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

      <div className="max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Datos principales del repuesto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  placeholder="REP001"
                  value={formData.codigo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                  className={errors.codigo ? "border-red-500" : ""}
                />
                {errors.codigo && <p className="text-sm text-red-500">{errors.codigo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Filtro de aceite Toyota Original"
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                  className={errors.descripcion ? "border-red-500" : ""}
                />
                {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoria: value }))}
                >
                  <SelectTrigger className={errors.categoria ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor *</Label>
                <Input
                  id="proveedor"
                  placeholder="Toyota Ecuador"
                  value={formData.proveedor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, proveedor: e.target.value }))}
                  className={errors.proveedor ? "border-red-500" : ""}
                />
                {errors.proveedor && <p className="text-sm text-red-500">{errors.proveedor}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Precios e inventario */}
          <Card>
            <CardHeader>
              <CardTitle>Precios e Inventario</CardTitle>
              <CardDescription>Información de precios y stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio (sin IVA) *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  placeholder="12.50"
                  value={formData.precio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, precio: e.target.value }))}
                  className={errors.precio ? "border-red-500" : ""}
                />
                {errors.precio && <p className="text-sm text-red-500">{errors.precio}</p>}
                {formData.precio && !isNaN(Number(formData.precio)) && (
                  <p className="text-sm text-muted-foreground">
                    Precio con IVA: ${(Number(formData.precio) * 1.12).toFixed(2)}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock actual *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                    className={errors.stock ? "border-red-500" : ""}
                  />
                  {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockMinimo">Stock mínimo *</Label>
                  <Input
                    id="stockMinimo"
                    type="number"
                    placeholder="10"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stockMinimo: e.target.value }))}
                    className={errors.stockMinimo ? "border-red-500" : ""}
                  />
                  {errors.stockMinimo && <p className="text-sm text-red-500">{errors.stockMinimo}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación en bodega</Label>
                <Input
                  id="ubicacion"
                  placeholder="A1-B2"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ubicacion: e.target.value.toUpperCase() }))}
                />
              </div>

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
                    <SelectItem value="descontinuado">Descontinuado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notas adicionales */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
            <CardDescription>Notas y observaciones sobre el repuesto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                placeholder="Información adicional, compatibilidades, observaciones..."
                rows={4}
                value={formData.notas}
                onChange={(e) => setFormData((prev) => ({ ...prev, notas: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4 mt-6">
          <Button onClick={guardarRepuesto} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Repuesto
              </>
            )}
          </Button>
          <Link href="/repuestos" className="flex-1">
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
