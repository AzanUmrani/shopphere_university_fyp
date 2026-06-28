import { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Home,
  Building,
  Check,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

const UserAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: "home",
    country: "United States",
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setAddresses([
      {
        id: "1",
        type: "home",
        firstName: "John",
        lastName: "Doe",
        street: "123 Main Street",
        apartment: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        phone: "+1 (555) 123-4567",
        isDefault: true,
      },
      {
        id: "2",
        type: "work",
        firstName: "John",
        lastName: "Doe",
        company: "Tech Corp",
        street: "456 Business Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "United States",
        isDefault: false,
      },
    ]);
  }, []);

  const handleAddAddress = () => {
    const address: Address = {
      id: Date.now().toString(),
      type: newAddress.type || "home",
      firstName: newAddress.firstName || "",
      lastName: newAddress.lastName || "",
      company: newAddress.company,
      street: newAddress.street || "",
      apartment: newAddress.apartment,
      city: newAddress.city || "",
      state: newAddress.state || "",
      zipCode: newAddress.zipCode || "",
      country: newAddress.country || "United States",
      phone: newAddress.phone,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, address]);
    setNewAddress({ type: "home", country: "United States" });
    setIsAddingNew(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="w-5 h-5" />;
      case "work":
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const AddressForm = ({
    address,
    onSave,
    onCancel,
  }: {
    address: Partial<Address>;
    onSave: (address: Partial<Address>) => void;
    onCancel: () => void;
  }) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {address.id ? "Edit Address" : "Add New Address"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address Type
          </label>
          <select
            value={address.type || "home"}
            onChange={(e) =>
              onSave({ ...address, type: e.target.value as Address["type"] })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="First Name"
            value={address.firstName || ""}
            onChange={(e) => onSave({ ...address, firstName: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={address.lastName || ""}
            onChange={(e) => onSave({ ...address, lastName: e.target.value })}
          />
        </div>

        {address.type === "work" && (
          <Input
            type="text"
            placeholder="Company"
            value={address.company || ""}
            onChange={(e) => onSave({ ...address, company: e.target.value })}
          />
        )}

        <Input
          type="text"
          placeholder="Street Address"
          value={address.street || ""}
          onChange={(e) => onSave({ ...address, street: e.target.value })}
        />

        <Input
          type="text"
          placeholder="Apartment, suite, etc. (optional)"
          value={address.apartment || ""}
          onChange={(e) => onSave({ ...address, apartment: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="City"
            value={address.city || ""}
            onChange={(e) => onSave({ ...address, city: e.target.value })}
          />
          <Input
            type="text"
            placeholder="State"
            value={address.state || ""}
            onChange={(e) => onSave({ ...address, state: e.target.value })}
          />
          <Input
            type="text"
            placeholder="ZIP Code"
            value={address.zipCode || ""}
            onChange={(e) => onSave({ ...address, zipCode: e.target.value })}
          />
        </div>

        <Input
          type="text"
          placeholder="Phone Number (optional)"
          value={address.phone || ""}
          onChange={(e) => onSave({ ...address, phone: e.target.value })}
        />

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(address)}>Save Address</Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Addresses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your delivery addresses
          </p>
        </div>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {isAddingNew && (
        <AddressForm
          address={newAddress}
          onSave={(addr) => {
            setNewAddress(addr);
            handleAddAddress();
          }}
          onCancel={() => {
            setIsAddingNew(false);
            setNewAddress({ type: "home", country: "United States" });
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className="p-6 relative">
            {address.isDefault && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="w-3 h-3 mr-1" />
                  Default
                </span>
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {getAddressTypeIcon(address.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {address.type}
                  </h3>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p className="font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.company && <p>{address.company}</p>}
                  <p>{address.street}</p>
                  {address.apartment && <p>{address.apartment}</p>}
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  {!address.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log("Edit address:", address.id)}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && !isAddingNew && (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No addresses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add your first delivery address to get started with shopping.
          </p>
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Address
          </Button>
        </Card>
      )}
    </div>
  );
};

export default UserAddresses;
