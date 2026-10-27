"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Users, Gift, Star, Settings, Clock, 
  Search, Plus, Lock, MessageSquare, DollarSign
} from "lucide-react";

interface AppointmentItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guests: number;
  date: string;
  timeSlot: string;
  therapist?: string;
  totalAmount: number;
  status: string;
  service?: {
    name: string;
  };
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

interface OfferItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  minSpend?: number;
  isActive: boolean;
}

interface BlockedSlotItem {
  id: string;
  date: string;
  timeSlot?: string;
  reason?: string;
}

interface ReviewItem {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  treatment?: string;
  isApproved: boolean;
}

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

interface AdminDataState {
  appointments: AppointmentItem[];
  services: ServiceItem[];
  offers: OfferItem[];
  blockedSlots: BlockedSlotItem[];
  reviews: ReviewItem[];
  enquiries: EnquiryItem[];
  settings: Record<string, string>;
  stats: {
    totalRevenue?: number;
    totalBookings?: number;
    activeBookings?: number;
    completedBookings?: number;
    cancelledBookings?: number;
  };
}

type TabType = "appointments" | "services" | "offers" | "availability" | "customers" | "reviews" | "enquiries" | "settings";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("appointments");

  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<AdminDataState | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filter & Search states
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals / forms
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: "", description: "", duration: 60, price: 1800, category: "Thai Massage" });

  const [showAddOffer, setShowAddOffer] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: "", description: "", discount: 20, code: "", minSpend: 1500, categoryLimit: "", validUntil: "" });

  const [blockDate, setBlockDate] = useState("");
  const [blockTime, setBlockTime] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});

  // Check existing session
  useEffect(() => {
    const saved = sessionStorage.getItem("spa_admin_auth");
    if (saved) {
      setPasswordInput(saved);
      fetchAdminData(saved);
    }
  }, []);

  const fetchAdminData = async (pwd: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getData", password: pwd })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setAdminData(data);
        if (data.settings) setSettingsForm(data.settings);
        sessionStorage.setItem("spa_admin_auth", pwd);
      }
    } catch {
      setAuthError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdminData(passwordInput);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("spa_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
    setAdminData(null);
  };

  const performAction = async (payload: Record<string, unknown>) => {
    setLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage("Operation completed successfully.");
        // Refresh data
        fetchAdminData(passwordInput);
      } else {
        alert(data.error || "Action failed.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // LOGIN SCREEN
  // -----------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-lg shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-100 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={26} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Staff Portal</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Authorized personnel login for Baan Bua Spa operations.
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Staff Access Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password (demo: spa2026)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border rounded p-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Default demo password: <code className="bg-gray-100 px-1 py-0.5 rounded text-primary font-bold">spa2026</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "ENTER PORTAL"}
          </button>
        </form>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -----------------------------------------------------------------
  const appointments = adminData?.appointments || [];
  const services = adminData?.services || [];
  const offers = adminData?.offers || [];
  const blockedSlots = adminData?.blockedSlots || [];
  const reviews = adminData?.reviews || [];
  const enquiries = adminData?.enquiries || [];
  const stats = adminData?.stats || {};

  // Customer aggregation
  const customerMap: Record<string, { name: string; email: string; phone: string; count: number; totalSpent: number }> = {};
  appointments.forEach((a: AppointmentItem) => {
    const key = a.customerEmail || a.customerPhone;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: a.customerName,
        email: a.customerEmail,
        phone: a.customerPhone,
        count: 0,
        totalSpent: 0
      };
    }
    customerMap[key].count += 1;
    if (a.status !== "CANCELLED") {
      customerMap[key].totalSpent += a.totalAmount;
    }
  });
  const customers = Object.values(customerMap);

  // Filtered appointments
  const filteredAppointments = appointments.filter((a: AppointmentItem) => {
    const matchesSearch =
      a.customerName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.bookingCode.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.customerPhone.includes(appointmentSearch);
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            {settingsForm.spa_name || "Baan Bua Spa"} Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operational controls for appointments, therapists, rates, discounts, and facilities.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-medium flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live System Online</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1 border border-red-200 rounded hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="my-4 p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Total Revenue</span>
          <div className="text-2xl font-serif font-bold text-primary mt-1">
            ฿{stats.totalRevenue?.toLocaleString() || 0}
          </div>
          <span className="text-[11px] text-muted-foreground">From confirmed visits</span>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">All Bookings</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalBookings || 0}</div>
          <span className="text-[11px] text-muted-foreground">Lifetime reservations</span>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Active / Confirmed</span>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.activeBookings || 0}</div>
          <span className="text-[11px] text-muted-foreground">Upcoming sessions</span>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Completed</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.completedBookings || 0}</div>
          <span className="text-[11px] text-muted-foreground">Successfully fulfilled</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto space-x-1 border-b border-gray-200 pb-px mb-6 scrollbar-none">
        {[
          { id: "appointments", label: "Appointments", icon: Calendar, count: appointments.length },
          { id: "services", label: "Services & Rates", icon: Gift, count: services.length },
          { id: "offers", label: "Offers & Coupons", icon: DollarSign, count: offers.length },
          { id: "availability", label: "Availability & Blocks", icon: Clock },
          { id: "customers", label: "Guests & History", icon: Users, count: customers.length },
          { id: "reviews", label: "Reviews", icon: Star, count: reviews.length },
          { id: "enquiries", label: "Enquiries", icon: MessageSquare, count: enquiries.length },
          { id: "settings", label: "Website Settings", icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-primary bg-amber-50/40"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: APPOINTMENTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by guest name, phone, or ID..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded text-xs focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-2.5 py-1.5 text-xs bg-white outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="RESCHEDULED">Rescheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Guest Details</th>
                  <th className="p-3">Treatment</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Therapist</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      No matching appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app: AppointmentItem) => (
                    <tr key={app.id} className="hover:bg-gray-50/60">
                      <td className="p-3 font-mono font-bold text-primary">{app.bookingCode}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900">{app.customerName}</div>
                        <div className="text-gray-500 text-[11px]">{app.customerPhone}</div>
                        <div className="text-gray-400 text-[10px]">{app.customerEmail}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-800">{app.service?.name}</div>
                        <div className="text-gray-500 text-[11px]">{app.guests} {app.guests === 1 ? 'Guest' : 'Guests'}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{app.date}</div>
                        <div className="text-primary font-mono text-[11px]">{app.timeSlot}</div>
                      </td>
                      <td className="p-3 text-gray-700">{app.therapist || "Any Available"}</td>
                      <td className="p-3 font-bold text-primary">฿{app.totalAmount?.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          app.status === 'RESCHEDULED' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                          app.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1">
                        {app.status !== 'COMPLETED' && app.status !== 'CANCELLED' && (
                          <button
                            onClick={() => performAction({ action: 'updateAppointmentStatus', appointmentId: app.id, status: 'COMPLETED' })}
                            className="bg-green-700 hover:bg-green-800 text-white px-2 py-1 rounded text-[10px] font-medium"
                          >
                            Complete
                          </button>
                        )}
                        {app.status !== 'CANCELLED' && (
                          <button
                            onClick={() => performAction({ action: 'updateAppointmentStatus', appointmentId: app.id, status: 'CANCELLED' })}
                            className="border border-red-300 text-red-700 hover:bg-red-50 px-2 py-1 rounded text-[10px] font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: SERVICES & PRICING */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "services" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">Treatment Catalog & Pricing</h3>
              <p className="text-xs text-muted-foreground">Adjust therapy durations, descriptions, and official rates card in Baht (฿).</p>
            </div>
            <button
              onClick={() => setShowAddService(!showAddService)}
              className="bg-primary text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1 hover:bg-primary/90"
            >
              <Plus size={14} />
              <span>Add New Service</span>
            </button>
          </div>

          {showAddService && (
            <div className="p-5 bg-amber-50/50 rounded border border-amber-900/10 space-y-3 text-xs">
              <h4 className="font-bold text-gray-900">Create New Spa Therapy</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 60 })}
                  className="border rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Price in THB (฿)"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                  className="border rounded p-2"
                />
                <select
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  className="border rounded p-2 bg-white"
                >
                  <option value="Thai Massage">Thai Massage</option>
                  <option value="Oil Massage">Oil Massage</option>
                  <option value="Couples">Couples</option>
                  <option value="Body Treatments">Body Treatments</option>
                  <option value="Foot Treatments">Foot Treatments</option>
                  <option value="Spa Packages">Spa Packages</option>
                </select>
              </div>
              <textarea
                placeholder="Short description of the treatment..."
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="w-full border rounded p-2 resize-none"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    performAction({ action: "addService", ...newService });
                    setShowAddService(false);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded font-semibold"
                >
                  Save Service
                </button>
                <button
                  onClick={() => setShowAddService(false)}
                  className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {services.map((s: ServiceItem) => (
              <div key={s.id} className="p-4 rounded border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{s.name}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">{s.category}</span>
                  </div>
                  <div className="text-primary font-bold text-base mb-2">
                    ฿{s.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">({s.duration} mins)</span>
                  </div>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-4">{s.description}</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const newPrice = prompt(`Update price in THB for ${s.name}:`, String(s.price));
                      if (newPrice) performAction({ action: "editService", ...s, price: parseFloat(newPrice) });
                    }}
                    className="text-amber-800 hover:underline font-medium"
                  >
                    Edit Rate
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete service "${s.name}"?`)) performAction({ action: "deleteService", id: s.id });
                    }}
                    className="text-red-600 hover:underline font-medium ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: OFFERS & COUPONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "offers" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">Promotions & Coupon Codes</h3>
              <p className="text-xs text-muted-foreground">Manage promo discounts, minimum spends, and expiration dates.</p>
            </div>
            <button
              onClick={() => setShowAddOffer(!showAddOffer)}
              className="bg-primary text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Create Coupon</span>
            </button>
          </div>

          {showAddOffer && (
            <div className="p-5 bg-amber-50/50 rounded border border-amber-900/10 space-y-3 text-xs">
              <h4 className="font-bold text-gray-900">Add New Promo Offer</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Offer Title (e.g. MONSOON SPECIAL)"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. RAIN20)"
                  value={newOffer.code}
                  onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })}
                  className="border rounded p-2 uppercase"
                />
                <input
                  type="number"
                  placeholder="Discount % (e.g. 20)"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({ ...newOffer, discount: parseFloat(e.target.value) || 0 })}
                  className="border rounded p-2"
                />
              </div>
              <input
                type="text"
                placeholder="Offer description..."
                value={newOffer.description}
                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                className="w-full border rounded p-2"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    performAction({ action: "addOffer", ...newOffer });
                    setShowAddOffer(false);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded font-semibold"
                >
                  Save Coupon
                </button>
                <button
                  onClick={() => setShowAddOffer(false)}
                  className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {offers.map((off: OfferItem) => (
              <div key={off.id} className="p-4 rounded border border-gray-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-sm text-primary">{off.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${off.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {off.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mt-1">{off.title}</h4>
                  <div className="text-xl font-bold text-amber-700 my-2">{off.discount}% OFF</div>
                  <p className="text-gray-500 text-xs mb-3">{off.description}</p>
                </div>

                <div className="pt-2 border-t flex justify-between items-center text-xs">
                  <span className="text-gray-400">Min: ฿{off.minSpend || 0}</span>
                  <button
                    onClick={() => performAction({ action: "toggleOffer", id: off.id, isActive: !off.isActive })}
                    className="text-primary hover:underline font-semibold"
                  >
                    {off.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: AVAILABILITY & BLOCKED SLOTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "availability" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6 text-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900">Availability & Time-Slot Blocking</h3>
            <p className="text-muted-foreground">Block full dates for private events or specific time slots for maintenance.</p>
          </div>

          <div className="p-4 bg-amber-50 rounded border border-amber-900/10 space-y-3">
            <h4 className="font-bold text-gray-800">Block a Date or Time Slot</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="date"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="border rounded p-2 bg-white"
              />
              <select
                value={blockTime}
                onChange={(e) => setBlockTime(e.target.value)}
                className="border rounded p-2 bg-white"
              >
                <option value="">Block Whole Day</option>
                {[
                  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
                  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
                  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
                ].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                type="text"
                placeholder="Reason (e.g. VIP Private Suite Event)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="border rounded p-2 bg-white"
              />
              <button
                onClick={() => {
                  if (!blockDate) return alert("Please select a date.");
                  performAction({ action: "blockSlot", date: blockDate, timeSlot: blockTime || null, reason: blockReason });
                  setBlockDate("");
                  setBlockReason("");
                }}
                className="bg-primary text-white rounded p-2 font-semibold hover:bg-primary/90"
              >
                Block Slot
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-2">Currently Blocked Dates & Slots ({blockedSlots.length})</h4>
            {blockedSlots.length === 0 ? (
              <p className="text-gray-400">No dates or time slots are currently blocked.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {blockedSlots.map((b: BlockedSlotItem) => (
                  <div key={b.id} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800 block">{b.date}</span>
                      <span className="text-gray-600 text-[11px]">{b.timeSlot || "Whole Day Closed"}</span>
                      {b.reason && <span className="text-gray-400 text-[10px] block italic">{b.reason}</span>}
                    </div>
                    <button
                      onClick={() => performAction({ action: "unblockSlot", id: b.id })}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: GUESTS & BOOKING HISTORY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "customers" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">Guest Profiles & History</h3>
              <p className="text-xs text-muted-foreground">List of all customers who have booked therapies at Baan Bua Spa.</p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              {customers.length} Unique Guests
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="p-3">Guest Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Total Visits</th>
                  <th className="p-3">Total Spent</th>
                  <th className="p-3">Loyalty Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-900">{c.name}</td>
                    <td className="p-3 text-gray-600">{c.phone}</td>
                    <td className="p-3 text-gray-500">{c.email}</td>
                    <td className="p-3 font-bold text-primary">{c.count}</td>
                    <td className="p-3 font-bold text-gray-900">฿{c.totalSpent.toLocaleString()}</td>
                    <td className="p-3">
                      {c.count > 1 ? (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          VIP Repeat Guest
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">
                          First-Time Guest
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: REVIEWS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "reviews" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">Testimonials & Reviews</h3>
              <p className="text-muted-foreground">Approve, feature, or remove guest feedback shown on the public site.</p>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((r: ReviewItem) => (
              <div key={r.id} className="p-4 border rounded bg-gray-50/50 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-gray-900">{r.customer}</span>
                    <span className="text-amber-500 font-bold">★ {r.rating}/5</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${r.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {r.isApproved ? "Approved (Visible)" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-gray-700 italic">&quot;{r.comment}&quot;</p>
                  {r.treatment && <span className="text-[10px] text-gray-500 block mt-1">Treatment: {r.treatment}</span>}
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => performAction({ action: "toggleReview", id: r.id, isApproved: !r.isApproved })}
                    className="text-primary hover:underline font-semibold"
                  >
                    {r.isApproved ? "Hide" : "Approve"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this review?")) performAction({ action: "deleteReview", id: r.id });
                    }}
                    className="text-red-600 hover:underline font-semibold ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: ENQUIRIES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "enquiries" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 text-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900">Contact Inquiries</h3>
            <p className="text-muted-foreground">Direct messages sent by prospective guests via the contact form.</p>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-gray-400 py-6 text-center">No inquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {enquiries.map((e: EnquiryItem) => (
                <div key={e.id} className="p-4 border rounded bg-white shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-gray-800 font-semibold">
                    <span>{e.name}</span>
                    <span className="text-[10px] text-gray-400">{new Date(e.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    Email: <a href={`mailto:${e.email}`} className="text-primary underline">{e.email}</a> • Phone: {e.phone || "N/A"}
                  </div>
                  <p className="text-gray-700 pt-2 border-t border-gray-100">{e.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 8: WEBSITE SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 text-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900">Website & Brand Settings</h3>
            <p className="text-muted-foreground">Configure the official spa name, address, contact numbers, and policies.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Spa Brand Name</label>
              <input
                type="text"
                value={settingsForm.spa_name || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, spa_name: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Sanctuary Address</label>
              <input
                type="text"
                value={settingsForm.address || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Telephone Number</label>
              <input
                type="text"
                value={settingsForm.phone || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settingsForm.whatsapp || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Cancellation Policy</label>
              <textarea
                rows={3}
                value={settingsForm.cancellation_policy || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, cancellation_policy: e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={() => performAction({ action: "updateSettings", settings: settingsForm })}
              className="bg-primary text-white px-6 py-2.5 rounded font-semibold hover:bg-primary/90"
            >
              Save Website Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
