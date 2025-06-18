import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image
} from "@react-pdf/renderer";

// Puedes registrar fuentes personalizadas si lo deseas
// Font.register({ family: 'Roboto', src: 'https://...' });

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 16,
  },
  resumenBox: {
    border: '1pt solid #333',
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    padding: 10,
    width: 220,
    marginLeft: 'auto',
    marginBottom: 16,
  },
  resumenTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#222',
    marginBottom: 6,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0a3d62',
    marginTop: 6,
  },
  avisoBox: {
    backgroundColor: '#fffbe6',
    border: '1pt solid #ffe066',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  avisoTitle: {
    color: '#b8860b',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  avisoText: {
    color: '#7a5c00',
    fontWeight: 500,
    fontSize: 11,
  },
  terminosBox: {
    backgroundColor: '#e3f0ff',
    border: '1pt solid #90caf9',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  terminosTitle: {
    color: '#1565c0',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  terminosText: {
    color: '#0d47a1',
    fontWeight: 500,
    fontSize: 11,
  },
  firmas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  firmaBox: {
    width: '45%',
    alignItems: 'center',
  },
  firmaLinea: {
    borderTop: '1pt solid #888',
    width: '100%',
    marginTop: 32,
    marginBottom: 4,
  },
  firmaLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  firmaSub: {
    fontSize: 9,
    color: '#666',
  },
});

export function ProformaPDFDocument({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* CABECERA DE EMPRESA */}
        <View style={[styles.section, { alignItems: 'center', borderBottom: '1pt solid #bbb', paddingBottom: 8, marginBottom: 12 }]}>  
          {data.entidad?.logo && (
            <Image src={data.entidad.logo} style={{ height: 50, marginBottom: 4 }} />
          )}
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222' }}>{data.entidad?.nombre || ''}</Text>
          <Text style={{ fontSize: 10, color: '#444' }}>Propietario: {data.entidad?.propietario || ''}</Text>
          <Text style={{ fontSize: 10, color: '#444' }}>RUC: {data.entidad?.ruc || ''}</Text>
          <Text style={{ fontSize: 10, color: '#444' }}>{data.entidad?.direccion || ''}</Text>
          <Text style={{ fontSize: 10, color: '#444' }}>Tel: {data.entidad?.telefono || ''} | Email: {data.entidad?.email || ''}</Text>
        </View>

        {/* TÍTULO Y DATOS DE PROFORMA */}
        <View style={[styles.section, { alignItems: 'center', marginBottom: 10 }]}>  
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0a3d62', marginBottom: 4 }}>PROFORMA</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24 }}>
            <Text style={{ fontSize: 10 }}>Número: <Text style={{ fontFamily: 'Courier', fontSize: 10 }}>{data.numero}</Text></Text>
            <Text style={{ fontSize: 10, marginLeft: 16 }}>Fecha: {data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES') : ''}</Text>
          </View>
        </View>

        {/* DATOS DE CLIENTE Y VEHÍCULO */}
        <View style={[styles.section, { flexDirection: 'row', gap: 16 }]}>  
          {/* Cliente */}
          <View style={{ flex: 1, border: '1pt solid #bbb', borderRadius: 4, padding: 8, marginRight: 8 }}>
            <Text style={{ fontWeight: 'bold', color: '#222', marginBottom: 2 }}>DATOS DEL CLIENTE</Text>
            <Text style={{ fontSize: 10 }}>Nombre: {data.cliente?.nombre || ''}</Text>
            <Text style={{ fontSize: 10 }}>RUC/CI: {data.cliente?.ruc || ''}</Text>
            <Text style={{ fontSize: 10 }}>Dirección: {data.cliente?.direccion || ''}</Text>
            <Text style={{ fontSize: 10 }}>Teléfono: {data.cliente?.telefono || ''}</Text>
            <Text style={{ fontSize: 10 }}>Email: {data.cliente?.email || ''}</Text>
          </View>
          {/* Vehículo */}
          <View style={{ flex: 1, border: '1pt solid #bbb', borderRadius: 4, padding: 8 }}>
            <Text style={{ fontWeight: 'bold', color: '#222', marginBottom: 2 }}>DATOS DEL VEHÍCULO</Text>
            <Text style={{ fontSize: 10 }}>Marca: {data.vehiculo?.marca || ''}</Text>
            <Text style={{ fontSize: 10 }}>Modelo: {data.vehiculo?.modelo || ''}</Text>
            <Text style={{ fontSize: 10 }}>Año: {data.vehiculo?.anio || ''}</Text>
            <Text style={{ fontSize: 10 }}>Color: {data.vehiculo?.color || ''}</Text>
            <Text style={{ fontSize: 10 }}>Placa: {data.vehiculo?.placa || ''}</Text>
            <Text style={{ fontSize: 10 }}>Kilometraje: {data.vehiculo?.km || ''} km</Text>
          </View>
        </View>

        {/* DESCRIPCIÓN DEL TRABAJO */}
        <View style={[styles.section, { border: '1pt solid #bbb', borderRadius: 4, padding: 8 }]}>  
          <Text style={{ fontWeight: 'bold', color: '#222', marginBottom: 2 }}>DESCRIPCIÓN DEL TRABAJO</Text>
          <Text style={{ fontSize: 10 }}>{data.descripcion || ''}</Text>
        </View>

        {/* TABLA DE ITEMS */}
        <View style={[styles.section, { border: '1pt solid #bbb', borderRadius: 4, padding: 0, marginBottom: 12 }]}>  
          <View style={{ flexDirection: 'row', backgroundColor: '#f1f3f4', borderBottom: '1pt solid #bbb' }}>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10, padding: 4 }}>Código</Text>
            <Text style={{ flex: 2, fontWeight: 'bold', fontSize: 10, padding: 4 }}>Descripción</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10, padding: 4, textAlign: 'center' }}>Cant.</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10, padding: 4, textAlign: 'right' }}>P. Unit.</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10, padding: 4, textAlign: 'right' }}>Total</Text>
          </View>
          {data.items && data.items.map((item: any, idx: number) => (
            <View key={idx} style={{ flexDirection: 'row', borderBottom: '1pt solid #eee' }}>
              <Text style={{ flex: 1, fontSize: 9, padding: 4 }}>{item.codigo}</Text>
              <Text style={{ flex: 2, fontSize: 9, padding: 4 }}>{item.descripcion}</Text>
              <Text style={{ flex: 1, fontSize: 9, padding: 4, textAlign: 'center' }}>{item.cantidad}</Text>
              <Text style={{ flex: 1, fontSize: 9, padding: 4, textAlign: 'right' }}>${Number(item.precioUnitario).toFixed(2)}</Text>
              <Text style={{ flex: 1, fontSize: 9, padding: 4, textAlign: 'right' }}>${Number(item.precioTotal).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* RESUMEN DE TOTALES */}
        <View style={styles.resumenBox}>
          <Text style={styles.resumenTitle}>RESUMEN</Text>
          <View style={styles.resumenRow}>
            <Text>Subtotal:</Text>
            <Text>${Number(data.subtotal).toFixed(2)}</Text>
          </View>
          <View style={styles.resumenRow}>
            <Text>IVA (12%):</Text>
            <Text>${Number(data.iva).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>TOTAL:</Text>
            <Text>${Number(data.total).toFixed(2)}</Text>
          </View>
        </View>

        {/* NOTA IMPORTANTE */}
        <View style={styles.avisoBox}>
          <Text style={styles.avisoTitle}>NOTA IMPORTANTE:</Text>
          <Text style={styles.avisoText}>{data.notaAviso}</Text>
        </View>

        {/* TÉRMINOS Y CONDICIONES */}
        <View style={styles.terminosBox}>
          <Text style={styles.terminosTitle}>TÉRMINOS Y CONDICIONES:</Text>
          <Text style={styles.terminosText}>{data.aviso}</Text>
        </View>

        {/* FIRMAS */}
        <View style={styles.firmas}>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaLabel}>FIRMA DEL CLIENTE</Text>
            <Text style={styles.firmaSub}>CI: {data.cliente?.ruc || ''}</Text>
          </View>
          <View style={styles.firmaBox}>
            <View style={styles.firmaLinea} />
            <Text style={styles.firmaLabel}>AUTORIZADO POR</Text>
            <Text style={styles.firmaSub}>{data.entidad?.propietario || ''}</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={{ textAlign: 'center', fontSize: 8, color: '#888', borderTop: '1pt solid #bbb', marginTop: 16, paddingTop: 6 }}>
          <Text>Este documento fue generado electrónicamente y es válido sin firma autógrafa</Text>
          <Text>Fecha de generación: {new Date().toLocaleString('es-ES')}</Text>
        </View>
      </Page>
    </Document>
  );
}
