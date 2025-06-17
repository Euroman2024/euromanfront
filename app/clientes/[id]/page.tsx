"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Users, Car, FileText } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Datos de ejemplo del cliente
const clienteData = {
  id: 1,
  nombre: "Juan Pérez García",
  ruc: "1234567890001",
  direccion: "Av. Principal 123, Quito",
  telefono: "+593 99 123-4567",
  email: "juan.perez@email.com",
  estado: "activo",
  fechaRegistro: "2023-01-15",
  notas: "Cliente frecuente, siempre puntual con los pagos",
  vehiculos: [
    {
      id: 1,
      marca: "Toyota",
      modelo: "Corolla",
      anio: "2018",
      placa: "ABC-123",
      color: "Blanco",
    },
    {
      id: 2,
      marca: "Nissan",
      modelo: "Sentra",
      anio: "2020",
      placa: "DEF-456",
      color: "Gris",
    },
  ],
  proformas: [
    {
      id: 1,
      numero: "PRO-2023-001",
      fecha: "2023-05-15",
      total: 245.6,
      estado: "pendiente",
    },
    {
      id: 2,
      numero: "PRO-2023-015",
      fecha: "2023-04-20",
      total: 189.3,
      estado: "aprobada",
    },
    {
      id: 3,
      numero: "PRO-2023-008",
      fecha: "2023-03-10",
      total: 320.45,
      estado: "facturada",
    },
  ],
}

function getStatusColor(status: string) {
  switch (status) {
    case "activo":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "inactivo":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "aprobada":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "rechazada":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "facturada":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export default function ClienteDetailPage() {
  const params = useParams()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/clientes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">{clienteData.nombre}</h1>
              <p className="text-muted-foreground">RUC: {clienteData.ruc}</p>
            </div>
          </div>
          <Badge className={getStatusColor(clienteData.estado)} variant="outline">
            {clienteData.estado.charAt(0).toUpperCase() + clienteData.estado.slice(1)}
          </Badge>
        </div>
        <Link href={`/clientes/${params.id}/editar`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Cliente
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Datos del cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Nombre:</span>
                  <span className="col-span-2">{clienteData.nombre}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">RUC/CI:</span>
                  <span className="col-span-2 font-mono">{clienteData.ruc}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Teléfono:</span>
                  <span className="col-span-2">{clienteData.telefono}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Email:</span>
                  <span className="col-span-2">{clienteData.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Dirección:</span>
                  <span className="col-span-2">{clienteData.direccion}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Fecha registro:</span>
                  <span className="col-span-2">{new Date(clienteData.fechaRegistro).toLocaleDateString()}</span>
                </div>
                {clienteData.notas && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Notas:</span>
                    <span className="col-span-2">{clienteData.notas}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehículos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehículos ({clienteData.vehiculos.length})
              </CardTitle>
              <CardDescription>Vehículos registrados del cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Marca</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Color</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clienteData.vehiculos.map((vehiculo) => (
                      <TableRow key={vehiculo.id}>
                        <TableCell className="font-medium">{vehiculo.marca}</TableCell>
                        <TableCell>{vehiculo.modelo}</TableCell>
                        <TableCell>{vehiculo.anio}</TableCell>
                        <TableCell className="font-mono">{vehiculo.placa}</TableCell>
                        <TableCell>{vehiculo.color}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Historial de proformas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historial de Proformas ({clienteData.proformas.length})
              </CardTitle>
              <CardDescription>Proformas generadas para este cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clienteData.proformas.map((proforma) => (
                      <TableRow key={proforma.id}>
                        <TableCell className="font-mono">{proforma.numero}</TableCell>
                        <TableCell>{new Date(proforma.fecha).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right font-medium">${proforma.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(proforma.estado)} variant="outline">
                            {proforma.estado.charAt(0).toUpperCase() + proforma.estado.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral - Estadísticas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehículos:</span>
                <span className="font-medium">{clienteData.vehiculos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proformas:</span>
                <span className="font-medium">{clienteData.proformas.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total facturado:</span>
                <span className="font-medium">
                  $
                  {clienteData.proformas
                    .filter((p) => p.estado === "facturada")
                    .reduce((sum, p) => sum + p.total, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pendiente:</span>
                <span className="font-medium">
                  $
                  {clienteData.proformas
                    .filter((p) => p.estado === "pendiente" || p.estado === "aprobada")
                    .reduce((sum, p) => sum + p.total, 0)
                    .toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/proformas/nueva?cliente=${clienteData.id}`} className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Nueva Proforma
                </Button>
              </Link>
              <Link href={`/vehiculos/nuevo?cliente=${clienteData.id}`} className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Car className="mr-2 h-4 w-4" />
                  Agregar Vehículo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
