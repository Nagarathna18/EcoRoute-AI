import { FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'

const LOCALITY_NAMES = {
  bangalore: { koramangala: 'Koramangala', indiranagar: 'Indiranagar', whitefield: 'Whitefield' },
  mysore: { gokulam: 'Gokulam', 'jayalakshmipuram': 'Jayalakshmipuram', 'saraswathipuram': 'Saraswathipuram', vijayanagar: 'Vijayanagar', 'kuvempu-nagar': 'Kuvempu Nagar', hebbal: 'Hebbal' },
  hubli: { vidyanagar: 'Vidyanagar', 'deshpande-nagar': 'Deshpande Nagar' },
  belagavi: { 'sadashiv-nagar': 'Sadashiv Nagar', tilakwadi: 'Tilakwadi' },
}

export default function PdfExport({ graphData, optimizationData, selectedCity, selectedLocality, onExport }) {
  const handleExport = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-IN')
    const cityName = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)
    const localityName = LOCALITY_NAMES[selectedCity]?.[selectedLocality] || selectedLocality

    // Header background
    doc.setFillColor(10, 10, 15)
    doc.rect(0, 0, pageWidth, 45, 'F')

    // Brand
    doc.setTextColor(0, 255, 136)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('EcoRoute AI', 15, 20)

    doc.setTextColor(180, 180, 180)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Smart Waste Collection & Route Optimization Platform', 15, 28)

    // Date/time
    doc.setTextColor(120, 120, 120)
    doc.setFontSize(9)
    doc.text(`Report generated: ${dateStr} at ${timeStr}`, 15, 38)

    let y = 55

    // Location Info
    doc.setFillColor(18, 18, 26)
    doc.roundedRect(15, y, pageWidth - 30, 25, 3, 3, 'F')
    doc.setTextColor(0, 255, 136)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Location Report', 22, y + 10)
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`City: ${cityName}  |  Locality: ${localityName}`, 22, y + 19)
    y += 35

    // Euler Path Analysis
    const eulerInfo = optimizationData?.euler_result?.info
    if (eulerInfo) {
      doc.setFillColor(18, 18, 26)
      doc.roundedRect(15, y, pageWidth - 30, 30, 3, 3, 'F')
      doc.setTextColor(0, 212, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Euler Path Analysis', 22, y + 10)
      doc.setTextColor(200, 200, 200)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Status: ${eulerInfo.message}`, 22, y + 19)
      doc.text(`Route Type: ${optimizationData?.euler_result?.type || 'N/A'}`, 22, y + 26)
      y += 40
    }

    // Analytics Summary
    const analytics = optimizationData?.analytics
    if (analytics) {
      doc.setFillColor(18, 18, 26)
      doc.roundedRect(15, y, pageWidth - 30, 65, 3, 3, 'F')
      doc.setTextColor(0, 255, 136)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Collection Analytics Summary', 22, y + 10)

      doc.setTextColor(200, 200, 200)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      const metrics = [
        [`Roads Covered: ${analytics.roads_covered}`, `Total Distance: ${analytics.total_distance}m`],
        [`Optimized Distance: ${analytics.optimized_distance}m`, `Distance Saved: ${analytics.distance_saved_pct}%`],
        [`Fuel Saved: ${analytics.fuel_saved_liters}L`, `Time Saved: ${analytics.time_saved_minutes} min`],
        [`Collection Efficiency: ${analytics.collection_efficiency}%`, `Algorithm: ${analytics.algorithm}`],
        [`Total Bins: ${analytics.total_bins}`, `Avg Fill Level: ${analytics.avg_bin_fill}%`],
        [`Waste Collected: ${analytics.total_waste_collected_kg}kg`, `CO2 Reduction: ${analytics.co2_reduction_kg}kg`],
      ]

      metrics.forEach((row, i) => {
        doc.text(row[0], 22, y + 20 + i * 8)
        doc.text(row[1], pageWidth / 2 + 5, y + 20 + i * 8)
      })
      y += 75
    }

    // Route Sequence
    const route = optimizationData?.route
    if (route && route.length > 0) {
      doc.setFillColor(18, 18, 26)
      doc.roundedRect(15, y, pageWidth - 30, Math.min(route.length * 6 + 20, 120), 3, 3, 'F')
      doc.setTextColor(255, 107, 53)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Optimized Route Sequence', 22, y + 10)

      doc.setTextColor(200, 200, 200)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')

      const maxSteps = Math.min(route.length, 15)
      for (let i = 0; i < maxSteps; i++) {
        const step = route[i]
        doc.text(`${i + 1}. ${step.from} -> ${step.to}  (${step.distance}m)`, 22, y + 20 + i * 6)
      }
      if (route.length > 15) {
        doc.text(`... and ${route.length - 15} more steps`, 22, y + 20 + 15 * 6)
      }
      y += Math.min(route.length * 6 + 20, 120) + 10
    }

    // Bin Statistics
    if (analytics) {
      doc.setFillColor(18, 18, 26)
      doc.roundedRect(15, y, pageWidth - 30, 35, 3, 3, 'F')
      doc.setTextColor(124, 58, 237)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Bin Statistics', 22, y + 10)

      doc.setTextColor(200, 200, 200)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Critical: ${analytics.critical_bins}  |  Full: ${analytics.full_bins}  |  Medium: ${analytics.medium_bins}  |  Empty: ${analytics.empty_bins}`, 22, y + 22)
      y += 45
    }

    // Comparison
    const comparison = optimizationData?.comparison
    if (comparison) {
      doc.setFillColor(18, 18, 26)
      doc.roundedRect(15, y, pageWidth - 30, 40, 3, 3, 'F')
      doc.setTextColor(255, 0, 110)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Traditional vs Optimized', 22, y + 10)

      doc.setTextColor(200, 200, 200)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Traditional: ${comparison.traditional.distance_meters}m | ${comparison.traditional.time_minutes}min | ${comparison.traditional.fuel_liters}L`, 22, y + 22)
      doc.setTextColor(0, 255, 136)
      doc.text(`Optimized: ${comparison.optimized.distance_meters}m | ${comparison.optimized.time_minutes}min | ${comparison.optimized.fuel_liters}L`, 22, y + 30)
      y += 50
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.setFillColor(10, 10, 15)
    doc.rect(0, footerY - 5, pageWidth, 20, 'F')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.text('EcoRoute AI - Smart Waste Collection & Route Optimization Platform', 15, footerY + 5)
    doc.text('Powered by Euler Path Graph Theory & NetworkX', pageWidth - 15, footerY + 5, { align: 'right' })

    doc.save(`EcoRoute_Report_${localityName.replace(/\s+/g, '_')}.pdf`)
    onExport?.()
  }

  return (
    <button onClick={handleExport} className="btn-secondary text-xs py-1.5 px-3" title="Export PDF Report">
      <FileText className="w-3 h-3" /> Export Report
    </button>
  )
}
