import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, UserCog, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/api`;

const AdminStaff = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("waiter");
  const [code, setCode] = useState("");

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/staff`);
      return res.json();
    },
  });

  const addStaffMutation = useMutation({
    mutationFn: async (newStaff: any) => {
      const res = await fetch(`${API_URL}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      if (!res.ok) throw new Error("Failed to add staff");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff member added successfully");
      setIsDialogOpen(false);
      setName(""); setRole("waiter"); setCode("");
    },
    onError: () => toast.error("Failed to add staff"),
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${API_URL}/staff/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        toast.success("Staff removed");
    }
  });

  const handleAdd = () => {
    if (!name || !code) {
        toast.error("Name and Code are required");
        return;
    }
    addStaffMutation.mutate({ name, role, code });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage waiters, kitchen staff, and admins.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Role</Label>
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="waiter">Waiter</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Passcode</Label>
                <Input value={code} onChange={e => setCode(e.target.value)} className="col-span-3" placeholder="Login Code (e.g. 1234)" />
              </div>
            </div>
            <Button onClick={handleAdd} disabled={addStaffMutation.isPending}>
              {addStaffMutation.isPending ? "Adding..." : "Save Staff"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Passcode</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {s.name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">{s.role}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                    ••••
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteStaffMutation.mutate(s.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
            {staff.length === 0 && !isLoading && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No staff members found. Add one to get started.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminStaff;
