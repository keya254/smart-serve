import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePOS } from "@/contexts/POSContext";
import { formatKES } from "@/data/mock";
import { useState } from "react";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api";

const AdminMenu = () => {
  const { menuItems } = usePOS();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  const addItemMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const res = await fetch(`${API_URL}/menu-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item added successfully");
      setIsDialogOpen(false);
      // Reset form
      setName(""); setPrice(""); setCategory(""); setDesc(""); setImage("");
    },
    onError: () => toast.error("Failed to add item"),
  });

  const handleSave = () => {
    if (!name || !price || !category) {
      toast.error("Please fill required fields");
      return;
    }
    addItemMutation.mutate({
      name,
      description: desc,
      price: parseFloat(price),
      category,
      image,
      popular: false,
      available: true
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold">Menu Management</h1>
           <p className="text-muted-foreground">Manage your food and beverage items.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="e.g. Grilled Chicken" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="col-span-3" placeholder="e.g. 1200" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input id="category" value={category} onChange={e => setCategory(e.target.value)} className="col-span-3" placeholder="e.g. Mains" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image URL</Label>
                <Input id="image" value={image} onChange={e => setImage(e.target.value)} className="col-span-3" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-right">Description</Label>
                <Textarea id="desc" value={desc} onChange={e => setDesc(e.target.value)} className="col-span-3" placeholder="Item description..." />
              </div>
            </div>
            <Button onClick={handleSave} disabled={addItemMutation.isPending}>
              {addItemMutation.isPending ? "Saving..." : "Save Item"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-shadow">
            <div className="h-40 bg-muted relative">
               {item.image ? (
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                       <ImageIcon className="h-10 w-10" />
                   </div>
               )}
               <div className="absolute top-2 right-2">
                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.available ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                       {item.available ? 'Available' : 'Sold Out'}
                   </span>
               </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <span className="font-bold text-primary">{formatKES(item.price)}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
              
              <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                   <Button variant="ghost" size="sm" className="px-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
