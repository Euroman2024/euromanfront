"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiEntidades } from "@/lib/api"

export default function DetalleEntidadPage() {
  const params = useParams()
  const id = params?.id
  const [entidad, setEntidad] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    apiEntidades.get(id).then(setEntidad)
  }, [id])

  if (!entidad) return <div className="container py-10">Cargando...</div>

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalle de Entidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entidad.logo && (
            <img src={entidad.logo} alt="Logo" className="h-24 mb-4 rounded border object-contain" />
          )}
          <div><strong>Nombre:</strong> {entidad.nombre}</div>
          <div><strong>Propietario:</strong> {entidad.propietario}</div>
          <div><strong>RUC:</strong> {entidad.ruc}</div>
          <div><strong>Dirección:</strong> {entidad.direccion}</div>
          <div><strong>Teléfono:</strong> {entidad.telefono}</div>
          <div><strong>Email:</strong> {entidad.email}</div>
          <div><strong>Tipo:</strong> {entidad.tipo}</div>
          <div><strong>Estado:</strong> {entidad.estado}</div>
        </CardContent>
      </Card>
    </div>
  )
}
