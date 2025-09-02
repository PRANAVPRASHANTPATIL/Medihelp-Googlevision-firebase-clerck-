"use client"

import * as React from "react"
import { AddMedicationDialog, type Medication } from "./add-medication-dialog"

export default function ManualMedsPanel() {
  const [meds, setMeds] = React.useState<Medication[]>([])

  const handleAdd = (med: Medication) => {
    setMeds((prev) => [...prev, med])
  }

  return (
    <section className="mt-6 grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manual Medications</h3>
        <AddMedicationDialog onAdd={handleAdd} />
      </div>

      {/* Today's Medications */}
      <div className="rounded-lg border p-4">
        <h4 className="font-medium mb-2">Today's Medications</h4>
        {meds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No medications yet. Add one to get started.</p>
        ) : (
          <ul className="text-sm space-y-2">
            {meds.map((m, i) => (
              <li key={i} className="border-b last:border-0 pb-2">
                <span className="font-medium">{m.name}</span> — {m.dosage} at {m.time} ({readableFrequency(m.frequency)}
                ){m.instructions ? <span className="block text-muted-foreground">Notes: {m.instructions}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Schedule */}
      <div className="rounded-lg border p-4 overflow-x-auto">
        <h4 className="font-medium mb-2">Schedule</h4>
        {meds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scheduled medications yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="text-left py-2 pr-3">Name</th>
                <th className="text-left py-2 pr-3">Dosage</th>
                <th className="text-left py-2 pr-3">Frequency</th>
                <th className="text-left py-2 pr-3">Time</th>
                <th className="text-left py-2 pr-3">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {meds.map((m, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 pr-3">{m.name}</td>
                  <td className="py-2 pr-3">{m.dosage}</td>
                  <td className="py-2 pr-3">{readableFrequency(m.frequency)}</td>
                  <td className="py-2 pr-3">{m.time}</td>
                  <td className="py-2 pr-3">{m.instructions || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Today's Progress placeholder */}
      <div className="rounded-lg border p-4">
        <h4 className="font-medium mb-2">Today's Progress</h4>
        <p className="text-sm text-muted-foreground">
          Progress will appear after you add medications and mark them as taken.
        </p>
      </div>
    </section>
  )
}

function readableFrequency(value: string) {
  switch (value) {
    case "once-daily":
      return "Once daily"
    case "twice-daily":
      return "Twice daily"
    case "three-times-daily":
      return "Three times daily"
    case "every-other-day":
      return "Every other day"
    case "as-needed":
      return "As needed"
    default:
      return value
  }
}
