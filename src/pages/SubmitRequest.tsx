import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Trash2,
  DollarSign,
  Package,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/shared/Layout";

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const SubmitRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    vendor: "",
    comments: "",
    department: "",
    priority: "",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
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

  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + item.quantity * item.price, 0)
      .toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert("Purchase request submitted successfully!");
    navigate("/purchase-requests");
  };

  return (
    <Layout currentPage="submit-request">
      <div className="page-container">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Submit Purchase Request
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new request in your ProcureFlow system
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                    Request Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Request Title *
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter request title"
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="vendor"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Vendor *
                      </Label>
                      <Input
                        id="vendor"
                        name="vendor"
                        value={formData.vendor}
                        onChange={handleInputChange}
                        placeholder="Enter vendor name"
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">
                        Department *
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleSelectChange("department", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2 block">
                        Priority *
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          handleSelectChange("priority", value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card className="card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2 text-indigo-600" />
                      Items
                    </CardTitle>
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
                      <div className="col-span-5">Item Name</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-3">Unit Price</div>
                      <div className="col-span-2">Actions</div>
                    </div>

                    {/* Items */}
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="col-span-5">
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
                        <div className="col-span-2">
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comments */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Additional Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    placeholder="Add any additional comments or special instructions..."
                    className="min-h-24"
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card className="card-shadow sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Request Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium">
                        {
                          items.filter((item) => item.name && item.quantity > 0)
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">
                        {formData.department || "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Priority:</span>
                      <span className="font-medium">
                        {formData.priority || "Not selected"}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button
                      type="submit"
                      className="w-full btn-gradient h-12 text-base font-semibold shadow-lg"
                    >
                      Submit Request
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12"
                      onClick={() => navigate("/purchase-requests")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="text-base">💡 Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Be specific with item descriptions</p>
                    <p>• Include vendor contact information</p>
                    <p>• Set appropriate priority levels</p>
                    <p>• Add comments for special requirements</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SubmitRequest;
