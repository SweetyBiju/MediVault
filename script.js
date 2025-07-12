const alternativeDoctors = [
  {
    name: "Dr. Ananya Mitra",
    specialization: "Cardiology",
    location: "Apollo Gleneagles",
    phone: "+91-9876100001",
    rating: 4.5
  },
  {
    name: "Dr. Rakesh Nandi",
    specialization: "Endocrinology",
    location: "Fortis Salt Lake",
    phone: "+91-9876100002",
    rating: 4.4
  },
  {
    name: "Dr. Priya Das",
    specialization: "Neurology",
    location: "Belle Vue Clinic",
    phone: "+91-9876100003",
    rating: 4.7
  },
  {
    name: "Dr. Shilpi Roy",
    specialization: "Orthopedics",
    location: "AMRI Dhakuria",
    phone: "+91-9876100004",
    rating: 4.3
  }
];

function showDoctorSection(section) {
  const history = document.getElementById('doctorHistorySection');
  const alt = document.getElementById('doctorAlternativeSection');
  const btns = document.querySelectorAll('.toggle-btn');

  btns.forEach(btn => btn.classList.remove('active'));

  if (section === 'history') {
    history.style.display = 'block';
    alt.style.display = 'none';
    btns[0].classList.add('active');
  } else {
    history.style.display = 'none';
    alt.style.display = 'block';
    btns[1].classList.add('active');
  }
}

