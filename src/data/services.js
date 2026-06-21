const services = [
  {
    id: 1,
    slug: "complete-eye-health-diagnostics",
    title: "Complete Eye Health Diagnostics",
    icon: "🔬",
    shortDesc: "Comprehensive evaluation of your overall eye health using state-of-the-art diagnostic technology.",
    heroDesc: "Our complete eye health diagnostic service is the foundation of everything we do at Hopeville Eye Clinic. Using the latest technology, we conduct a thorough assessment of your visual system to detect any underlying conditions early.",
    details: [
      {
        heading: "What It Involves",
        body: "A full diagnostic session includes visual acuity testing, intraocular pressure measurement, anterior and posterior segment evaluation, color vision assessment, and more. Our specialists take their time to understand your full ocular and medical history before beginning."
      },
      {
        heading: "Who It's For",
        body: "This service is suitable for all age groups — from children having their first eye examination to adults seeking routine check-ups or those experiencing visual discomfort. We recommend annual evaluations for optimal eye health."
      },
      {
        heading: "What to Expect",
        body: "Your appointment will last approximately 45 to 60 minutes. You may be asked to read letter charts, respond to light stimuli, and have your eyes dilated for a deeper look at the retina and optic nerve. Our team will walk you through every step."
      },
    ],
    benefits: [
      "Early detection of eye diseases",
      "Accurate prescription for glasses or contacts",
      "Baseline records for future comparisons",
      "Identification of systemic conditions like diabetes",
    ],
  },
  {
    id: 2,
    slug: "retinal-evaluation",
    title: "Retinal Evaluation",
    icon: "👁️",
    shortDesc: "Advanced imaging and assessment of the retina to detect and monitor conditions affecting your vision.",
    heroDesc: "The retina is one of the most vital parts of the eye, responsible for converting light into the signals your brain interprets as images. Our retinal evaluation service uses advanced imaging technology to assess the health of this critical structure.",
    details: [
      {
        heading: "What It Involves",
        body: "Retinal evaluation includes fundus photography, optical coherence tomography (OCT), and dilated fundus examination. These tools allow our specialists to capture detailed images of the retina, optic disc, macula, and surrounding blood vessels."
      },
      {
        heading: "Who It's For",
        body: "We recommend retinal evaluation for patients with diabetes, hypertension, a family history of macular degeneration, those experiencing floaters or flashes, and anyone over 40 years of age as a preventive measure."
      },
      {
        heading: "What to Expect",
        body: "The procedure is non-invasive and painless. Eye drops may be used to dilate your pupils for a more thorough view. You may experience mild light sensitivity afterward, so we recommend bringing sunglasses to your appointment."
      },
    ],
    benefits: [
      "Early detection of retinal diseases",
      "Monitoring of diabetic retinopathy",
      "Assessment of macular degeneration",
      "Non-invasive and highly accurate",
    ],
  },
  {
    id: 3,
    slug: "diabetic-hypertensive-vision-care",
    title: "Diabetic & Hypertensive Vision Care",
    icon: "🩺",
    shortDesc: "Specialized eye care for patients managing diabetes and hypertension to protect their long-term vision.",
    heroDesc: "Diabetes and hypertension are two of the leading causes of preventable blindness worldwide. At Hopeville Eye Clinic, we provide specialized monitoring and care for patients with these systemic conditions to protect their vision over the long term.",
    details: [
      {
        heading: "What It Involves",
        body: "We conduct regular diabetic eye screenings including retinal photography and OCT scans to monitor for diabetic retinopathy and hypertensive retinopathy. We work closely with your physician to coordinate your overall care plan."
      },
      {
        heading: "Who It's For",
        body: "Any patient diagnosed with Type 1 or Type 2 diabetes, pre-diabetes, or hypertension should have annual eye examinations. Children with diabetes should begin eye screenings as early as possible."
      },
      {
        heading: "What to Expect",
        body: "Your visit will include a review of your systemic health history, blood sugar levels if relevant, and a full retinal evaluation. We will provide a detailed report of findings and recommended follow-up intervals."
      },
    ],
    benefits: [
      "Prevention of diabetic blindness",
      "Early intervention before vision loss occurs",
      "Coordinated care with your physician",
      "Regular monitoring and follow-up",
    ],
  },
  {
    id: 4,
    slug: "cataract-glaucoma-management",
    title: "Cataract & Glaucoma Co-Management",
    icon: "⚕️",
    shortDesc: "Expert co-management of cataract and glaucoma conditions in collaboration with leading ophthalmologists.",
    heroDesc: "Cataracts and glaucoma are among the most common causes of vision impairment globally. Our co-management service ensures that patients receive seamless, coordinated care from diagnosis through treatment and recovery.",
    details: [
      {
        heading: "What It Involves",
        body: "We provide pre-operative and post-operative care for cataract surgery patients, as well as ongoing glaucoma monitoring including visual field testing, OCT of the optic nerve, and intraocular pressure management."
      },
      {
        heading: "Who It's For",
        body: "Patients diagnosed with cataracts causing significant visual impairment, those with elevated intraocular pressure, a family history of glaucoma, or those who have already been diagnosed with glaucoma."
      },
      {
        heading: "What to Expect",
        body: "Our team will work alongside your surgeon to ensure continuity of care. We handle all pre-surgical assessments and post-surgical follow-ups, providing detailed reports and monitoring your recovery closely."
      },
    ],
    benefits: [
      "Seamless surgical co-management",
      "Regular intraocular pressure monitoring",
      "Post-operative care and follow-up",
      "Collaborative approach with top surgeons",
    ],
  },
  {
    id: 5,
    slug: "digital-eye-health",
    title: "Digital Eye Health",
    icon: "💻",
    shortDesc: "Assessment and management of eye strain and discomfort caused by prolonged screen use.",
    heroDesc: "In today's digital world, most of us spend hours in front of screens every day. Digital Eye Strain — also known as Computer Vision Syndrome — is increasingly common. Our digital eye health service is designed to assess, manage, and prevent screen-related visual discomfort.",
    details: [
      {
        heading: "What It Involves",
        body: "We evaluate your visual ergonomics, assess for symptoms of digital eye strain such as dry eyes, headaches, blurred vision, and neck pain, and prescribe appropriate solutions including blue light filtering lenses and personalized screen habits."
      },
      {
        heading: "Who It's For",
        body: "Professionals, students, gamers, and anyone who spends more than 4 hours a day on screens. Children are particularly vulnerable and should be evaluated regularly."
      },
      {
        heading: "What to Expect",
        body: "You will undergo a comprehensive evaluation of your visual comfort at near and intermediate distances, a discussion of your screen habits, and receive tailored recommendations for lenses, lighting, and workstation setup."
      },
    ],
    benefits: [
      "Relief from eye strain and headaches",
      "Blue light protection solutions",
      "Improved screen productivity",
      "Healthy digital habits for children",
    ],
  },
  {
    id: 6,
    slug: "geriatric-pediatric-vision-care",
    title: "Geriatric & Pediatric Vision Care",
    icon: "👨‍👧",
    shortDesc: "Specialized vision care tailored to the unique needs of children and elderly patients.",
    heroDesc: "Vision care needs differ significantly across age groups. At Hopeville Eye Clinic, we provide specialized services for both our youngest and oldest patients, understanding the unique challenges and conditions common to each group.",
    details: [
      {
        heading: "Pediatric Vision Care",
        body: "Children's vision develops rapidly in the early years. We screen for amblyopia (lazy eye), strabismus (crossed eyes), refractive errors, and color vision deficiencies. Early detection is critical to preventing long-term vision problems."
      },
      {
        heading: "Geriatric Vision Care",
        body: "Older adults are at higher risk of conditions such as age-related macular degeneration, cataracts, glaucoma, and diabetic eye disease. We provide comprehensive monitoring and management tailored to the needs of senior patients."
      },
      {
        heading: "What to Expect",
        body: "Our team is trained to work with patients of all ages using child-friendly techniques for younger patients and patient, thorough evaluations for seniors. We communicate findings clearly to patients and caregivers alike."
      },
    ],
    benefits: [
      "Child-friendly examination techniques",
      "Early detection of amblyopia and strabismus",
      "Age-related disease monitoring for seniors",
      "Family-centered care approach",
    ],
  },
  {
    id: 7,
    slug: "dry-eye-clinic",
    title: "Dry Eye Clinic",
    icon: "💧",
    shortDesc: "Diagnosis and personalized treatment plans for chronic dry eye syndrome and related conditions.",
    heroDesc: "Dry Eye Syndrome is one of the most common and often under-diagnosed eye conditions. Our dedicated Dry Eye Clinic offers comprehensive evaluation and a range of treatment options to provide lasting relief and improve your quality of life.",
    details: [
      {
        heading: "What It Involves",
        body: "We use advanced diagnostic tools including tear film analysis, meibomian gland evaluation, and osmolarity testing to identify the root cause of your dry eye. Treatment plans are highly personalized and may include prescription drops, nutritional supplements, or in-clinic procedures."
      },
      {
        heading: "Who It's For",
        body: "Anyone experiencing persistent dryness, burning, grittiness, excessive tearing, or fluctuating vision. Risk factors include prolonged screen use, contact lens wear, certain medications, hormonal changes, and environmental factors."
      },
      {
        heading: "What to Expect",
        body: "Your first visit will include a detailed symptom assessment and a series of non-invasive diagnostic tests. We will develop a personalized treatment plan and schedule follow-up appointments to monitor your progress."
      },
    ],
    benefits: [
      "Accurate diagnosis of dry eye type",
      "Personalized treatment plans",
      "Relief from chronic discomfort",
      "Long-term management strategies",
    ],
  },
  {
    id: 8,
    slug: "nutrition-ocular-therapeutics",
    title: "Nutrition & Ocular Therapeutics",
    icon: "🥗",
    shortDesc: "Evidence-based nutritional guidance and therapeutic interventions to support and enhance eye health.",
    heroDesc: "What you eat has a profound impact on your eye health. Our Nutrition and Ocular Therapeutics service bridges the gap between diet and vision, offering evidence-based guidance to support long-term ocular wellness.",
    details: [
      {
        heading: "What It Involves",
        body: "We assess your dietary habits, lifestyle, and risk factors for nutrition-related eye conditions. We then provide personalized recommendations for foods, supplements, and therapeutic interventions that support optimal eye health."
      },
      {
        heading: "Who It's For",
        body: "Patients with or at risk of macular degeneration, diabetic retinopathy, dry eye syndrome, and cataracts benefit most from this service. It is also ideal for anyone seeking a proactive approach to maintaining their vision."
      },
      {
        heading: "What to Expect",
        body: "Your consultation will include a review of your medical history, current diet, and eye health status. You will leave with a clear, actionable nutrition plan and supplement recommendations tailored to your specific needs."
      },
    ],
    benefits: [
      "Personalized nutrition plans for eye health",
      "Evidence-based supplement guidance",
      "Prevention of nutrition-related eye disease",
      "Holistic approach to vision wellness",
    ],
  },
  {
    id: 9,
    slug: "luxury-eyewear-optical-services",
    title: "Luxury Eyewear & Optical Services",
    icon: "👓",
    shortDesc: "A curated collection of premium frames and lenses combined with expert optical fitting services.",
    heroDesc: "At Hopeville Eye Clinic, we believe your eyewear should be as unique as you are. Our luxury eyewear boutique offers a carefully curated selection of premium frames from the world's most prestigious optical brands, paired with expert fitting and lens consultation.",
    details: [
      {
        heading: "Our Collection",
        body: "We stock an exclusive range of frames from leading international brands including Essilor, Zeiss, Ray-Ban, and more. Whether you're looking for classic elegance, contemporary minimalism, or bold statement pieces, our collection has something for every taste."
      },
      {
        heading: "Expert Fitting & Consultation",
        body: "Our optical specialists will help you find the perfect frame for your face shape, lifestyle, and prescription. We take precise measurements to ensure optimal lens positioning and visual comfort."
      },
      {
        heading: "Premium Lens Technology",
        body: "We offer a full range of lens options including single vision, progressive, photochromic, anti-reflective, and blue light filtering lenses from leading manufacturers like Essilor and Zeiss."
      },
    ],
    benefits: [
      "Curated selection of luxury frames",
      "Expert face shape and lifestyle consultation",
      "Premium lens technology options",
      "Precise fitting and adjustments",
    ],
  },
];

export default services;