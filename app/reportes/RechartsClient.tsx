"use client"
import dynamic from "next/dynamic"

export const BarChartProformasPorMes = dynamic(() => import("./charts/BarChartProformasPorMes"), { ssr: false })
export const BarChartVentasPorMes = dynamic(() => import("./charts/BarChartVentasPorMes"), { ssr: false })
export const PieChartEstados = dynamic(() => import("./charts/PieChartEstados"), { ssr: false })
