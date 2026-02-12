import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, Save, X, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { usePOS } from "@/contexts/POSContext";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

import { API_BASE_URL } from '@/config/api';

const API_URL = `${API_BASE_URL}/api`;

const AdminTables = () => {
  const { tables } = usePOS();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [newTableSeats, setNewTableSeats] = useState("");
  const [selectedTableQR, setSelectedTableQR] = useState<string | null>(null);

  const addTableMutation = useMutation({
    mutationFn: async ({ number, seats }: { number: number; seats: number }) => {
      const res = await fetch(`${API_URL}/tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, seats }),
      });
      if (!res.ok) throw new Error("Failed to add table");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success("Table added successfully");
      setIsDialogOpen(false);
      setNewTableNumber("");
      setNewTableSeats("");
    },
    onError: (error) => {
      toast.error(`Error adding table: ${error.message}`);
    },
  });

  const handleAddTable = () => {
    if (!newTableNumber || !newTableSeats) {
      toast.error("Please fill in all fields");
      return;
    }
    addTableMutation.mutate({
      number: parseInt(newTableNumber),
      seats: parseInt(newTableSeats),
    });
  };

  const getQRUrl = (tableId: string) => {
    return `${window.location.origin}/tables/${tableId}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Table Management</h1>
          <p className="text-muted-foreground">Manage restaurant tables and generate QR codes.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="number" className="text-right">
                  Number
                </label>
                <Input
                  id="number"
                  type="number"
                  className="col-span-3"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="seats" className="text-right">
                  Seats
                </label>
                <Input
                  id="seats"
                  type="number"
                  className="col-span-3"
                  value={newTableSeats}
                  onChange={(e) => setNewTableSeats(e.target.value)}
                  placeholder="e.g. 4"
                />
              </div>
            </div>
            <Button onClick={handleAddTable} disabled={addTableMutation.isPending}>
              {addTableMutation.isPending ? "Adding..." : "Save Table"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table No.</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium">Table {table.number}</TableCell>
                <TableCell>{table.seats}</TableCell>
                <TableCell>
                  <Badge
                    variant={table.status === "available" ? "outline" : "default"}
                    className="capitalize"
                  >
                    {table.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {table.orderTotal ? `KES ${table.orderTotal.toLocaleString()}` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTableQR(table.id)}
                    >
                      <QrCode className="h-4 w-4 mr-1" /> QR Code
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* QR Code Modal */}
      <Dialog open={!!selectedTableQR} onOpenChange={() => setSelectedTableQR(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Table QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            {selectedTableQR && (
              <>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={getQRUrl(selectedTableQR)}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground break-all">
                  Scan to view Table {tables.find((t) => t.id === selectedTableQR)?.number}
                </p>
                <p className="text-xs text-center text-muted-foreground font-mono bg-muted p-2 rounded w-full break-all">
                  {getQRUrl(selectedTableQR)}
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    window.open(getQRUrl(selectedTableQR), '_blank');
                  }}
                >
                  Open Link
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTables;
