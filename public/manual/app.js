// Simple localStorage-backed meds manager (no TypeScript, no frameworks)
const STORAGE_KEY = "medihelp_medications"

const addBtn = document.getElementById("addManuallyBtn")
const resetBtn = document.getElementById("resetBtn")
const dialog = document.getElementById("addMedicationDialog")
const cancelBtn = document.getElementById("cancelDialog")
const form = document.getElementById("medForm")

const todayList = document.getElementById("todayList")
const scheduleBody = document.getElementById("scheduleBody")
const scheduleEmpty = document.getElementById("scheduleEmpty")

const progressBar = document.getElementById("progressBar")
const progressLabel = document.getElementById("progressLabel")

function loadMeds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveMeds(meds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meds))
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function computeProgress(meds) {
  if (!meds.length) return 0
  const taken = meds.filter((m) => m.taken).length
  return Math.round((taken / meds.length) * 100)
}

function renderMeds() {
  const meds = loadMeds()

  // Today's list
  todayList.innerHTML = ""
  if (!meds.length) {
    todayList.classList.add("empty-state")
    todayList.innerHTML = "<li>No medications yet. Add one to get started.</li>"
  } else {
    todayList.classList.remove("empty-state")
    meds.forEach((m) => {
      const li = document.createElement("li")
      li.textContent = `${m.name} — ${m.dosage} at ${m.time} (${m.frequency})`
      todayList.appendChild(li)
    })
  }

  // Schedule
  scheduleBody.innerHTML = ""
  if (!meds.length) {
    scheduleEmpty.style.display = "block"
  } else {
    scheduleEmpty.style.display = "none"
    meds.forEach((m, i) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>
          <input type="checkbox" class="checkbox" data-index="${i}" ${m.taken ? "checked" : ""} aria-label="Mark ${escapeHtml(m.name)} as taken" />
        </td>
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.dosage)}</td>
        <td>${escapeHtml(m.frequency)}</td>
        <td>${escapeHtml(m.time)}</td>
        <td>${escapeHtml(m.instructions || "")}</td>
      `
      scheduleBody.appendChild(tr)
    })
  }

  // Progress
  const pct = computeProgress(meds)
  progressBar.style.width = `${pct}%`
  progressLabel.textContent = `${pct}% complete`

  // Bind checkbox change handlers
  scheduleBody.querySelectorAll(".checkbox").forEach((cb) => {
    cb.addEventListener("change", () => {
      const idx = Number(cb.getAttribute("data-index"))
      const current = loadMeds()
      if (idx >= 0 && idx < current.length) {
        current[idx].taken = !!cb.checked
        saveMeds(current)
        renderMeds()
      }
    })
  })
}

addBtn.addEventListener("click", () => dialog.showModal())
resetBtn.addEventListener("click", () => {
  if (confirm("Clear all medications stored in this browser?")) {
    saveMeds([])
    renderMeds()
  }
})
cancelBtn.addEventListener("click", () => dialog.close())

form.addEventListener("submit", (e) => {
  e.preventDefault()
  const fd = new FormData(form)
  const payload = {
    name: String(fd.get("name") || "").trim(),
    dosage: String(fd.get("dosage") || "").trim(),
    frequency: String(fd.get("frequency") || "").trim(),
    time: String(fd.get("time") || "").trim(),
    instructions: String(fd.get("instructions") || "").trim(),
    taken: false,
  }

  if (!payload.name || !payload.dosage || !payload.frequency || !payload.time) {
    alert("Please fill all required fields.")
    return
  }

  const meds = loadMeds()
  meds.push(payload)
  saveMeds(meds)

  form.reset()
  dialog.close()
  renderMeds()
})

document.addEventListener("DOMContentLoaded", renderMeds)
