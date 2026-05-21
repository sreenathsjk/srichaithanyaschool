// === SCRIPT ===


// === SCRIPT ===


// === SCRIPT ===

  document.getElementById("currentDate").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric"
  });

  // Class checkboxes in teacher modal
  const CLASSES = ["Nursery","LKG","UKG","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];
  const ccont = document.getElementById("tClassCheckboxes");
  if (ccont) {
    CLASSES.forEach(cls => {
      const lbl = document.createElement("label");
      lbl.style.cssText = "display:flex;align-items:center;gap:5px;font-size:0.8rem;font-weight:600;cursor:pointer;padding:4px 10px;background:var(--card-bg);border-radius:7px;border:1.5px solid var(--border);transition:all 0.2s;";
      lbl.innerHTML = `<input type="checkbox" name="tClass" value="${cls}" style="width:auto;padding:0;border:none;"> ${cls}`;
      lbl.querySelector("input").addEventListener("change", function() {
        lbl.style.borderColor = this.checked ? "var(--gold)" : "var(--border)";
        lbl.style.background  = this.checked ? "var(--gold-light)" : "var(--card-bg)";
      });
      ccont.appendChild(lbl);
    });
  }

  document.querySelectorAll(".modal-overlay").forEach(o => {
    o.addEventListener("click", e => { if (e.target === o) o.classList.remove("open"); });
  });


// === SCRIPT ===

  import { initApp } from "./app.js";
  initApp();


// === SCRIPT ===

  window.addEventListener("studentsUpdated", (e) => {
    const students = e.detail || [];
    const badge = document.getElementById("sidebarStudentCount");
    if (badge) badge.textContent = students.length;
    const cnt = document.getElementById("studentCountBadge");
    if (cnt) cnt.textContent = students.length;
    const tbody = document.getElementById("overviewStudentsBody");
    if (!tbody) return;
    const recent = students.slice(0,5);
    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><span class="empty-emoji">🎓</span><div class="empty-title">No students yet</div></div></td></tr>`;
    } else {
      tbody.innerHTML = recent.map(s => `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td><span class="badge badge-${s.class.toLowerCase()}">${s.class}</span></td>
          <td>${s.parent}</td>
          <td><a href="tel:${s.phone}" style="color:var(--blue);font-weight:700;text-decoration:none;">${s.phone}</a></td>
        </tr>`).join("");
    }
  });

  window.addEventListener("teachersUpdated", (e) => {
    const teachers = e.detail || [];
    const badge = document.getElementById("sidebarTeacherCount");
    if (badge) badge.textContent = teachers.length;
    const cnt = document.getElementById("teacherCountBadge");
    if (cnt) cnt.textContent = teachers.length;
  });

  window.addEventListener("admissionsUpdated", (e) => {
    const admissions = e.detail || [];
    const badge = document.getElementById("sidebarAdmissionCount");
    if (badge) badge.textContent = admissions.length;
    const cnt = document.getElementById("admissionCountBadge");
    if (cnt) cnt.textContent = admissions.length;
  });

