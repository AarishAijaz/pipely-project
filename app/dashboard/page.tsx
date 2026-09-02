"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CustomerModal, { Customer } from "@/app/components/CustomerModal";

const statusStyles: Record<Customer["status"], string> = {
  Lead: "bg-amber-50 text-amber-700",
  Active: "bg-emerald-50 text-emerald-700",
  Churned: "bg-red-50 text-red-700",
};

const STORAGE_KEY = "pipely_customers";

type SortKey = "name" | "email" | "company" | "status";
type SortDirection = "asc" | "desc";

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Customer["status"]>("All");

  // Sort state
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCustomers(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load customers from localStorage:", err);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (err) {
      console.error("Failed to save customers to localStorage:", err);
    }
  }, [customers, isLoaded]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [customers, searchTerm, statusFilter]);

  const sortedCustomers = useMemo(() => {
    if (!sortKey) return filteredCustomers;
    const sorted = [...filteredCustomers].sort((a, b) => {
      const aVal = a[sortKey].toLowerCase();
      const bVal = b[sortKey].toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCustomers, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function SortIndicator({ column }: { column: SortKey }) {
    if (sortKey !== column) return <span className="text-slate-300 ml-1">↕</span>;
    return <span className="text-indigo-600 ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  }

  function handleAddClick() {
    setEditingCustomer(null);
    setModalOpen(true);
  }

  function handleEditClick(customer: Customer) {
    setEditingCustomer(customer);
    setModalOpen(true);
  }

  function handleDelete(id: number) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  function handleSave(data: Omit<Customer, "id">) {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...data } : c))
      );
    } else {
      setCustomers((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    setModalOpen(false);
  }

  return (
    <>
      <Navbar active="dashboard" />

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Total entries: <span className="font-semibold text-indigo-600">{customers.length}</span>
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
          >
            <span className="text-lg leading-none">+</span> Add Customer
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | Customer["status"])}
            className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-48"
          >
            <option value="All">All statuses</option>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Churned">Churned</option>
          </select>
        </div>

        {(searchTerm || statusFilter !== "All") && (
          <p className="text-sm text-slate-500 mb-3">
            Showing {sortedCustomers.length} of {customers.length} customers
          </p>
        )}

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="text-left font-semibold text-slate-500 px-6 py-3 cursor-pointer hover:text-slate-700 select-none"
                >
                  Name <SortIndicator column="name" />
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="text-left font-semibold text-slate-500 px-6 py-3 cursor-pointer hover:text-slate-700 select-none"
                >
                  Email <SortIndicator column="email" />
                </th>
                <th
                  onClick={() => handleSort("company")}
                  className="text-left font-semibold text-slate-500 px-6 py-3 cursor-pointer hover:text-slate-700 select-none"
                >
                  Company <SortIndicator column="company" />
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="text-left font-semibold text-slate-500 px-6 py-3 cursor-pointer hover:text-slate-700 select-none"
                >
                  Status <SortIndicator column="status" />
                </th>
                <th className="text-right font-semibold text-slate-500 px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 px-6 py-14">
                    {customers.length === 0
                      ? <>No customers yet — click &ldquo;Add Customer&rdquo; to get started.</>
                      : <>No customers match your filters.</>}
                  </td>
                </tr>
              ) : (
                sortedCustomers.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{c.name}</td>
                    <td className="px-6 py-3.5 text-slate-500">{c.email}</td>
                    <td className="px-6 py-3.5 text-slate-500">{c.company || "—"}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleEditClick(c)}
                        className="text-indigo-600 font-medium text-sm hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 font-medium text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />

      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingCustomer={editingCustomer}
      />
    </>
  );
}