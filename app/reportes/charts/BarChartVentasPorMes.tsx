"use client"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"

export default function BarChartVentasPorMes({ data }: { data: { mes: string, total: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
          <Legend />
          <Bar dataKey="total" fill="#22c55e" name="Ventas ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
