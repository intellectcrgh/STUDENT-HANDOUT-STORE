// =====================
// AUTH SYSTEM
// =====================

// REGISTER
function register() {
  let email = document.getElementById("regEmail").value;
  let pass = document.getElementById("regPass").value;

  if (!email || !pass) {
    alert("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.push({ email, pass });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered successfully!");
}

// LOGIN
// USER LOGIN
function login() {
  let emailEl = document.getElementById("email");
  let passEl = document.getElementById("pass");

  if (!emailEl || !passEl) {
    alert("Input fields not found in HTML!");
    return;
  }

  let email = emailEl.value;
  let pass = passEl.value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(u => u.email === email && u.pass === pass);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "index.html";
  } else {
    alert("Invalid login");
  }
}

// SHOW APP
function showApp() {
  let authBox = document.getElementById("authBox");
  let app = document.getElementById("app");

  if (authBox) authBox.style.display = "none";
  if (app) app.style.display = "block";
}

// AUTO LOGIN
if (localStorage.getItem("currentUser")) {
  showApp();
}

// LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}


// =====================
// COURSES
// =====================

let selectedCourses = [];
let totalAmount = 0;

let courses = JSON.parse(localStorage.getItem("courses")) || [
  { name: "GST 111", price: 1000 },
  { name: "POL 201", price: 1500 }
];

// DISPLAY COURSES
function displayCourses() {
  let container = document.getElementById("courseList");
  if (!container) return;

  container.innerHTML = "";

  courses.forEach((c) => {
    let item = document.createElement("div");

    item.innerHTML = `
      <label>
        <input type="checkbox" value="${c.name}" data-price="${c.price}">
        ${c.name} (₦${c.price})
      </label>
    `;

    container.appendChild(item);
  });
}

displayCourses();

// CALCULATE TOTAL
function calculateTotal() {
  let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

  selectedCourses = [];
  totalAmount = 0;

  checkboxes.forEach(cb => {
    let course = cb.value;
    let price = Number(cb.dataset.price);

    selectedCourses.push({ course, price });
    totalAmount += price;
  });

  let total = document.getElementById("total");
  if (total) total.innerText = "Total: ₦" + totalAmount;
}


// =====================
// TRANSFER PAYMENT (USER SIDE)
// =====================

function confirmTransfer() {
  let name = document.getElementById("payerName").value;

  if (!name) {
    alert("Enter your name");
    return;
  }

  if (selectedCourses.length === 0) {
    alert("Select courses first");
    return;
  }

  let requests = JSON.parse(localStorage.getItem("paymentRequests")) || [];

  requests.push({
    id: Date.now(),
    name: name,
    courses: selectedCourses.map(c => c.course).join(", "),
    status: "pending"
  });

  localStorage.setItem("paymentRequests", JSON.stringify(requests));

  alert("Submitted! Wait for admin approval.");
}


// =====================
// ADMIN DASHBOARD
// =====================
function loadAdmin() {
  let table = document.getElementById("adminTable");
  if (!table) return;
  let requests = JSON.parse(localStorage.getItem("paymentRequests")) || [];

  table.innerHTML = "";

  requests.forEach((r, index) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${r.name}</td>
      <td>${r.courses}</td>
      <td>${r.status}</td>
      <td>
        ${r.status === "pending" ? `<button onclick="approve(${index})">Approve</button>` : "✔"}
      </td>
    `;

    table.appendChild(row);
  });
}
document.getElementById("adminBtn").addEventListener("click", () => {
  window.location.href = "admin.html";
});
// APPROVE PAYMENT
function approve(index) {
  let requests = JSON.parse(localStorage.getItem("paymentRequests")) || [];
  let approved = JSON.parse(localStorage.getItem("approvedUsers")) || [];

  requests[index].status = "approved";

  approved.push(requests[index]);

  localStorage.setItem("paymentRequests", JSON.stringify(requests));
  localStorage.setItem("approvedUsers", JSON.stringify(approved));

  alert("Payment Approved!");

  loadAdmin();
}

loadAdmin();


// =====================
// USER PAYMENT STATUS
// =====================

function displayPayments() {
  let list = document.getElementById("paymentList");
  if (!list) return;

  let payments = JSON.parse(localStorage.getItem("paymentRequests")) || [];

  list.innerHTML = "";

  payments.forEach((p) => {
    let item = document.createElement("li");

    let color = p.status === "approved" ? "green" : "orange";

    item.innerHTML = `
      <b>${p.name}</b> - ${p.courses}
      <br>Status: <span style="color:${color}">${p.status}</span>
    `;

    list.appendChild(item);
  });
}

displayPayments();


// =====================
// PDF RECEIPT
// =====================

function generatePDF() {
  if (selectedCourses.length === 0) {
    alert("Select courses first");
    return;
  }

  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let name = document.getElementById("payerName").value || "Student";

  doc.text("Handout Receipt", 20, 20);
  doc.text("Name: " + name, 20, 30);

  let y = 50;

  selectedCourses.forEach((c, i) => {
    doc.text(`${i+1}. ${c.course} - ₦${c.price}`, 20, y);
    y += 10;
  });

  doc.text("Total: ₦" + totalAmount, 20, y + 10);
  doc.text("Thank you!", 20, y + 20);

  doc.save("receipt.pdf");
}


// =====================
// WHATSAPP SEND
// =====================

function sendWhatsApp() {
  let name = document.getElementById("payerName").value || "Student";

  let message = `Hello, I am ${name}. I have paid for:%0A`;

  selectedCourses.forEach((c, i) => {
    message += `${i+1}. ${c.course} - ₦${c.price}%0A`;
  });

  message += `%0ATotal: ₦${totalAmount}`;

  let phone = "234XXXXXXXXXX"; // PUT YOUR NUMBER

  let url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
}
