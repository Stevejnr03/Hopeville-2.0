import { useState, useRef, useEffect} from "react";
import { User, Camera, Eye, EyeOff, CheckCircle } from "lucide-react";
// import { mockUser } from "../../data/mockUserData";

import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

function DashboardProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false, newPass: false, confirm: false
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
  userService.getProfile().then(data => {
    setProfile({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone || "",
      avatar: data.avatar_url,
    });
  }).catch(console.error);
}, []);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setPasswordError("");
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  }

 async function handleProfileSave(e) {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("first_name", profile.firstName);
    formData.append("last_name", profile.lastName);
    formData.append("phone", profile.phone);
    if (fileRef.current?.files[0]) {
      formData.append("avatar", fileRef.current.files[0]);
    }
    await userService.updateProfile(formData);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  } catch (err) { console.error(err); }
}


  async function handlePasswordSave(e) {
  e.preventDefault();
  if (passwords.newPass !== passwords.confirm) {
    setPasswordError("Passwords do not match.");
    return;
  }
  try {
    await userService.updatePassword({
      current_password: passwords.current,
      new_password: passwords.newPass,
    });
    setPasswordSaved(true);
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPasswordSaved(false), 3000);
  } catch (err) {
    setPasswordError(err.message);
  }
}

  const inputClass = "w-full border border-[#e8e8e8] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#ccc] focus:outline-none focus:border-[#4A7E96] transition-colors duration-200 bg-white";
  const labelClass = "text-xs tracking-[0.15em] uppercase text-[#888] mb-2 block";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[#B5685A] text-xs tracking-[0.35em] uppercase mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Account Settings
        </p>
        <h1 className="text-3xl font-light text-[#1a1a1a]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          My Profile
        </h1>
      </div>

      {/* Profile Photo + Info */}
      <form onSubmit={handleProfileSave} className="bg-white border border-[#e8e8e8] p-6 md:p-8">
        <h2 className="text-lg font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Personal Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#4A7E96]/10 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} strokeWidth={1} className="text-[#4A7E96]" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#4A7E96] rounded-full flex items-center justify-center text-white hover:bg-[#B5685A] transition-colors">
              <Camera size={12} strokeWidth={1.5} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a1a1a]">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-xs text-[#888] mt-1">Member since {user?.joinedDate}</p>
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="text-xs text-[#4A7E96] hover:text-[#B5685A] transition-colors mt-2 block">
              Change photo
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className={labelClass}>First Name</label>
            <input type="text" name="firstName" value={profile.firstName}
              onChange={handleProfileChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input type="text" name="lastName" value={profile.lastName}
              onChange={handleProfileChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" value={profile.email}
              onChange={handleProfileChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" name="phone" value={profile.phone}
              onChange={handleProfileChange} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit"
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Save Changes
          </button>
          {profileSaved && (
            <div className="flex items-center gap-2 text-[#4A7E96] text-sm">
              <CheckCircle size={16} strokeWidth={1.5} />
              Profile updated!
            </div>
          )}
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordSave} className="bg-white border border-[#e8e8e8] p-6 md:p-8">
        <h2 className="text-lg font-medium text-[#1a1a1a] mb-6 pb-4 border-b border-[#e8e8e8]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Change Password
        </h2>

        <div className="flex flex-col gap-5 max-w-md">
          {[
            { label: "Current Password", key: "current", name: "current" },
            { label: "New Password", key: "newPass", name: "newPass" },
            { label: "Confirm New Password", key: "confirm", name: "confirm" },
          ].map(field => (
            <div key={field.key}>
              <label className={labelClass}>{field.label}</label>
              <div className="relative">
                <input
                  type={showPasswords[field.key] ? "text" : "password"}
                  name={field.name}
                  value={passwords[field.key] || ""}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a] transition-colors">
                  {showPasswords[field.key]
                    ? <EyeOff size={15} strokeWidth={1.5} />
                    : <Eye size={15} strokeWidth={1.5} />
                  }
                </button>
              </div>
            </div>
          ))}

          {passwordError && (
            <p className="text-xs text-[#B5685A] bg-[#B5685A]/5 border border-[#B5685A]/20 px-4 py-3">
              {passwordError}
            </p>
          )}

          <div className="flex items-center gap-4">
            <button type="submit"
              className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#4A7E96] transition-all duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Update Password
            </button>
            {passwordSaved && (
              <div className="flex items-center gap-2 text-[#4A7E96] text-sm">
                <CheckCircle size={16} strokeWidth={1.5} />
                Password updated!
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-white border border-[#e8e8e8] p-6 md:p-8">
        <h2 className="text-lg font-medium text-[#B5685A] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Danger Zone
        </h2>
        <p className="text-sm text-[#888] mb-4 font-light">
          Once you delete your account all your data will be permanently removed.
        </p>
        <button
          className="border border-[#B5685A] text-[#B5685A] px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#B5685A] hover:text-white transition-all duration-300"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default DashboardProfile;