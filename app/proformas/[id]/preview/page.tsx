"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Link from "next/link"
import { ProformaPDFPreview } from "@/components/proforma-pdf-preview"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { apiProformas, apiClientes, apiVehiculos, apiProformaItems, apiRepuestos, apiEntidades } from "@/lib/api"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import autoTable from "jspdf-autotable"
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { ProformaPDFDocument } from "@/components/ProformaPDFDocument";

export default function ProformaPreviewPage() {
  const params = useParams()
  const [proforma, setProforma] = useState<any>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [vehiculo, setVehiculo] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [repuestos, setRepuestos] = useState<any[]>([])
  const [entidad, setEntidad] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const pdfRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailToSend, setEmailToSend] = useState("");
  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) {
          setError("ID de proforma no válido");
          setLoading(false);
          return;
        }
        const data = await apiProformas.get(id)
        setProforma(data)
        if (data.cliente_id) {
          const cli = await apiClientes.get(data.cliente_id)
          setCliente(cli)
        }
        if (data.vehiculo_id) {
          const veh = await apiVehiculos.get(data.vehiculo_id)
          setVehiculo(veh)
        }
        if (data.entidad_id) {
          const ent = await apiEntidades.get(data.entidad_id)
          setEntidad(ent)
        }
        const itemsData = await apiProformaItems.list(id)
        setItems(itemsData)
        setRepuestos(await apiRepuestos.list())
      } catch (e: any) {
        setError("No se pudo cargar la proforma")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
    // Captura la cabecera y datos principales como imagen
    if (headerRef.current) {
      const canvas = await html2canvas(headerRef.current, { scale: 2 })
      const imgData = canvas.toDataURL("image/png")
      // Calcula el ancho disponible en PDF (A4: 595pt ancho, márgenes 40)
      const pageWidth = pdf.internal.pageSize.getWidth() - 80
      const imgProps = pdf.getImageProperties(imgData)
      const imgWidth = pageWidth
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width
      pdf.addImage(imgData, "PNG", 40, 40, imgWidth, imgHeight)
      // Tabla de repuestos y servicios con autoTable justo debajo
      autoTable(pdf, {
        startY: 40 + imgHeight + 16,
        head: [["Código", "Descripción", "Cant.", "P. Unit.", "Total"]],
  body: pdfData.items.map((item: any) => [
          item.codigo,
          item.descripcion,
          item.cantidad,
          `$${item.precioUnitario.toFixed(2)}`,
          `$${item.precioTotal.toFixed(2)}`
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [240,240,240], textColor: 30 },
        columnStyles: { 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
        theme: 'grid',
        margin: { left: 40, right: 40 },
        didDrawPage: (data) => {
          // Totales y notas al final de la tabla (en la última página)
          const isLastPage = data.pageNumber === pdf.getNumberOfPages();
          const y = data.cursor ? data.cursor.y + 20 : (data.table.finalY || 0) + 20;
          if (isLastPage) {
            pdf.setFontSize(11)
            pdf.text(`Subtotal: $${pdfData.subtotal.toFixed(2)}`, 400, y)
            pdf.text(`IVA (12%): $${pdfData.iva.toFixed(2)}`, 400, y + 15)
            pdf.setFontSize(13)
            pdf.text(`TOTAL: $${pdfData.total.toFixed(2)}`, 400, y + 35)
            pdf.setFontSize(10)
            pdf.text("NOTA IMPORTANTE:", 40, y)
            pdf.text(pdfData.notaAviso, 40, y + 15, { maxWidth: 320 })
            pdf.text("TÉRMINOS Y CONDICIONES:", 40, y + 45)
            pdf.text(pdfData.aviso, 40, y + 60, { maxWidth: 320 })
          }
        }
      })
      pdf.save(`proforma-${pdfData.numero}.pdf`)
    }
  }

  // Nueva función para enviar el PDF generado por correo
  async function handleSendEmailWithPDF() {
    setSending(true);
    setEmailResult(null);
    try {
      if (!pdfDataForDownload) {
        setEmailResult("No se pudo generar el PDF");
        setSending(false);
        return;
      }
      // Generar el PDF con @react-pdf/renderer
      const pdfInstance = pdf(<ProformaPDFDocument data={pdfDataForDownload} />);
      const pdfBlob = await pdfInstance.toBlob();
      const formData = new FormData();
      formData.append("pdf", pdfBlob, `proforma_${pdfDataForDownload.numero || "documento"}.pdf`);
      formData.append("email", emailToSend);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/repuestos/api_enviar_proforma.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setEmailResult("Correo enviado correctamente.");
      } else {
        setEmailResult(data.error || "No se pudo enviar el correo.");
      }
    } catch (e) {
      setEmailResult("Error de red o del servidor.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (error || !proforma) return <div className="p-8 text-center text-red-500">{error || "Proforma no encontrada"}</div>

  // Transformar datos para el PDF
  const pdfData = proforma && cliente && vehiculo && items.length > 0
    ? {
        ...proforma,
        cliente,
        vehiculo,
        items: items.map(item => ({
          codigo: item.codigo || (item.repuesto?.codigo ?? ""),
          descripcion: item.descripcion || (item.repuesto?.descripcion ?? ""),
          cantidad: Number(item.cantidad) || 0,
          precioUnitario: Number(item.precioUnitario) || Number(item.precio_unitario) || 0,
          precioTotal: Number(item.precioTotal) || Number(item.precio_total) || 0
        })),
        entidad: entidad || {
          nombre: "",
          propietario: "",
          ruc: "",
          direccion: "",
          telefono: "",
          email: "",
          logo: ""
        },
        subtotal: Number(proforma.subtotal) || 0,
        iva: Number(proforma.iva) || 0,
        total: Number(proforma.total) || 0,
        notaAviso: proforma.notaAviso || "",
        aviso: proforma.aviso || ""
      }
    : null;

  // Construir el objeto pdfData igual que para el preview visual
  const pdfDataForDownload = proforma && cliente && vehiculo && items.length > 0
    ? {
        ...proforma,
        cliente,
        vehiculo,
        items: items.map(item => ({
          codigo: item.codigo || (item.repuesto?.codigo ?? ""),
          descripcion: item.descripcion || (item.repuesto?.descripcion ?? ""),
          cantidad: Number(item.cantidad) || 0,
          precioUnitario: Number(item.precioUnitario) || Number(item.precio_unitario) || 0,
          precioTotal: Number(item.precioTotal) || Number(item.precio_total) || 0
        })),
        entidad: entidad || {
          nombre: "",
          propietario: "",
          ruc: "",
          direccion: "",
          telefono: "",
          email: "",
          logo: ""
        },
        subtotal: Number(proforma.subtotal) || 0,
        iva: Number(proforma.iva) || 0,
        total: Number(proforma.total) || 0,
        notaAviso: proforma.notaAviso || "",
        aviso: proforma.aviso || ""
      }
    : null;

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
            <h1 className="text-lg font-semibold">Vista Previa - {pdfData.numero}</h1>
            <Button variant="outline" size="sm" onClick={() => setShowEmailModal(true)}>
              Enviar por correo
            </Button>
          </div>
      {/* Modal para enviar por correo */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">Enviar proforma por correo</h2>
            <input
              type="email"
              className="border p-2 w-full mb-2"
              placeholder="Correo destinatario"
              value={emailToSend}
              onChange={e => setEmailToSend(e.target.value)}
              disabled={sending}
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSendEmailWithPDF} className="flex-1" disabled={sending || !emailToSend}>
                {sending ? "Enviando..." : "Enviar"}
              </Button>
              <Button onClick={() => setShowEmailModal(false)} className="flex-1" variant="outline" disabled={sending}>
                Cancelar
              </Button>
            </div>
            {emailResult && <div className="mt-2 text-sm text-center">{emailResult}</div>}
          </div>
        </div>
      )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            {/* Botón de descarga PDF con @react-pdf/renderer */}
            {pdfDataForDownload && (
              <div className="my-4">
                <PDFDownloadLink
                  document={<ProformaPDFDocument data={pdfDataForDownload} />}
                  fileName={`proforma_${pdfDataForDownload.numero || "documento"}.pdf`}
                >
                  {({ loading }) => loading ? "Generando PDF..." : "Descargar PDF"}
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vista previa del PDF */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto" ref={pdfRef}>
          {/* Pasa el ref de la cabecera a ProformaPDFPreview */}
          <ProformaPDFPreview data={pdfData} ref={headerRef} />
        </div>
      </div>
    </div>
  )
}
