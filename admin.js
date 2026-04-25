// Run ONLY on admin page
if (!window.location.pathname.includes("admin.html")) {
  // do nothing
} else {
  if (sessionStorage.getItem("isAdmin") !== "true") {
    alert("Access denied! Admin only.");
    window.location.href = "index.html";
  }
}
function adminLogin() {
  let pass = document.getElementById("adminPass").value;

  if (pass === "SADIQ123") {
    sessionStorage.setItem("isAdmin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Wrong password");
  }
}

// LOAD COURSES
function loadCourses() {
  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  let list = document.getElementById("courseAdminList");

  if (!list) return;

  list.innerHTML = "";

  courses.forEach((c, index) => {
    let item = document.createElement("li");

    item.innerHTML = `
      ${c.name} - ₦${c.price}
      <button onclick="deleteCourse(${index})">Delete</button>
    `;

    list.appendChild(item);
  });
}

// ADD COURSE
function addCourse() {
  let name = document.getElementById("courseName").value;
  let price = document.getElementById("coursePrice").value;

  if (!name || !price) {
    alert("Fill all fields");
    return;
  }

  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  courses.push({ name, price });

  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Course added!");

  loadCourses();
}

// DELETE COURSE
function deleteCourse(index) {
  let courses = JSON.parse(localStorage.getItem("courses")) || [];

  courses.splice(index, 1);

  localStorage.setItem("courses", JSON.stringify(courses));

  loadCourses();
}

// LOAD PAYMENTS
function loadPayments() {
  let payments = JSON.parse(localStorage.getItem("paymentRequests")) || [];

  let table = document.getElementById("adminTable");

  if (!table) return;

  table.innerHTML = "";

  payments.forEach((p, index) => {
    let row = document.createElement("tr");

    let action =
      p.status === "pending"
        ? `<button onclick="approve(${index})">Accept</button>`
        : "✅ Paid";

    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.courses}</td>
      <td>${p.status}</td>
      <td>${action}</td>
    `;

    table.appendChild(row);
  });
}

// APPROVE PAYMENT
function approve(index) {
  let payments = JSON.parse(localStorage.getItem("paymentRequests")) || [];

  payments[index].status = "approved";

  localStorage.setItem("paymentRequests", JSON.stringify(payments));

  alert("Payment Approved!");

  loadPayments();
}

// INIT
loadCourses();
loadPayments();
function adminLogout() {
  sessionStorage.removeItem("isAdmin"); 
  window.location.href = "index.html";
}
