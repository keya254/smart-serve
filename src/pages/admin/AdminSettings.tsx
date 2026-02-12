import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save } from "lucide-react";

const AdminSettings = () => {
    // In a real app, these would come from the backend
    const [restaurantName, setRestaurantName] = useState("Savanna Grill");
    const [currency, setCurrency] = useState("KES");
    const [taxRate, setTaxRate] = useState("16");
    const [enableOnlineOrders, setEnableOnlineOrders] = useState(false);

    const handleSave = () => {
        // Mock save
        localStorage.setItem("settings_restaurantName", restaurantName);
        toast.success("Settings saved successfully");
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">General Settings</h1>
            
            <div className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input id="name" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="currency">Currency Symbol</Label>
                    <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="tax">Tax Rate (%)</Label>
                    <Input id="tax" type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                </div>

                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                    <Label htmlFor="online-orders" className="flex flex-col space-y-1">
                        <span>Enable Online Orders</span>
                        <span className="font-normal text-xs text-muted-foreground">Allow customers to order from the website directly.</span>
                    </Label>
                    <Switch id="online-orders" checked={enableOnlineOrders} onCheckedChange={setEnableOnlineOrders} />
                </div>

                <Button onClick={handleSave} className="w-full">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>
        </div>
    );
};

export default AdminSettings;
