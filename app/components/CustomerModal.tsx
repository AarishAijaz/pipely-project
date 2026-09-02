"use client";

import { useState, useEffect } from "react";

export type Customer = {
  id: number;
  name: string;
  email: string;
  company: string;
  status: "Lead" | "Active" | "Churned";
};

export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
  editingCustomer,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, "id">) => void;
  editingCustomer: Customer | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Customer["status"]>("Lead");

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setEmail(editingCustomer.email);
      setCompany(editingCustomer.company);
      setStatus(editingCustomer.status);
    } else {
      setName("");
      setEmail("");
      setCompany("");
      setStatus("Lead");
    }
  }, [editingCustomer, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ name, email, company, status });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
        <h2 className="text-xl font-bold mb-5">
          {editingCustomer ? "Edit Customer" : "Add Customer"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Jane Cooper"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="jane@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Acme Inc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Customer["status"])}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 transition-all"
            >
              {editingCustomer ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}