function showAlternativeDoctors() {
  const selected = document.getElementById('specializationSelect').value;
  const container = document.getElementById('alternativeList');
  container.innerHTML = '';

  const results = alternativeDoctors.filter(doc => doc.specialization === selected);

  if (results.length === 0) {
    container.innerHTML = "<p>No alternative doctors found.</p>";
    return;
  }

  results.forEach(doc => {
    const div = document.createElement('div');
    div.className = 'doctor-card';
    div.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center;">
  <h4>${doc.name}</h4>
  <button class="save-btn" onclick="toggleSaveDoctor(this, '${doc.name}')">☆</button>
</div>
<p>${doc.specialization}</p>
<p>📍 ${doc.location}</p>
<p>📞 ${doc.phone}</p>
<p>⭐ Rating: ${doc.rating}</p>
<button class="sync-btn" onclick="alert('Messaging ${doc.name}')">💬 Text</button>
<button class="sync-btn" onclick="alert('Calling ${doc.name}')">📞 Call</button>
<button class="sync-btn" onclick="alert('Appointment request sent to ${doc.name}')">📅 Schedule</button>
<br>

<!-- Commented modal-based calendar for future -->
<!--
      <button class="sync-btn" onclick="openCalendarModal('${doc.name}')">📅 Schedule via Calendar</button>
      -->

<div class="feedback-box">
  <textarea placeholder="Leave feedback for ${doc.name}..."></textarea>
  <button onclick="alert('Feedback submitted')">Submit Feedback</button>
</div>
`;
    if (savedDoctors.has(doc.name)) {
      div.querySelector('.save-btn').textContent = '⭐';
    }
    container.appendChild(div);
  });
}

// saved doctors
const savedDoctors = new Set(JSON.parse(localStorage.getItem('savedDoctors') || '[]'));

function toggleSaveDoctor(btn, name) {
  if (savedDoctors.has(name)) {
    savedDoctors.delete(name);
    btn.textContent = '☆'; // empty star
  } else {
    savedDoctors.add(name);
    btn.textContent = '⭐'; // filled star
  }
  localStorage.setItem('savedDoctors', JSON.stringify([...savedDoctors]));
}

// statistics box
const uploadedPrescriptions = 0;
const upcomingAppointments = 2;
const aiGeneratedInsights = 4;
const activeAlerts = 1;


// Animate counter
function animateCount(id, target, speed = 20) {
  let count = 0;
  const el = document.getElementById(id);
  const step = Math.ceil(target / 50);
  const interval = setInterval(() => {
    count += step;
    if (count >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = count;
    }
  }, speed);
}

function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');
  if (dropdown.classList.contains('show')) {
    setTimeout(() => {
      document.addEventListener('click', outsideClick);
    }, 10);
  }
}

animateCount("totalRecords", uploadedPrescriptions);
animateCount("appointmentsCount", upcomingAppointments);
animateCount("aiInsights", aiGeneratedInsights);
animateCount("alertCount", activeAlerts);
let lastScrollY = window.scrollY;
const greeting = document.querySelector('.greetings');
let greetingHidden = false;
// update counter
function updateStatCounts() {
  // Total Records
  const totalRecords = document.querySelectorAll('#uploadList .history-entry').length;
  document.getElementById("totalRecords").textContent = totalRecords;

  // Appointments
  const appointmentCount = document.querySelectorAll('.appointment-entry').length;
  document.getElementById("appointmentsCount").textContent = appointmentCount;

  // AI Insights
  const insights = document.querySelectorAll('.insight-item').length;
  document.getElementById("aiInsights").textContent = insights;

  // Active Alerts
  const alerts = document.querySelectorAll('.alert-badge').length;
  document.getElementById("alertCount").textContent = alerts;
}

// Run on load and after each update
window.onload = updateStatCounts;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (!greetingHidden && currentScrollY > lastScrollY) {
    greeting.classList.add('hide');
    greetingHidden = true;
  }
  lastScrollY = currentScrollY;
});


function toggleSettingsMenu() {
  const menu = document.getElementById('settingsMenu');
  const isVisible = menu.style.display === 'block';
  menu.style.display = isVisible ? 'none' : 'block';

  // Close when clicked outside
  if (!isVisible) {
    setTimeout(() => {
      document.addEventListener('click', function outsideClick(e) {
        if (!menu.contains(e.target) && !e.target.closest('.settings-dropdown')) {
          menu.style.display = 'none';
          document.removeEventListener('click', outsideClick);
        }
      });
    }, 10);
  }
}

new Chart(document.getElementById('bpChart'), {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{ label: 'BP (mmHg)', data: [107, 110, 120, 125, 130], borderColor: '#ff6384', tension: 0.4 }]
  },
  options: { responsive: true, plugins: { legend: { display: true } } }
});

new Chart(document.getElementById('sugarChart'), {
  type: 'line',
  data: {
    labels: ['25/03', '10/4', '25/04', '12/05', '25/05', '10/06'],
    datasets: [{ label: 'Sugar (mg/dL)', data: [110, 105, 107, 100, 99, 101], borderColor: '#36a2eb', tension: 0.4 }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
        ticks: {
          stepSize: 4
        }
      }
    }
  }
});


const bmiValue = 24.5;
const bmiChart = new Chart(document.getElementById('bmiGauge'), {
  type: 'doughnut',
  data: {
    labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
    datasets: [{
      data: [18.5, 24.9, 29.9, 33],
      backgroundColor: ['#2196f3', '#4caf50', '#ffc107', '#ff5722'],
      borderWidth: 0
    }]
  },
  options: {
    rotation: -90,
    circumference: 180,
    cutout: '97%',
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    animation: true
  },
  plugins: [{
    id: 'needle',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = chartArea.bottom;

      const maxBMI = 40;
      const angleDeg = (bmiValue / maxBMI) * 180 - 90;
      const angleRad = angleDeg * Math.PI / 180;
      const needleLength = chart.width / 3.2;

      const x = centerX + needleLength * Math.cos(angleRad);
      const y = centerY + needleLength * Math.sin(angleRad);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(y, x - 50);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.restore();
    }
  }]
});
// const maxBMI=40;
// const percentage = (bmiValue / maxBMI) * 100;

// // Calculate the angle
// const angle = (percentage / 100) * 360;

// // Rotate the needle
// document.getElementById('needle').style.transform = `rotate(${angle}deg)`;

//notification and alert
const appointments = [
  { date: '2025-07-14T10:30:00', label: 'Appointment with Dr. Ghosh' },
  { date: '2025-08-02T14:00:00', label: 'Appointment with Dr. Ghosh' }
];

function notifyUser(message) {
  if (Notification.permission === 'granted') {
    new Notification('MediVault Reminder', { body: message });
  }
}

function scheduleReminders() {
  appointments.forEach(app => {
    const now = new Date();
    const appTime = new Date(app.date);
    const diff = appTime - now;
    if (diff > 0) {
      setTimeout(() => {
        alert(app.label);
        notifyUser(app.label);
      }, diff);
    }
  });
}

if ("Notification" in window) {
  if (Notification.permission === "granted") {
    scheduleReminders();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") scheduleReminders();
    });
  }
}
const uploadBox = document.getElementById('uploadBox');
const uploadList = document.getElementById('uploadList');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
//appoinment
function submitAppointment() {
  const name = document.getElementById('patientName').value;
  const email = document.getElementById('patientEmail').value;
  const date = document.getElementById('appointmentDate').value;
  const reason = document.getElementById('reason').value;

  if (name && email && date && reason) {
    document.getElementById('appointmentStatus').textContent =
      `✅ Appointment request sent for ${new Date(date).toLocaleString()}`;
    document.getElementById('patientName').value = '';
    document.getElementById('patientEmail').value = '';
    document.getElementById('appointmentDate').value = '';
    document.getElementById('reason').value = '';
  }
}
function syncCalendar() {
  alert("📅 This would sync your appointments to your Google Calendar (future feature)");
}

//add doctor entry
function addDoctorCard(name, degree, clinic, phone, tag) {
  const now = new Date().toLocaleString();
  const list = document.getElementById('doctorList');
  const div = document.createElement('div');
  div.className = 'doctor-entry';
  div.innerHTML = `
    <div class="docdetail">
      <div class="doc">
        <strong>${name}</strong> <span class="status-badge">${tag}</span><br>
        <small>${degree}</small><br>
        <small>📍 ${clinic}</small><br>
        <small>📞 ${phone}</small>
      </div>
      <div class="rating-row">
        <div class="star-rating" data-name="${name}">
  ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-star="${i}" onclick="rateDoctor('${name}', ${i}, this)">★</span>`).join('')}
  <span class="score-text" id="score-${name.replace(/\s+/g, '')}">(0.0)</span>
</div>

      </div>
    </div>
    <div class="entry-footer">
      <small>🕒 ${now}</small>
      <div class="contact-actions">
        <button onclick="alert('Message sent to ${name}')"><i class="fa fa-comment"></i></button>
        <button onclick="alert('Calling ${name}')"><i class="fa fa-phone"></i></button>
      </div>
    </div>
  `;
  list.appendChild(div);
}

// Example Usage:
addDoctorCard("Dr. Sunita Mukherjee", "MBBS, DNB - Cardiology", "Fortis Heart Centre, EM Bypass", "+91-9876123456", "Previously Checked");
addDoctorCard("Dr. Rakesh Banerjee", "MBBS, MD - Endocrinology", "Ruby Hospital Campus, Kolkata", "+91-9876987654", "Consulted");
addDoctorCard("Dr. Akash Ahuja", "MBBS General Medicine", "AMRI Hospital,Dhakuria", "+91-987456123");

// doc stars
const doctorRatings = {};

function rateDoctor(name, stars, el) {
  const starsContainer = el.parentElement;
  const allStars = starsContainer.querySelectorAll('.star');

  // Update rating locally
  doctorRatings[name] = stars;

  // Fill stars visually
  allStars.forEach((s, i) => {
    s.classList.toggle('filled', i < stars);
  });

  // Update score text
  const scoreEl = document.getElementById(`score-${name.replace(/\s+/g, '')}`);
  if (scoreEl) scoreEl.textContent = `(${stars.toFixed(1)})`;

  localStorage.setItem('doctorRatings', JSON.stringify(doctorRatings));
  const savedRatings = JSON.parse(localStorage.getItem('doctorRatings') || '{}');
  const savedStars = savedRatings[name] || 0;

}

function addFileItem(name) {
  const otp = generateOTP();
  const now = new Date().toLocaleString();
  const div = document.createElement('div');
  div.className = 'history-entry';
  const placeholder = document.getElementById('uploadPlaceholder');
  if (placeholder) placeholder.style.display = 'none';

  const uploadList = document.getElementById('uploadList');
  div.innerHTML = `
     <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="file" class="entry-preview" />
    <div class="entry-details">
    <div class="entry-header">
      <strong>${name}</strong>
      <div class="entry-options-wrapper">
        <div class="entry-menu" onclick="toggleMenu(this)">⋮</div>
        <div class="entry-dropdown">
          <button onclick="showDetails('${name}', '${now}', 'Dr. Aritra Ghosh')">Details</button>
          <button onclick="deleteEntry(this)"><i class="fa fa-times" style="color:red"></i> Delete</button>
          <button onclick="shareToWhatsApp('${name}', '${otp}')">Share to WhatsApp</button>
        </div>
      </div>
    </div>
    <div class="entry-footer">
      <small>${now}</small><br/>
      <button class="copy-btn" onclick="navigator.clipboard.writeText('${otp}').then(()=>alert('OTP ${otp} copied!'))">Share to doctor with OTP</button>
    </div>
  `;
  uploadList.appendChild(div);
  // 🔄 Update Access Control List
  const accessList = document.getElementById('accessList');
  if (accessList) {
    const li = document.createElement('li');
    li.innerHTML = `<span><strong>Dr. Aritra Ghosh</strong> — <em>${name}</em></span>
      <button onclick="revokeAccess(this)" style="margin-left:10px;">Revoke</button>`;
    accessList.appendChild(li);
  }

  // 🔄 Update Uploaded Prescriptions List
  const uploadedFilesList = document.getElementById('uploadedFilesList');
  if (uploadedFilesList) {
    const fileEntry = document.createElement('li');
    fileEntry.textContent = name;
    uploadedFilesList.appendChild(fileEntry);
  }
  updateStatCounts();
}
function revokeAccess(button) {
  const li = button.parentElement;
  const file = li.textContent.replace("Revoke", "").trim();
  if (confirm(`Revoke access to ${file}?`)) {
    li.remove();
    alert(`Access revoked for ${file}`);
  }
}

function updateStatCounts() {
  const totalRecords = document.querySelectorAll('#uploadList .history-entry').length;
  document.getElementById("totalRecords").textContent = totalRecords;
}
// Show only the clicked settings section
document.querySelectorAll('.settings-menu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.getAttribute('href').replace('#', '');
    const targetSection = document.getElementById(targetId);

    // Hide all settings-related sections
    document.querySelectorAll('#accessControl, #uploaded, #documents').forEach(section => {
      section.style.display = 'none';
    });

    if (targetSection) {
      targetSection.style.display = 'block';
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function showDetails(fileName, time, doctor) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.onclick = () => { backdrop.remove(); modal.remove(); };

  const modal = document.createElement('div');
  modal.className = 'modal-details';
  modal.innerHTML = `
    <h3>📄 ${fileName}</h3>
    <p><strong>Uploaded:</strong> ${time}</p>
    <p><strong>Prescribed by:</strong> ${doctor}</p>
    <button onclick="document.querySelector('.modal-backdrop')?.remove(); this.parentElement.remove();" style="margin-top: 1rem; padding: 6px 12px; background:#4caf50; border:none; border-radius:5px; color:white; cursor:pointer;">Close</button>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
}

function deleteEntry(btn) {
  const card = btn.closest('.history-entry');
  const tempId = `delete-${Date.now()}`;
  card.setAttribute('id', tempId);

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.onclick = () => { backdrop.remove(); modal.remove(); };

  const modal = document.createElement('div');
  modal.className = 'modal-details';
  modal.innerHTML = `
    <h3>⚠️ Confirm Deletion</h3>
    <p>This file will be deleted. Are you sure?</p>
    <div style="margin-top: 1rem;">
      <button onclick="document.querySelector('.modal-backdrop')?.remove(); this.closest('.modal-details').remove();" style="margin-right: 10px; padding:6px 12px; border:none; border-radius:5px; background:#888; color:white;">No</button>
      <button onclick="confirmDelete('${tempId}')" style="padding:6px 12px; background:#f44336; border:none; border-radius:5px; color:white;">Yes</button>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
}

function confirmDelete(cardId) {
  document.getElementById(cardId)?.remove();
  document.querySelector('.modal-details')?.remove();
  document.querySelector('.modal-backdrop')?.remove();
}

//more actions and doctor timestamp 
function toggleMoreActions(btn) {
  const wrapper = btn.closest('.more-actions-wrapper');
  const menu = wrapper.querySelector('.more-actions-menu');
  document.querySelectorAll('.more-actions-menu').forEach(m => {
    if (m !== menu) m.style.display = 'none';
  });
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  setTimeout(() => {
    document.addEventListener('click', function outsideClick(e) {
      if (!wrapper.contains(e.target)) {
        menu.style.display = 'none';
        document.removeEventListener('click', outsideClick);
      }
    });
  }, 10);
}

// Append timestamp and doctor name to remarks section
const doctorRemark = document.querySelector('textarea[readonly]');
if (doctorRemark) {
  const timestamp = new Date().toLocaleString();
  doctorRemark.value += "🕒 " + timestamp + " — Dr.Aritra Ghosh";
}

uploadBox.onclick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    const file = e.target.files[0];
    if (file) addFileItem(file.name);
  };
  input.click();
};
function toggleMenu(menuIcon) {
  // Close any open dropdowns first
  document.querySelectorAll('.entry-dropdown').forEach(drop => drop.style.display = 'none');
  const dropdown = menuIcon.nextElementSibling;
  dropdown.style.display = 'block';

  // Stop outside click from closing immediately
  setTimeout(() => {
    document.addEventListener('click', outsideClose);
  }, 10);
}
function shareToWhatsApp(fileName, otp) {
  alert(`Pretend we're sharing "${fileName}" with OTP: ${otp} to WhatsApp 🚀`);
  // In future: open actual wa.me link
}
// Close dropdown if click is outside
function outsideClose(e) {
  if (!e.target.closest('.entry-options-wrapper')) {
    document.querySelectorAll('.entry-dropdown').forEach(drop => drop.style.display = 'none');
    document.removeEventListener('click', outsideClose);
  }
}
uploadBox.ondragover = e => { e.preventDefault(); uploadBox.style.borderColor = '#fff'; };
uploadBox.ondrop = e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) addFileItem(file.name);
};
// const toggleBtn = document.getElementById('darkToggle');
// if (toggleBtn) {
//   toggleBtn.addEventListener('click', () => {
//     document.body.classList.toggle('light-mode');
//     toggleBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
//   });
// }

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});
function toggleChatbot() {
  const box = document.getElementById('chatbotBox');
  const emergency = document.getElementById('emergencycard'); // Make sure this ID is added to the emergency QR div

  const isOpen = box.style.display === 'block';

  box.style.display = isOpen ? 'none' : 'block';
  emergency.style.display = isOpen ? 'block' : 'none';
}


// health insight
document.addEventListener("DOMContentLoaded", () => {
  const progress = document.getElementById("scoreArc");
  const text = document.querySelector(".percentage");
  if (progress && text) {
    const target = 93;
    let value = 0;
    const interval = setInterval(() => {
      if (value >= target) {
        clearInterval(interval);
      } else {
        value++;
        progress.setAttribute("stroke-dasharray", `${value}, 100`);
        text.textContent = `${value}`;
        if (value >= 70) {
          progress.style.stroke = "#4caf50";
        } else if (value >= 40) {
          progress.style.stroke = "#ffc107";
        } else {
          progress.style.stroke = "#f44336";
        }
      }
    }, 15);
  }
});

// qr code
function toggleHealthCardModal() {
  const modal = document.getElementById('healthCardModal');
  const backdrop = document.getElementById('healthCardBackdrop');
  const isVisible = modal.style.display === 'block';
  modal.style.display = isVisible ? 'none' : 'block';
  backdrop.style.display = isVisible ? 'none' : 'block';
}

function closeHealthCardModal() {
  document.getElementById('healthCardModal').style.display = 'none';
  document.getElementById('healthCardBackdrop').style.display = 'none';
  document.getElementById('emergencyCard').style.display = 'flex';
}

// new doc


