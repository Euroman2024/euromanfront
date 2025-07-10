"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Eye, Printer, Edit } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { apiProformas, apiClientes, apiVehiculos, apiProformaItems, apiRepuestos } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ProformaPDFPreview } from "@/components/proforma-pdf-preview";

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
  const params = useParams()
  const [proforma, setProforma] = useState<any>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [vehiculo, setVehiculo] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [repuestos, setRepuestos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [estadoEdit, setEstadoEdit] = useState<string>("")
  const [savingEstado, setSavingEstado] = useState(false)
  const [estadoPendiente, setEstadoPendiente] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailToSend, setEmailToSend] = useState("")
  const [sending, setSending] = useState(false)
  const [emailResult, setEmailResult] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null);

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
        setEstadoEdit(data.estado)
        if (data.cliente_id) {
          const cli = await apiClientes.get(data.cliente_id)
          setCliente(cli)
        }
        if (data.vehiculo_id) {
          const veh = await apiVehiculos.get(data.vehiculo_id)
          setVehiculo(veh)
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

  const handleEstadoChange = (nuevoEstado: string) => {
    setEstadoPendiente(nuevoEstado)
    setShowConfirm(true)
  }

  const confirmarCambioEstado = async () => {
    if (!proforma || !estadoPendiente) return
    setSavingEstado(true)
    setShowConfirm(false)
    try {
      await apiProformas.update(proforma.id, { ...proforma, estado: estadoPendiente })
      setProforma((prev: any) => ({ ...prev, estado: estadoPendiente }))
      setEstadoEdit(estadoPendiente)
    } catch (e) {
      // Manejo de error opcional
    } finally {
      setSavingEstado(false)
      setEstadoPendiente(null)
    }
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""

  const handleSendEmail = async () => {
    setSending(true)
    setEmailResult(null)
    try {
      const res = await fetch(`${API_BASE_URL}/repuestos/api_enviar_proforma.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proforma_id: proforma.id, email: emailToSend })
      })
      const data = await res.json()
      if (data.success) {
        setEmailResult("Correo enviado correctamente.")
      } else {
        setEmailResult(data.error || "No se pudo enviar el correo.")
      }
    } catch (e) {
      setEmailResult("Error de red o del servidor.")
    } finally {
      setSending(false)
    }
  }

  // Nueva función para enviar el PDF generado por correo
  const handleSendEmailWithPDF = async () => {
    setSending(true);
    setEmailResult(null);
    try {
      if (!previewRef.current) {
        console.error("previewRef.current es null");
        setEmailResult("No se pudo generar el PDF (previewRef vacío)");
        setSending(false);
        return;
      }
      // Espera breve para asegurar renderizado completo
      await new Promise(r => setTimeout(r, 300));
      let canvas;
      try {
        canvas = await html2canvas(previewRef.current, { scale: 2 });
      } catch (err) {
        console.error("Error al capturar canvas:", err);
        setEmailResult("No se pudo capturar la imagen del preview");
        setSending(false);
        return;
      }
      // Validar dimensiones del canvas
      if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
        console.error("Canvas con dimensiones inválidas", canvas.width, canvas.height);
        setEmailResult("No se pudo generar la imagen: dimensiones inválidas");
        setSending(false);
        return;
      }
      // Convertir a JPEG para máxima compatibilidad
      let imgData;
      try {
        imgData = canvas.toDataURL("image/jpeg", 0.95); // JPEG, calidad alta
        // Depuración visual
        const win = window.open();
        if (win) {
          win.document.write('<iframe src="' + imgData + '" frameborder="0" style="width:100vw;height:100vh;"></iframe>');
        }
      } catch (err) {
        console.error("Error al convertir canvas a imagen:", err);
        setEmailResult("No se pudo convertir el preview a imagen");
        setSending(false);
        return;
      }
      // Medidas de la página A4 en pt
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      // Calcula el tamaño de la imagen para que encaje en el ancho de la página
      const imgProps = {
        width: canvas.width * 0.75, // px a pt (aprox 96dpi a 72dpi)
        height: canvas.height * 0.75
      };
      let pdfWidth = pageWidth - 80; // márgenes
      let scale = imgProps.width > 0 ? pdfWidth / imgProps.width : 1;
      let pdfHeight = imgProps.height * scale;
      // Validar que los valores sean finitos y positivos
      if (!isFinite(pdfWidth) || !isFinite(pdfHeight) || pdfWidth <= 0 || pdfHeight <= 0) {
        console.error("Tamaño de imagen para PDF inválido", pdfWidth, pdfHeight);
        setEmailResult("No se pudo calcular el tamaño de la imagen para el PDF");
        setSending(false);
        return;
      }
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      try {
        pdf.addImage(imgData, "JPEG", 40, 40, pdfWidth, pdfHeight);
      } catch (err) {
        console.error("Error al agregar imagen al PDF:", err);
        setEmailResult("No se pudo agregar la imagen al PDF (JPEG corrupto)");
        setSending(false);
        return;
      }
      const pdfBlob = pdf.output("blob");
      if (!pdfBlob || pdfBlob.size === 0) {
        console.error("El PDF generado está vacío");
        setEmailResult("No se pudo generar el PDF (archivo vacío)");
        setSending(false);
        return;
      }
      const formData = new FormData();
      formData.append("pdf", pdfBlob, "proforma.pdf");
      formData.append("email", emailToSend);
      for (let pair of formData.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/repuestos/api_enviar_proforma.php`, {
        method: "POST",
        body: formData,
      });
      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        setEmailResult("Respuesta inválida del servidor");
        setSending(false);
        return;
      }
      if (data.success) {
        setEmailResult("Correo enviado correctamente.");
      } else {
        setEmailResult(data.error || "No se pudo enviar el correo.");
      }
    } catch (e) {
      setEmailResult("Error de red o del servidor.");
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  // Construir el objeto pdfData de forma segura
  const pdfData = proforma && cliente && vehiculo && items.length > 0
    ? {
        numero: proforma.numero || "",
        fecha: proforma.fecha || "",
        entidad: proforma.entidad || {
          nombre: "",
          propietario: "",
          ruc: "",
          direccion: "",
          telefono: "",
          email: "",
          logo: ""
        },
        cliente: cliente || {
          nombre: "",
          ruc: "",
          direccion: "",
          telefono: "",
          email: ""
        },
        vehiculo: vehiculo || {
          marca: "",
          modelo: "",
          anio: "",
          color: "",
          placa: "",
          km: ""
        },
        descripcion: proforma.descripcion || "",
        items: items.map(item => ({
          codigo: item.codigo || "",
          descripcion: item.descripcion || "",
          cantidad: Number(item.cantidad) || 0,
          precioUnitario: Number(item.precioUnitario) || 0,
          precioTotal: Number(item.precioTotal) || 0
        })),
        subtotal: Number(proforma.subtotal) || 0,
        iva: Number(proforma.iva) || 0,
        total: Number(proforma.total) || 0,
        notaAviso: proforma.notaAviso || "",
        aviso: proforma.aviso || ""
      }
    : null;

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (error || !proforma) return <div className="p-8 text-center text-red-500">{error || "Proforma no encontrada"}</div>

  return (
    <>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/proformas">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{proforma.numero}</h1>
              <p className="text-muted-foreground">Fecha: {new Date(proforma.fecha).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(proforma.estado)} variant="outline">
                {proforma.estado.charAt(0).toUpperCase() + proforma.estado.slice(1)}
              </Badge>
              <Select value={estadoEdit} onValueChange={handleEstadoChange} disabled={savingEstado}>
                <SelectTrigger className="w-[140px] ml-2">
                  <SelectValue placeholder="Cambiar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobada">Aprobada</SelectItem>
                  <SelectItem value="rechazada">Rechazada</SelectItem>
                  <SelectItem value="facturada">Facturada</SelectItem>
                </SelectContent>
              </Select>
              <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Confirmar cambio de estado?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de cambiar el estado de la proforma a <b>{estadoPendiente && estadoPendiente.charAt(0).toUpperCase() + estadoPendiente.slice(1)}</b>?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowConfirm(false)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmarCambioEstado} disabled={savingEstado}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/proformas/${proforma.id}/editar`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
            <Link href={`/proformas/${proforma.id}/preview`}>
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
                    <span className="col-span-2">{cliente?.nombre}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">RUC/CI:</span>
                    <span className="col-span-2">{cliente?.ruc}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Dirección:</span>
                    <span className="col-span-2">{cliente?.direccion}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Teléfono:</span>
                    <span className="col-span-2">{cliente?.telefono}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Email:</span>
                    <span className="col-span-2">{cliente?.email}</span>
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
                    <span className="col-span-2">{vehiculo?.marca}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Modelo:</span>
                    <span className="col-span-2">{vehiculo?.modelo}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Año:</span>
                    <span className="col-span-2">{vehiculo?.anio}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Color:</span>
                    <span className="col-span-2">{vehiculo?.color}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Placa:</span>
                    <span className="col-span-2">{vehiculo?.placa}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <span className="font-medium">Kilometraje:</span>
                    <span className="col-span-2">{vehiculo?.km} km</span>
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
                <p>{proforma.descripcion}</p>
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
                  <span>${Number(proforma.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (12%):</span>
                  <span>${Number(proforma.iva).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${Number(proforma.total).toFixed(2)}</span>
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
                    <TableHead className="w-10 text-center">N°</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay items registrados en esta proforma
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item: any, index: number) => {
                      const repuesto = repuestos.find(r => r.id === item.repuesto_id)
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-center font-mono text-xs">{index + 1}</TableCell>
                          <TableCell className="font-mono text-sm">{repuesto?.codigo || item.repuesto_id}</TableCell>
                          <TableCell>{repuesto?.descripcion || "-"}</TableCell>
                          <TableCell className="text-right">{item.cantidad}</TableCell>
                          <TableCell className="text-right">${Number(item.precio_unitario).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">${Number(item.cantidad * item.precio_unitario).toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
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
              <p className="text-sm">{proforma.nota_aviso}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Términos y Condiciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{proforma.aviso}</p>
            </CardContent>
          </Card>
        </div>

        {/* Botón y modal para enviar por correo */}
        <div className="mt-8">
          <Button onClick={() => setShowEmailModal(true)} className="w-full md:w-auto">
            Enviar por correo
          </Button>
        </div>

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

        {/* Preview visual oculto para generación de PDF */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }} ref={previewRef}>
          {pdfData && <ProformaPDFPreview data={pdfData} />}
        </div>
      </div>
    </>
  )
}
