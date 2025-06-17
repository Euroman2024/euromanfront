import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Link from "next/link"
import { ProformaPDFPreview } from "@/components/proforma-pdf-preview"

// Datos de ejemplo para la proforma
const proformaData = {
  numero: "PRO-2023-001",
  fecha: "2023-05-15",
  entidad: {
    nombre: "AutoRepuestos El Mecánico",
    propietario: "Carlos Mendoza",
    ruc: "1291790642001",
    direccion: "Av. Principal 123, Quito, Ecuador",
    telefono: "+593 2 234-5678",
    email: "info@autorepuestos.com",
  },
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

export default function ProformaPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con controles */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/proformas">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Vista Previa - {proformaData.numero}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Vista previa del PDF */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <ProformaPDFPreview data={proformaData} />
        </div>
      </div>
    </div>
  )
}
