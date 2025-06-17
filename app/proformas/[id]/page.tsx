import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Eye, Printer, Edit } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para la proforma específica
const proformaData = {
  id: 1,
  numero: "PRO-2023-001",
  fecha: "2023-05-15",
  estado: "pendiente",
  cliente: {
    nombre: "Juan Pérez García",
    ruc: "1234567890001",
    direccion: "Calle Secundaria 456, Quito",
    telefono: "+593 99 123-4567",
    email: "juan.perez@email.com",
  },
  vehiculo: {
    marca: "Toyota",
    modelo: "Corolla",
    anio: "2018",
    color: "Blanco",
    placa: "ABC-123",
    km: "45,000",
  },
  descripcion: "Mantenimiento preventivo y cambio de repuestos",
  items: [
    {
      codigo: "REP001",
      descripcion: "Filtro de aceite Toyota Original",
      cantidad: 1,
      precioUnitario: 12.5,
      precioTotal: 12.5,
    },
    {
      codigo: "REP002",
      descripcion: "Pastillas de freno delanteras",
      cantidad: 1,
      precioUnitario: 45.0,
      precioTotal: 45.0,
    },
    {
      codigo: "REP003",
      descripcion: "Aceite motor 5W-30 (4 litros)",
      cantidad: 1,
      precioUnitario: 28.0,
      precioTotal: 28.0,
    },
    {
      codigo: "REP004",
      descripcion: "Filtro de aire",
      cantidad: 1,
      precioUnitario: 15.75,
      precioTotal: 15.75,
    },
    {
      codigo: "REP005",
      descripcion: "Mano de obra - Mantenimiento",
      cantidad: 1,
      precioUnitario: 35.0,
      precioTotal: 35.0,
    },
  ],
  subtotal: 136.25,
  iva: 16.35,
  total: 152.6,
  notaAviso: "Esta proforma tiene validez de 15 días a partir de la fecha de emisión.",
  aviso: "Los precios incluyen IVA. Garantía de 30 días en repuestos y 15 días en mano de obra.",
}

function getStatusColor(status: string) {
  switch (status) {
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

export default function ProformaDetailPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/proformas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{proformaData.numero}</h1>
            <p className="text-muted-foreground">Fecha: {new Date(proformaData.fecha).toLocaleDateString()}</p>
          </div>
          <Badge className={getStatusColor(proformaData.estado)} variant="outline">
            {proformaData.estado.charAt(0).toUpperCase() + proformaData.estado.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Link href={`/proformas/${proformaData.id}/preview`}>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Vista Previa
            </Button>
          </Link>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Datos del cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Nombre:</span>
                  <span className="col-span-2">{proformaData.cliente.nombre}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">RUC/CI:</span>
                  <span className="col-span-2">{proformaData.cliente.ruc}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Dirección:</span>
                  <span className="col-span-2">{proformaData.cliente.direccion}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Teléfono:</span>
                  <span className="col-span-2">{proformaData.cliente.telefono}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Email:</span>
                  <span className="col-span-2">{proformaData.cliente.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos del vehículo */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Marca:</span>
                  <span className="col-span-2">{proformaData.vehiculo.marca}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Modelo:</span>
                  <span className="col-span-2">{proformaData.vehiculo.modelo}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Año:</span>
                  <span className="col-span-2">{proformaData.vehiculo.anio}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Color:</span>
                  <span className="col-span-2">{proformaData.vehiculo.color}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Placa:</span>
                  <span className="col-span-2">{proformaData.vehiculo.placa}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-medium">Kilometraje:</span>
                  <span className="col-span-2">{proformaData.vehiculo.km} km</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción del Trabajo</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{proformaData.descripcion}</p>
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
            <CardDescription>Totales de la proforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${proformaData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA (12%):</span>
                <span>${proformaData.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${proformaData.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de repuestos */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detalle de Repuestos y Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proformaData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell className="text-right">{item.cantidad}</TableCell>
                    <TableCell className="text-right">${item.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${item.precioTotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Notas y avisos */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Nota Importante</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{proformaData.notaAviso}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Términos y Condiciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{proformaData.aviso}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
