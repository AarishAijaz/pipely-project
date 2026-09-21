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
import { useClerkSupabaseClient } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

const statusVariant: Record<Customer["status"], "default" | "secondary" | "destructive"> = {
  Lead: "secondary",
  Active: "default",
  Churned: "destructive",
};

type SortKey = "name" | "email" | "phone" | "company" | "status";

export default function CustomersPage() {
  const {isLoaded: userLoaded, user}= useUser();
  const supabase = useClerkSupabaseClient();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Customer["status"]>("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (!userLoaded) return;
    if (!user) {
      setCustomers([]);
      setIsLoaded(true);
      return;
    }

    async function loadCustomers() {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      // if (error) console.error(error);
      if (error) console.error("Database Error:", error.message, error.details, error.hint);
      else setCustomers(data ?? []);
      setIsLoaded(true);
    }
    loadCustomers();
  }, [userLoaded, user]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.company.toLowerCase().includes(term) ||
        (c.phone ?? "").toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [customers, searchTerm, statusFilter]);

  const sortedCustomers = useMemo(() => {
    if (!sortKey) return filteredCustomers;
    return [...filteredCustomers].sort((a, b) => {
      const aVal = (a[sortKey] ?? "").toLowerCase();
      const bVal = (b[sortKey] ?? "").toLowerCase();
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

  async function handleDelete(id: number) {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleSave(data: Omit<Customer, "id" | "created_at">) {
    if (editingCustomer) {
      const { data: updated, error } = await supabase
        .from("customers")
        .update(data)
        .eq("id", editingCustomer.id)
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? updated : c))
      );
    } else {
      const { data: inserted, error } = await supabase
        .from("customers")
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }
      setCustomers((prev) => [inserted, ...prev]);
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
          placeholder="Search by name, email, phone, or company..."
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
                <button onClick={() => handleSort("phone")} className="flex items-center gap-1 hover:text-foreground">
                  Phone <ArrowUpDown className="h-3.5 w-3.5" />
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
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
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
                  <TableCell className="text-muted-foreground">{c.phone || "—"}</TableCell>
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