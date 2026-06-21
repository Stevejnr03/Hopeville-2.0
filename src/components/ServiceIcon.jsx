function ServiceIcon({ slug, size = 40, color = "#4A7E96" }) {
  const icons = {
    "complete-eye-health-diagnostics": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Eye with scan lines */}
        <ellipse cx="20" cy="20" rx="16" ry="10" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="20" r="5" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="20" r="2" fill={color}/>
        {/* Scan lines */}
        <line x1="4" y1="14" x2="36" y2="14" stroke={color} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.5"/>
        <line x1="4" y1="20" x2="36" y2="20" stroke={color} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.5"/>
        <line x1="4" y1="26" x2="36" y2="26" stroke={color} strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.5"/>
        {/* Corner brackets */}
        <path d="M4 10 L4 4 L10 4" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M30 4 L36 4 L36 10" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M4 30 L4 36 L10 36" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M30 36 L36 36 L36 30" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),

    "cataract-glaucoma-management": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Eye */}
        <ellipse cx="20" cy="20" rx="15" ry="9" stroke={color} strokeWidth="1.5" fill="none"/>
        {/* Lens/cataract representation - cloudy circle */}
        <circle cx="20" cy="20" r="6" stroke={color} strokeWidth="1.5" fill="none"/>
        <path d="M16 17 Q20 14 24 17" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.6"/>
        <path d="M15 20 Q20 23 25 20" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.6"/>
        {/* Pressure arrows around eye */}
        <path d="M6 16 L3 14 L6 12" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M34 16 L37 14 L34 12" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Medical cross */}
        <rect x="17" y="30" width="6" height="1.5" rx="0.5" fill={color}/>
        <rect x="19.25" y="28" width="1.5" height="6" rx="0.5" fill={color}/>
      </svg>
    ),

    "diabetic-hypertensive-vision-care": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Eye base */}
        <ellipse cx="20" cy="18" rx="14" ry="8" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="18" r="4" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="18" r="1.5" fill={color}/>
        {/* Blood vessel / heartbeat line */}
        <path d="M4 30 L8 30 L10 26 L13 34 L16 28 L18 30 L22 30 L24 26 L27 34 L30 28 L32 30 L36 30"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),

    "retinal-evaluation": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Eye outline */}
        <ellipse cx="20" cy="20" rx="15" ry="9" stroke={color} strokeWidth="1.5" fill="none"/>
        {/* Retina - detailed iris pattern */}
        <circle cx="20" cy="20" r="7" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="20" r="3.5" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.6"/>
        <circle cx="20" cy="20" r="1.5" fill={color}/>
        {/* Radiating lines from pupil - retinal vessels */}
        <line x1="20" y1="13" x2="20" y2="16.5" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="20" y1="23.5" x2="20" y2="27" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="13" y1="20" x2="16.5" y2="20" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="23.5" y1="20" x2="27" y2="20" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="15.1" y1="15.1" x2="17.5" y2="17.5" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="22.5" y1="22.5" x2="24.9" y2="24.9" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="24.9" y1="15.1" x2="22.5" y2="17.5" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="17.5" y1="22.5" x2="15.1" y2="24.9" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        {/* Magnifier */}
        <circle cx="32" cy="32" r="5" stroke={color} strokeWidth="1.5" fill="none"/>
        <line x1="35.5" y1="35.5" x2="38" y2="38" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),

    "digital-eye-health": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Monitor */}
        <rect x="4" y="6" width="32" height="22" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
        {/* Screen content - eye */}
        <ellipse cx="20" cy="17" rx="8" ry="5" stroke={color} strokeWidth="1.2" fill="none"/>
        <circle cx="20" cy="17" r="2.5" stroke={color} strokeWidth="1.2" fill="none"/>
        <circle cx="20" cy="17" r="1" fill={color}/>
        {/* Blue light rays */}
        <line x1="12" y1="10" x2="10" y2="7" stroke={color} strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round"/>
        <line x1="20" y1="9" x2="20" y2="6" stroke={color} strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round"/>
        <line x1="28" y1="10" x2="30" y2="7" stroke={color} strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round"/>
        {/* Stand */}
        <line x1="20" y1="28" x2="20" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="14" y1="34" x2="26" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),

    "dry-eye-clinic": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Eye */}
        <ellipse cx="20" cy="18" rx="14" ry="8" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="18" r="4.5" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="18" r="1.8" fill={color}/>
        {/* Tear drop */}
        <path d="M28 26 C28 26 25 22 25 24.5 C25 26.4 26.3 28 28 28 C29.7 28 31 26.4 31 24.5 C31 22 28 26 28 26Z"
          stroke={color} strokeWidth="1.2" fill="none"/>
        {/* Dryness cracks */}
        <path d="M8 16 L11 18 L9 21" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 20 L13 19" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" strokeLinecap="round"/>
      </svg>
    ),

    "nutrition-ocular-therapeutics": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Eye */}
        <ellipse cx="20" cy="16" rx="13" ry="8" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="16" r="4" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="20" cy="16" r="1.5" fill={color}/>
        {/* Leaf/nutrition element */}
        <path d="M12 28 C12 28 14 22 20 24 C26 26 28 32 28 32"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M12 28 C15 30 20 24 28 32"
          stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" strokeLinecap="round"/>
        {/* Molecule dots */}
        <circle cx="8" cy="26" r="2" stroke={color} strokeWidth="1.2" fill="none"/>
        <circle cx="32" cy="26" r="2" stroke={color} strokeWidth="1.2" fill="none"/>
        <line x1="10" y1="26" x2="12" y2="27" stroke={color} strokeWidth="1" strokeOpacity="0.6"/>
        <line x1="28" y1="30" x2="30" y2="28" stroke={color} strokeWidth="1" strokeOpacity="0.6"/>
      </svg>
    ),

    "geriatric-pediatric-vision-care": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Adult figure */}
        <circle cx="26" cy="8" r="4" stroke={color} strokeWidth="1.5" fill="none"/>
        <path d="M22 14 C22 14 20 20 20 24 L32 24 C32 20 30 14 30 14 Z"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <line x1="20" y1="24" x2="22" y2="32" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="32" y1="24" x2="30" y2="32" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        {/* Child figure */}
        <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" fill="none"/>
        <path d="M9 15 C9 15 8 20 8 23 L16 23 C16 20 15 15 15 15 Z"
          stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <line x1="8" y1="23" x2="9" y2="30" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="23" x2="15" y2="30" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        {/* Eye between them */}
        <ellipse cx="19" cy="36" rx="5" ry="3" stroke={color} strokeWidth="1.2" fill="none"/>
        <circle cx="19" cy="36" r="1.2" fill={color}/>
      </svg>
    ),

    "luxury-eyewear-optical-services": (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glasses frame */}
        <circle cx="13" cy="22" r="8" stroke={color} strokeWidth="1.5" fill="none"/>
        <circle cx="27" cy="22" r="8" stroke={color} strokeWidth="1.5" fill="none"/>
        {/* Bridge */}
        <line x1="21" y1="22" x2="19" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        {/* Arms/temples */}
        <line x1="5" y1="22" x2="2" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="35" y1="22" x2="38" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        {/* Lens shine - luxury touch */}
        <path d="M9 17 Q11 15 14 16" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" strokeLinecap="round"/>
        <path d="M23 17 Q25 15 28 16" stroke={color} strokeWidth="1" fill="none" strokeOpacity="0.5" strokeLinecap="round"/>
        {/* Diamond accent */}
        <path d="M20 8 L22 11 L20 14 L18 11 Z" stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return icons[slug] || (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="1.5" fill="none"/>
      <ellipse cx="20" cy="20" rx="10" ry="6" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="20" cy="20" r="3" fill={color}/>
    </svg>
  );
}

export default ServiceIcon;