import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  CheckCircle,
  Package,
  Settings,
  User,
  Plus,
  Trash2,
  ChevronDown,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const SidebarItem = ({
  icon: Icon,
  label,
  isActive = false,
  to,
}: {
  icon: any;
  label: string;
  isActive?: boolean;
  to?: string;
}) => {
  const content = (
    <div
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-700 hover:bg-gray-100",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <button>{content}</button>;
};

const SubmitRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    vendor: "",
    comments: "",
  });

  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "", quantity: 0, price: 0 },
    { id: "2", name: "", quantity: 0, price: 0 },
    { id: "3", name: "", quantity: 0, price: 0 },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (
    id: string,
    field: keyof Item,
    value: string | number,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: "",
      quantity: 0,
      price: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert("Purchase request submitted successfully!");
    navigate("/purchase-requests");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Purchase Manager
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                Dashboard
              </Link>
              <Link
                to="/purchase-requests"
                className="text-gray-500 hover:text-gray-700"
              >
                Purchase Requests
              </Link>
              <Link
                to="/approve-requests"
                className="text-gray-500 hover:text-gray-700"
              >
                Approve Requests
              </Link>
              <Link
                to="/purchase-orders"
                className="text-gray-500 hover:text-gray-700"
              >
                Purchase Orders
              </Link>
            </nav>
          </div>
          <Link to="/profile">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                JS
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Dashboard
            </h2>
            <div className="space-y-2">
              <SidebarItem icon={Building2} label="Dashboard" to="/dashboard" />
              <SidebarItem
                icon={FileText}
                label="Submit Purchase Request"
                isActive={true}
              />
              <SidebarItem
                icon={FileText}
                label="Purchase Requests"
                to="/purchase-requests"
              />
              <SidebarItem
                icon={CheckCircle}
                label="Approve Requests"
                to="/approve-requests"
              />
              <SidebarItem
                icon={Package}
                label="Purchase Order"
                to="/purchase-orders"
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-4 w-56 space-y-2">
            <div className="border-t border-gray-200 pt-4">
              <Select>
                <SelectTrigger className="w-full">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Purchaser</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SidebarItem icon={Settings} label="Settings" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Submit Purchase Request
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Request Title */}
              <div>
                <Label
                  htmlFor="title"
                  className="text-base font-medium text-gray-900 mb-2 block"
                >
                  Request Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter request title"
                  className="w-full h-12"
                  required
                />
              </div>

              {/* Vendor */}
              <div>
                <Label
                  htmlFor="vendor"
                  className="text-base font-medium text-gray-900 mb-2 block"
                >
                  Vendor
                </Label>
                <Input
                  id="vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  placeholder="Enter vendor name"
                  className="w-full h-12"
                  required
                />
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium text-gray-900">
                    Items
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="col-span-6">
                      <Label className="text-sm font-medium text-gray-700">
                        Item
                      </Label>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Quantity
                      </Label>
                    </div>
                    <div className="col-span-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Price
                      </Label>
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Items */}
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="col-span-6">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(item.id, "name", e.target.value)
                          }
                          placeholder="Product name"
                          className="w-full"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          placeholder="0"
                          className="w-full"
                          min="0"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          value={item.price || ""}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                          className="w-full"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-1">
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-9 w-9 p-0 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <Label
                  htmlFor="comments"
                  className="text-base font-medium text-gray-900 mb-2 block"
                >
                  Comments
                </Label>
                <Textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Add any additional comments"
                  className="w-full min-h-24"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-base font-medium"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitRequest;
