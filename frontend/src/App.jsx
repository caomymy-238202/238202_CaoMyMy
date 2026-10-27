
import { useEffect, useState } from "react";
import "./index.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/employees";

const emptyEmployee = {
  employeeId: "",
  fullName: "",
  gender: "Male",
  dateOfBirth: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  hireDate: "",
  status: "Active"
};

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadEmployees(term = search) {
    setLoading(true);
    setError("");

    try {
      const url = `${API_URL}${term.trim() ? `?search=${encodeURIComponent(term.trim())}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Could not load employees");
      setEmployees(data);
    } catch (err) {
      setError(`Could not load employees. ${err.message}. Check that the backend is running.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees("");
  }, []);

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(employee) {
    setEditingId(employee._id);
    setForm({ ...emptyEmployee, ...employee });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyEmployee);
    setError("");
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save employee");

      setMessage(editingId ? "Employee updated successfully." : "Employee added successfully.");
      setForm(emptyEmployee);
      setEditingId(null);
      await loadEmployees(search);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(employee) {
    if (!window.confirm(`Delete ${employee.fullName} (${employee.employeeId})?`)) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${employee._id}`, {
        method: "DELETE"
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Could not delete employee");

      setMessage("Employee deleted successfully.");
      await loadEmployees(search);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <p className="eyebrow">HUMAN RESOURCES</p>
          <h1>Employee Management</h1>
          <p className="subtitle">Manage your employee records in one place.</p>
        </div>
        <span className="count">{employees.length} employees</span>
      </header>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <section className="panel">
        <h2>{editingId ? "Edit employee" : "Add employee"}</h2>

        <form onSubmit={saveEmployee}>
          <div className="form-grid">
            <label>
              Employee ID *
              <input name="employeeId" value={form.employeeId} onChange={changeField}
                required disabled={Boolean(editingId)} placeholder="e.g. NV004" />
            </label>

            <label>
              Full name *
              <input name="fullName" value={form.fullName} onChange={changeField}
                required placeholder="Full name" />
            </label>

            <label>
              Email *
              <input name="email" type="email" value={form.email} onChange={changeField}
                required placeholder="name@example.com" />
            </label>

            <label>
              Phone
              <input name="phone" value={form.phone} onChange={changeField}
                placeholder="Phone number" />
            </label>

            <label>
              Gender
              <select name="gender" value={form.gender || ""} onChange={changeField}>
                <option value="">Not specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Date of birth
              <input name="dateOfBirth" type="date" value={form.dateOfBirth || ""}
                onChange={changeField} />
            </label>

            <label>
              Department
              <input name="department" value={form.department || ""} onChange={changeField}
                placeholder="e.g. IT" />
            </label>

            <label>
              Position
              <input name="position" value={form.position || ""} onChange={changeField}
                placeholder="Job title" />
            </label>

            <label>
              Hire date
              <input name="hireDate" type="date" value={form.hireDate || ""}
                onChange={changeField} />
            </label>

            <label>
              Status
              <select name="status" value={form.status || "Active"} onChange={changeField}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button className="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add employee"}
            </button>
            {editingId && (
              <button className="secondary" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="list-header">
          <div>
            <h2>Employee directory</h2>
            <p className="subtitle">Search by employee ID or name.</p>
          </div>
          <form className="search-form" onSubmit={(e) => {
            e.preventDefault();
            loadEmployees(search);
          }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..." aria-label="Search employees" />
            <button className="primary" type="submit">Search</button>
            <button className="secondary" type="button" onClick={() => {
              setSearch("");
              loadEmployees("");
            }}>Clear</button>
          </form>
        </div>

        {loading ? (
          <p className="empty">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="empty">No employees found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.employeeId}</td>
                    <td>
                      <strong>{employee.fullName}</strong>
                      <small>{employee.phone}</small>
                    </td>
                    <td>{employee.department || "—"}</td>
                    <td>{employee.position || "—"}</td>
                    <td>{employee.email}</td>
                    <td>
                      <span className={`status ${employee.status === "Active" ? "active" : "inactive"}`}>
                        {employee.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="secondary small" onClick={() => {
                          window.alert(
                            `Employee details\nID: ${employee.employeeId}\nName: ${employee.fullName}\nGender: ${employee.gender || "—"}\nDate of birth: ${employee.dateOfBirth || "—"}\nDepartment: ${employee.department || "—"}\nPosition: ${employee.position || "—"}\nEmail: ${employee.email}\nPhone: ${employee.phone || "—"}\nHire date: ${employee.hireDate || "—"}\nStatus: ${employee.status || "Active"}`
                          );
                        }}>View</button>
                        <button className="secondary small" onClick={() => startEdit(employee)}>
                          Edit
                        </button>
                        <button className="danger small" onClick={() => deleteEmployee(employee)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>Employee Management System · React + Express + MongoDB</footer>
    </main>
  );
}
