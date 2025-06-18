import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { forwardRef } from "react"

interface ProformaData {
  numero: string
  fecha: string
  entidad: {
    nombre: string
    propietario: string
    ruc: string
    direccion: string
    telefono: string
    email: string
    logo?: string // Agregado campo opcional para el logo
  }
  cliente: {
    nombre: string
    ruc: string
    direccion: string
    telefono: string
    email: string
  }
  vehiculo: {
    marca: string
    modelo: string
    anio: string
    color: string
    placa: string
    km: string
  }
  descripcion: string
  items: Array<{
    codigo: string
    descripcion: string
    cantidad: number
    precioUnitario: number
    precioTotal: number
  }>
  subtotal: number
  iva: number
  total: number
  notaAviso: string
  aviso: string
}

interface ProformaPDFPreviewProps {
  data: ProformaData
}

export const ProformaPDFPreview = forwardRef<HTMLDivElement, ProformaPDFPreviewProps>(function ProformaPDFPreview(
  { data },
  ref
) {
  return (
    <Card className="bg-white shadow-lg">
      <div className="p-8 space-y-6" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {/* Cabecera y datos principales para PDF (con ref) */}
        <div ref={ref as any}>
          {/* Encabezado de la empresa */}
          <div className="text-center border-b-2 border-gray-300 pb-6">
            {data.entidad.logo && (
              <img src={data.entidad.logo} alt="Logo" className="h-20 mx-auto mb-2 object-contain" />
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.entidad.nombre}</h1>
            <p className="text-sm text-gray-600">Propietario: {data.entidad.propietario}</p>
            <p className="text-sm text-gray-600">RUC: {data.entidad.ruc}</p>
            <p className="text-sm text-gray-600">{data.entidad.direccion}</p>
            <p className="text-sm text-gray-600">
              Tel: {data.entidad.telefono} | Email: {data.entidad.email}
            </p>
          </div>

          {/* Título del documento */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">PROFORMA</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-right">
                <span className="font-semibold">Número:</span>
              </div>
              <div className="text-left">
                <span className="font-mono">{data.numero}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">Fecha:</span>
              </div>
              <div className="text-left">
                <span>{new Date(data.fecha).toLocaleDateString("es-ES")}</span>
              </div>
            </div>
          </div>

          {/* Información del cliente y vehículo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Datos del cliente */}
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">DATOS DEL CLIENTE</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Nombre:</span> {data.cliente.nombre}
                </p>
                <p>
                  <span className="font-semibold">RUC/CI:</span> {data.cliente.ruc}
                </p>
                <p>
                  <span className="font-semibold">Dirección:</span> {data.cliente.direccion}
                </p>
                <p>
                  <span className="font-semibold">Teléfono:</span> {data.cliente.telefono}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {data.cliente.email}
                </p>
              </div>
            </div>

            {/* Datos del vehículo */}
            <div className="border border-gray-300 p-4 rounded">
              <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">DATOS DEL VEHÍCULO</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Marca:</span> {data.vehiculo.marca}
                </p>
                <p>
                  <span className="font-semibold">Modelo:</span> {data.vehiculo.modelo}
                </p>
                <p>
                  <span className="font-semibold">Año:</span> {data.vehiculo.anio}
                </p>
                <p>
                  <span className="font-semibold">Color:</span> {data.vehiculo.color}
                </p>
                <p>
                  <span className="font-semibold">Placa:</span> {data.vehiculo.placa}
                </p>
                <p>
                  <span className="font-semibold">Kilometraje:</span> {data.vehiculo.km} km
                </p>
              </div>
            </div>
          </div>

          {/* Descripción del trabajo */}
          <div className="border border-gray-300 p-4 rounded">
            <h3 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">DESCRIPCIÓN DEL TRABAJO</h3>
            <p className="text-sm text-gray-700">{data.descripcion}</p>
          </div>
        </div>

        {/* Tabla de repuestos y servicios */}
        <div className="border border-gray-300 rounded overflow-hidden">
          <h3 className="font-bold text-gray-800 bg-gray-100 p-3 border-b border-gray-300">
            DETALLE DE REPUESTOS Y SERVICIOS
          </h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border-b border-gray-300 font-semibold">Código</th>
                <th className="text-left p-2 border-b border-gray-300 font-semibold">Descripción</th>
                <th className="text-center p-2 border-b border-gray-300 font-semibold">Cant.</th>
                <th className="text-right p-2 border-b border-gray-300 font-semibold">P. Unit.</th>
                <th className="text-right p-2 border-b border-gray-300 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-2 border-b border-gray-200 font-mono text-xs">{item.codigo}</td>
                  <td className="p-2 border-b border-gray-200">{item.descripcion}</td>
                  <td className="p-2 border-b border-gray-200 text-center">{item.cantidad}</td>
                  <td className="p-2 border-b border-gray-200 text-right">${item.precioUnitario.toFixed(2)}</td>
                  <td className="p-2 border-b border-gray-200 text-right font-semibold">
                    ${item.precioTotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="flex justify-end">
          <div
            className="w-64 border border-gray-800 rounded bg-white"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div className="bg-gray-200 p-3 border-b border-gray-400">
              <h3 className="font-bold text-gray-900">RESUMEN</h3>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>${data.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (12%):</span>
                <span style={{ fontWeight: 600 }}>${data.iva.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid #888', margin: '8px 0' }} />
              <div className="flex justify-between font-bold text-lg" style={{ color: '#0a3d62' }}>
                <span>TOTAL:</span>
                <span>${data.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="space-y-4 border-t-2 border-gray-400 pt-6">
          <div
            className="p-3 rounded"
            style={{ background: '#fffbe6', border: '2px solid #ffe066' }}
          >
            <h4 className="font-bold text-gray-900 mb-2" style={{ color: '#b8860b' }}>NOTA IMPORTANTE:</h4>
            <p className="text-sm" style={{ color: '#7a5c00', fontWeight: 500 }}>{data.notaAviso}</p>
          </div>

          <div
            className="p-3 rounded"
            style={{ background: '#e3f0ff', border: '2px solid #90caf9' }}
          >
            <h4 className="font-bold text-gray-900 mb-2" style={{ color: '#1565c0' }}>TÉRMINOS Y CONDICIONES:</h4>
            <p className="text-sm" style={{ color: '#0d47a1', fontWeight: 500 }}>{data.aviso}</p>
          </div>
        </div>

        {/* Firmas */}
        <div className="grid grid-cols-2 gap-8 pt-8">
          <div className="text-center">
            <div
              style={{ borderTop: '2px solid #888', paddingTop: 8, marginTop: 64, minHeight: 60 }}
            >
              <p className="text-sm font-semibold" style={{ color: '#333' }}>FIRMA DEL CLIENTE</p>
              <p className="text-xs" style={{ color: '#666' }}>CI: {data.cliente.ruc}</p>
            </div>
          </div>
          <div className="text-center">
            <div
              style={{ borderTop: '2px solid #888', paddingTop: 8, marginTop: 64, minHeight: 60 }}
            >
              <p className="text-sm font-semibold" style={{ color: '#333' }}>AUTORIZADO POR</p>
              <p className="text-xs" style={{ color: '#666' }}>{data.entidad.propietario}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
          <p>Este documento fue generado electrónicamente y es válido sin firma autógrafa</p>
          <p>Fecha de generación: {new Date().toLocaleString("es-ES")}</p>
        </div>
      </div>
    </Card>
  )
})
