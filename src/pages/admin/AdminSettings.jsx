import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

function AdminSettings() {
  const [clinic, setClinic] = useState({
    name: "Hopeville Eye Clinic",
    tagline: "Vision Specialists",
    email: "Hopevilleeyeclinicltd@gmail.com",
    phone: "+234 813 330 0378",
    address: "#64 Alcon Road, Woji",
    city: "Port Harcourt",
    state: "Rivers",
  });

  const [hours, setHours] = useState({
    monFri: "8:00 AM - 5:30 PM",
    saturday: "10:00 AM - 3:00 PM",
    sunday: "Closed",
  });

  const [saved, setSaved] = useState("");

  function handleClinicChange(e) {
    const { name, value } = e.target;
    setClinic(prev => ({ ...prev, [name]: value }));
  }

  function handleHoursChange(e) {
    const { name, value } = e.target;
    setHours(prev => ({ ...prev, [name]: value }));
  }

  function handleSave(section) {
    setSaved(section);
    setTimeout(() => setSaved(""), 3000);
  }

  const inputClass = "w-full border border-[#e8e8e8] px-4 py-3 text-sm focus:outline-none focus:border-[#4A7E96] transition-colors bg-white";
  const labelClass = "text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Configuration
        </p>
        <h1 className="text-3xl font-light text-[#1a1a1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Settings
        </h1>
      </div>

      {/* Clinic Info */}
      <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
        <h2 className="text-lg font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Clinic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {[
            { label: "Clinic Name", name: "name" },
            { label: "Tagline", name: "tagline" },
            { label: "Email Address", name: "email" },
            { label: "Phone Number", name: "phone" },
            { label: "Street Address", name: "address" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
          ].map(field => (
            <div key={field.name} className={field.name === "address" ? "sm:col-span-2" : ""}>
              <label className={labelClass}>{field.label}</label>
              <input type="text" name={field.name} value={clinic[field.name]}
                onChange={handleClinicChange} className={inputClass} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleSave("clinic")}
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Save Changes
          </button>
          {saved === "clinic" && (
            <div className="flex items-center gap-2 text-[#4A7E96] text-sm">
              <CheckCircle size={16} strokeWidth={1.5} />
              Saved!
            </div>
          )}
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
        <h2 className="text-lg font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Office Hours
        </h2>
        <div className="flex flex-col gap-5 max-w-md mb-6">
          {[
            { label: "Monday – Friday", name: "monFri" },
            { label: "Saturday", name: "saturday" },
            { label: "Sunday", name: "sunday" },
          ].map(field => (
            <div key={field.name}>
              <label className={labelClass}>{field.label}</label>
              <input type="text" name={field.name} value={hours[field.name]}
                onChange={handleHoursChange} className={inputClass} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleSave("hours")}
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Save Hours
          </button>
          {saved === "hours" && (
            <div className="flex items-center gap-2 text-[#4A7E96] text-sm">
              <CheckCircle size={16} strokeWidth={1.5} />
              Saved!
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
        <h2 className="text-lg font-medium text-[#B5685A] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Danger Zone
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 border border-[#e8e8e8]">
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">Clear All Orders</p>
              <p className="text-xs text-[#888] mt-0.5">Permanently delete all order records.</p>
            </div>
            <button className="border border-[#B5685A] text-[#B5685A] px-4 py-2 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] hover:text-white transition-all">
              Clear
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-[#e8e8e8]">
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">Reset All Data</p>
              <p className="text-xs text-[#888] mt-0.5">Factory reset — removes all data permanently.</p>
            </div>
            <button className="border border-[#B5685A] text-[#B5685A] px-4 py-2 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] hover:text-white transition-all">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;