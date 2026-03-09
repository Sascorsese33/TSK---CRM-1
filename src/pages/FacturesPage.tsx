import { jsPDF } from 'jspdf'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export const FacturesPage = () => {
  const { currentUser } = useApp()
  const [form, setForm] = useState({
    prospectName: '',
    vehicle: '',
    price: '',
    date: new Date().toISOString().slice(0, 10),
    prospectorName: currentUser?.name ?? '',
  })
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  const generatePdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Facture TransakPro', 14, 20)
    doc.setFontSize(12)
    doc.text(`Prospect: ${form.prospectName}`, 14, 35)
    doc.text(`Véhicule: ${form.vehicle}`, 14, 45)
    doc.text(`Prix: ${form.price} €`, 14, 55)
    doc.text(`Date: ${form.date}`, 14, 65)
    doc.text(`Prospecteur: ${form.prospectorName}`, 14, 75)
    doc.text('Merci pour votre confiance.', 14, 95)

    const blob = doc.output('blob')
    setPdfBlob(blob)
  }

  const downloadPdf = () => {
    if (!pdfBlob) {
      return
    }
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `facture-${form.prospectName || 'transakpro'}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const sharePdf = async () => {
    if (!pdfBlob) {
      return
    }
    const file = new File([pdfBlob], `facture-${form.prospectName || 'transakpro'}.pdf`, {
      type: 'application/pdf',
    })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Facture TransakPro' })
      return
    }
    downloadPdf()
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-4">
        <h3 className="font-semibold">📄 FACTURES</h3>
        <p className="mt-1 text-sm text-zinc-400">Générateur de facture simple</p>
        <div className="mt-4 space-y-3">
          <FormInput
            label="Nom du prospect"
            value={form.prospectName}
            onChange={(value) => setForm((prev) => ({ ...prev, prospectName: value }))}
          />
          <FormInput
            label="Véhicule"
            value={form.vehicle}
            onChange={(value) => setForm((prev) => ({ ...prev, vehicle: value }))}
          />
          <FormInput
            label="Prix"
            value={form.price}
            onChange={(value) => setForm((prev) => ({ ...prev, price: value }))}
          />
          <FormInput
            label="Date"
            type="date"
            value={form.date}
            onChange={(value) => setForm((prev) => ({ ...prev, date: value }))}
          />
          <FormInput
            label="Nom du prospecteur"
            value={form.prospectorName}
            onChange={(value) => setForm((prev) => ({ ...prev, prospectorName: value }))}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button type="button" onClick={generatePdf} className="min-h-11 rounded-xl bg-[#FF6B35] text-sm font-medium">
            Générer PDF
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            className="min-h-11 rounded-xl border border-zinc-700 text-sm"
          >
            Télécharger
          </button>
          <button
            type="button"
            onClick={sharePdf}
            className="min-h-11 rounded-xl border border-zinc-700 text-sm"
          >
            Partager
          </button>
        </div>
      </section>
    </div>
  )
}

const FormInput = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) => (
  <label className="block space-y-1 text-sm">
    <span className="text-zinc-300">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-11 w-full rounded-xl border border-zinc-700 bg-[#0F0F0F] px-3"
    />
  </label>
)
