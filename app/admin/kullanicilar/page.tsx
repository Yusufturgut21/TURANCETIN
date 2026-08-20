"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/users");
    const json = await res.json();
    if (json.success) setUsers(json.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!json.success) {
      setError(json.error || "Kullanıcı oluşturulamadı.");
      return;
    }
    setForm({ name: "", email: "", password: "", role: "admin" });
    setMessage("Kullanıcı oluşturuldu.");
    load();
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });
    const json = await res.json();
    if (!json.success) {
      setError(json.error || "Şifre değiştirilemedi.");
      return;
    }
    setMessage("Şifreniz güncellendi.");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">
          Admin Kullanıcıları
        </h1>

        <form onSubmit={createUser} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold">Yeni kullanıcı</h2>
          <input className="input-field" placeholder="Ad Soyad" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-field" type="email" placeholder="E-posta" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input-field" type="password" placeholder="Şifre (min 6)" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="editor">Editör</option>
          </select>
          <button type="submit" className="btn-primary text-sm">Oluştur</button>
        </form>

        <form onSubmit={changePassword} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-5">
          <h2 className="font-semibold">Şifremi değiştir</h2>
          <input className="input-field" type="password" placeholder="Mevcut şifre" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
          <input className="input-field" type="password" placeholder="Yeni şifre" required value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
          <input className="input-field" type="password" placeholder="Yeni şifre tekrar" required value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
          <button type="submit" className="btn-primary text-sm">Şifreyi güncelle</button>
        </form>

        {message ? <p className="mt-4 text-sm text-success">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      </div>

      <div className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold">Kayıtlı kullanıcılar</h2>
        <ul className="space-y-3 text-sm">
          {users.map((u) => (
            <li key={u._id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-muted">{u.email}</p>
              </div>
              <span className="text-xs uppercase text-muted">{u.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
