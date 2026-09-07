"use client";

import { useState, useEffect, useMemo } from "react";
import { MoreHorizontal, Plus, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomerFormDialog, Customer } from "@/components/customer-form-dialog";

const statusVariant: Record<Customer["status"], "default" | "secondary" | "destructive"> = {
  Lead: "secondary",
  Active: "default",
  Churned: "destructive",
};

const STORAGE_KEY = "pipely_customers";
type SortKey = "name" | "email" | "company" | "status";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Customer["status"]>("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCustomers(JSON.parse(saved));
    } catch (err) {
      console.error(err);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
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
    return [...filteredCustomers].sort((a, b) => {
      const aVal = a[sortKey].toLowerCase();
      const bVal = b[sortKey].toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCustomers, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function handleAddClick() {
    setEditingCustomer(null);
    setDialogOpen(true);
  }

  function handleEditClick(customer: Customer) {
    setEditingCustomer(customer);
    setDialogOpen(true);
  }

  function handleDelete(id: number) {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  function handleSave(data: Omit<Customer, "id">) {
    if (editingCustomer) {
      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...data } : c)));
    } else {
      setCustomers((prev) => [...prev, { id: Date.now(), ...data }]);
    }
    setDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            {customers.length} total {customers.length === 1 ? "customer" : "customers"}
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-1 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "All" | Customer["status"])}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            <SelectItem value="Lead">Lead</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Churned">Churned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(searchTerm || statusFilter !== "All") && (
        <p className="text-sm text-muted-foreground -mt-3">
          Showing {sortedCustomers.length} of {customers.length} customers
        </p>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                  Name <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort("email")} className="flex items-center gap-1 hover:text-foreground">
                  Email <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort("company")} className="flex items-center gap-1 hover:text-foreground">
                  Company <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => handleSort("status")} className="flex items-center gap-1 hover:text-foreground">
                  Status <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  {customers.length === 0
                    ? "No customers yet — click \"Add Customer\" to get started."
                    : "No customers match your filters."}
                </TableCell>
              </TableRow>
            ) : (
              sortedCustomers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="text-muted-foreground">{c.company || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(c)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(c.id)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editingCustomer={editingCustomer}
      />
    </div>
  );
}