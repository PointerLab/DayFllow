# 🕒 DayFlow – Human Resource Management System (HRMS)

DayFlow is a **modern, full‑stack Human Resource Management System (HRMS)** built to handle real‑world employee workflows such as **authentication, attendance tracking, leave management, and role‑based dashboards**.

The project uses a **React.js frontend** and a **Django REST backend**, with PostgreSQL as the database. The primary focus of DayFlow is **correctness, security, and real HR logic**, not just UI-level CRUD operations.

---

## 🚀 Project Vision

Most HRMS demos focus on UI first and logic later. **DayFlow does the opposite.**

The goal of this system is to:

* Enforce **real HR policies**
* Prevent **attendance and leave manipulation**
* Maintain **data integrity and auditability**
* Be **deployable in real organizations**, not just demo environments

DayFlow is designed to feel **production‑ready**, even in a hackathon setting.

---

## 🧱 Tech Stack

### Frontend

* **React.js**
* Axios for API communication
* JWT-based authentication handling
* Role‑based UI rendering (Admin / Employee)

### Backend

* **Django**
* **Django REST Framework**
* **PostgreSQL**
* JWT Authentication
* Role‑Based Access Control (RBAC)

### Architecture

* RESTful API architecture
* Modular Django apps
* Secure token‑based authentication
* Clear separation of concerns

---

## 🧩 System Modules

### 1️⃣ Authentication & Authorization

* Custom user model
* User roles:

  * `ADMIN`
  * `HR`
  * `EMPLOYEE`
* JWT authentication (access & refresh tokens)
* Forced password change for newly created employees
* Secure password hashing

**Why this matters:**
This mirrors real enterprise onboarding and security practices.

---

### 2️⃣ Employee Management

* Admin/HR can create employees
* System auto‑generates:

  * Unique login ID
  * Temporary password
* Employees must change password on first login
* Soft‑delete approach using `is_active` flag

**Why this matters:**
Employee records are never destroyed, preserving historical integrity.

---

### 3️⃣ Attendance Management

* Daily check‑in and check‑out
* Attendance statuses:

  * `PRESENT`
  * `ABSENT`
  * `LEAVE`
* One attendance record per employee per day
* Duplicate check‑ins prevented
* Employees cannot check in on approved leave days

**Business logic included:**

* Prevents attendance manipulation
* Enforces strict daily attendance rules

---

### 4️⃣ Leave Management

* Employees can apply for leave
* Leave types:

  * Casual
  * Sick
  * Paid
* Leave statuses:

  * Pending
  * Approved
  * Rejected
* Admin/HR approval workflow
* Approved leave automatically reflects in attendance
* Overlapping leave requests are blocked

**Why this matters:**
Leave and attendance are tightly coupled, just like real HR systems.

---

### 5️⃣ Dashboards

#### 👤 Employee Dashboard

* Today’s attendance status
* Monthly present count
* Monthly leave count
* Pending leave requests

#### 🧑‍💼 Admin / HR Dashboard

* Total employees
* Present today
* Absent today
* Employees on leave
* Pending leave approvals

Dashboards provide **decision‑ready summaries** instead of raw data.

---

## 🔐 Security Features

* JWT-based authentication
* Token expiration handling
* Role‑based API access control
* No plain‑text passwords
* Forced password rotation for new users
* Backend‑level validation (not frontend‑dependent)

---

## 🧠 Key Design Decisions

* **Logic‑first development**: Core workflows before UI polish
* **Guards & validations**: System blocks invalid or overlapping actions
* **Audit‑ready mindset**: Data is preserved, not deleted
* **Scalable architecture**: Modular apps for future growth

---

## 🌐 API Overview

### Authentication

```
POST /api/auth/login/
POST /api/auth/refresh/
POST /api/auth/change-password/
POST /api/auth/create-employee/
```

### Attendance

```
POST /api/attendance/check-in/
POST /api/attendance/check-out/
GET  /api/attendance/my/
```

### Leave

```
POST /api/leave/apply/
GET  /api/leave/my/
GET  /api/leave/all/
POST /api/leave/action/<id>/
```

### Dashboard

```
GET /api/dashboard/employee/
GET /api/dashboard/admin/
```

---

## 🛠️ Local Setup

### Backend Setup

```bash
git clone <repository-url>
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🧪 Demo Flow (Recommended)

1. Admin logs in
2. Admin creates an employee
3. Employee logs in using temporary credentials
4. Employee changes password
5. Employee checks in
6. Employee applies leave
7. Admin approves leave
8. Attendance auto‑updates
9. Dashboards reflect real‑time data

---

## 🏆 Why DayFlow Stands Out

✔ Not just CRUD operations
✔ Real HR workflows
✔ Strong backend validation
✔ Security‑first design
✔ Production‑deployable structure

> **“DayFlow is built to be correct before it is pretty.”**

---

## 📌 Future Enhancements

* Audit logs
* Leave balance system
* Attendance export (CSV / PDF)
* Email notifications
* Organization‑based multi‑tenancy

---

## 👥 Team

* Backend: Django + PostgreSQL
* Frontend: React.js
* System Design: Role‑based HR workflows

---

## 📜 License

This project is developed for hackathon and educational purposes.
