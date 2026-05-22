import { Language, EducationArticle, ClinicResource, TriageStep } from "./types";

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" }
];

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: "mat-1",
    category: "maternal",
    title: "Maternal Protection & Warning Signs",
    subtitle: "Essential milestones and warning signs during pregnancy and childbirth.",
    summary: "- Attend at least 4 antenatal care visits starting in first trimester.\n- Note red flags: Vaginal bleeding, severe headache, swelling of hands/face, or decreased infant kicks.\n- Stay clean, eat iron-rich foods (green leaves, beans) and take folic acid pills daily.\n- Arrange clean delivery kit & transport plan beforehand.",
    fullContent: `Antenatal care is crucial to a healthy pregnancy. Community health guidelines recommend preparing a 'birth plan' well in advance, which includes saving money, arranging emergency transport, and identifying a skilled birth attendant. 

### Essential Pregnancy Guidelines:
1. **Nutrition:** Increase food intake; eat diverse foods like beans, green vegetables, millet, and eggs. Take daily iron and folic acid supplements.
2. **Preventative Measures:** Sleep under a treated mosquito net to protect against malaria (malaria in pregnancy increases risk of anemia and miscarriage). Take intermittent preventative therapy for malaria (IPTp) when prescribed at the clinic.
3. **Hygiene:** Bathe regularly, wash hands frequently, and ensure access to clean toilet facilities.

### Heavy Red Flags (Seek Clinic Immediately):
- **Vaginal bleeding** of any amount during pregnancy.
- **Severe headache** or blurry vision (signs of high blood pressure / pre-eclampsia).
- **Severe abdominal pain**.
- **Swelling** of the hands, face, or ankles.
- **Decreased movement** of the baby in the womb.
- **High fever** or shivering.`,
    precautions: [
      "Never take traditional herbs or self-medicate without consulting a health post.",
      "Vaginal bleeding of any volume is an emergency. Do not wait."
    ],
    offlineAvailable: true
  },
  {
    id: "mat-2",
    category: "maternal",
    title: "Infant Nutrition & Breastfeeding",
    subtitle: "Complete guide to exclusive breastfeeding and introduction to solid foods.",
    summary: "- Initiate breastfeeding within the first 1 hour after birth.\n- Give breast milk ONLY (exclusive breastfeeding) for the first 6 months. No water, tea, or herbs needed.\n- Feed on demand (at least 8-12 times a day, day and night).\n- Introduce healthy soft mashed foods after 6 months (millet porridge, eggs, avocado) while continuing breastfeeding.",
    fullContent: `Breast milk is the perfect food for newborn babies, containing active immunities that protect children from pneumonia, diarrhea, and other childhood infections.

### Core Practices:
1. **Colostrum:** Ensure the newborn receives the first thick yellow milk (colostrum). It acts as the child's very first vaccine.
2. **Exclusive feeding (0-6 months):** Do not give water, glucose, formula, or herbal baby tea. Breast milk is 88% water and provides everything a baby needs.
3. **Introduction to Solids (after 6 months):** Introduce multi-nutrient purees such as mashed bananas, fortified pumpkin-pap mixed with groundnut paste, or soft eggs. Introduce one food at a time, and continue breastfeeding up to 2 years.`,
    precautions: [
      "Avoid feeding sugar-sweetened baby foods or diluted starch water.",
      "Wash baby spoons, bowls, and your hands with boiled water and soap before every meal."
    ],
    offlineAvailable: true
  },
  {
    id: "inf-1",
    category: "infectious",
    title: "Malaria Prevention & Safe Care",
    subtitle: "How to protect your family from mosquito bites and when to test for fever.",
    summary: "- Sleep under a long-lasting insecticide-treated net (LLITN) every single night.\n- Eliminate stagnant pools of water near the home where mosquitoes lay eggs.\n- If a child develops a fever: test for Malaria immediately at a health center (using a Rapid Diagnostic Test).\n- Complete the full course of ACT medicine as prescribed, even if fever goes away.",
    fullContent: `Malaria remains a leading cause of childhood illness. It is spread by female Anopheles mosquitoes that bite primarily at night.

### Prevention Keys:
- **Net usage:** Always hang treated mosquito nets. Ensure there are no holes and tuck the edges under the sleeping mat or mattress.
- **Larval control:** Clean clogged gutters, drain puddles, and keep bushes cleared within 10 meters of the living quarters.
- **Insect repellent:** Use local safe repellents, light mosquito coils carefully, or wear long-sleeve shirts.

### Treatment Protocol:
- If a child has a fever, act fast. Delaying treatment past 24 hours can cause severe malaria (convulsions, anemia, coma).
- Take the child to the dispensary for an RDT (Rapid Diagnostic Test). If positive, obtain Artemisinin-based Combination Therapy (ACT). Give the full dosage (usually 3 days) even if the child starts feeling energetic.`,
    precautions: [
      "Do not give paracetamol alone to mask a fever without checking for malaria first.",
      "Traditional body scars or purging are harmful interventions. Seek verified medicines."
    ],
    offlineAvailable: true
  },
  {
    id: "inf-2",
    category: "infectious",
    title: "Waterborne Diseases & Cholera Triage",
    subtitle: "Understanding symptoms of cholera, acute diarrhea, and dehydration relief.",
    summary: "- Wash hands with soap and water after using the toilet and before preparing food.\n- Drink BOILED or chlorinated water only.\n- Triage: Cholera causes painless 'rice-water' watery stools. Dehydration kills rapid.\n- First response: Start feeding Oral Rehydration Salts (ORS) and Zinc pills immediately while traveling to the health post.",
    fullContent: `Waterborne infections (Cholera, Typhoid, Dysentery) are caused by drinking water contaminated with human feces. Sudden cholera outbreaks can drain a body of fluids within hours, causing fatal dehydration.

### Prevention Routines:
1. **Safe Drinks:** Use the 'Boil, Filter, Chlorinate' method. Boil water till it rolls, or add 1-2 drops of household bleach per liter of water and wait 30 minutes.
2. **Sanitation:** Dispose of baby feces safely in a pit latrine. Keep toilets clean and fly-free.
3. **The Three-Pot Settling Method:** If water is muddy, let it settle in Pot 1 (24 hours), pour clear water into Pot 2 (wait 24 hours), then pour into Pot 3. Mud and parasites sink.

### Sudden Dehydration Indicators in Children:
- Sunken eyes.
- Dry mouth and tongue.
- Pinch test: Skin on tummy when pinched takes more than 2 seconds to go flat.
- Lethargy, listlessness, or refusal to drink fluids.`,
    precautions: [
      "Do not withhold breastfeeding or food during diarrhea; feed light soft foods.",
      "Do not take self-prescribed strong antibiotics without medical tests."
    ],
    offlineAvailable: true
  },
  {
    id: "fa-1",
    category: "first-aid",
    title: "Severe Bleeding & Shock Relief",
    subtitle: "Immediate battlefield-proven actions to arrest severe external bleeding.",
    summary: "- Apply hard direct pressure over the bleeding wound using a clean cloth.\n- Elevate the bleeding limb above the level of the heart.\n- If blood soaks through, do NOT remove the first cloth—add another on top and press harder.\n- Lay patient flat on their back with feet raised slightly to prevent shock. Keep warm.",
    fullContent: `Severe hemorrhage is a life-threatening emergency. Quick bystander action can preserve life before professional medical transport arrives.

### Urgent Interventions:
1. **Direct Pressure:** Put a clean compress (a wrapped fabric or cloth) directly over the tear. Push down firmly with both hands.
2. **Pressure Bandage:** Wrap a second cloth or bandage tightly to hold pressure.
3. **Shock Care:** If patient has cold skin, rapid heart rate, or looks pale:
   - Keep them lying flat on a mat.
   - Raise their legs slightly about 30 cm using cushions or folded clothes.
   - Cover them with a dry blanket to maintain core warmth.
   - Do NOT give them water to drink if they are semi-conscious or require surgery.`,
    precautions: [
      "Do NOT apply raw dirt, heavy cow dung, or irritating leaves to open wounds to stop bleeding.",
      "Do NOT remove a tourniquet once applied unless a qualified surgeon takes over."
    ],
    offlineAvailable: true
  },
  {
    id: "fa-2",
    category: "first-aid",
    title: "Poisoning & Venomous Snake Bites",
    subtitle: "Crucial local interventions for poisonous bites and accidental ingestions.",
    summary: "- For snake bites: Immobilize the bitten limb at or below heart level. Wrap firmly (not too tight).\n- Clean wound with clean water. DO NOT cut the wound, suck out venom, or apply tourinquets.\n- Keep patient calm to prevent venom from circulating fast. Transport to a center with antivenom.\n- If poison is swallowed: DO NOT force vomiting. Urgently carry the bottle of poison to the clinic.",
    fullContent: `Venomous bites are prevalent in agricultural communities. Panic and incorrect traditional practices frequently lead to amputations or fatal outcomes.

### What to DO for Snake Bites:
1. Ensure the patient is sitting or lying down entirely still. Motion increases venom travel.
2. Wash the bite gently with clean water and soap.
3. Apply a broad pressure bandage along the entire bitten arm or leg (compressing like a sprain bandage). This slows lymphatic venom transit.
4. Transport immediately to the referral hospital.

### What NOT to Do (Highly Dangerous traditional acts):
- **DO NOT** make cuts over the bite mark to scrape blood. This leads to severe infections and gangrene.
- **DO NOT** use your mouth to suck out venom.
- **DO NOT** apply tight rubber tourniquets that stop pulse.
- **DO NOT** apply 'black stones' or local herbs.`,
    precautions: [
      "Never tie a tight cord above the bite that suffocates the limb. It destroys healthy tissue.",
      "Do not attempt to catch or kill the snake if it exposes you to secondary bites. Just describe it."
    ],
    offlineAvailable: true
  },
  {
    id: "san-1",
    category: "sanitation",
    title: "Sanitation & Household Hygiene",
    subtitle: "Low-cost methods to clean drinking water and prevent contamination.",
    summary: "- Prepare DIY Chlorine Safe Water: Add 1 cap of regular chlorine bleach per 20 liters of river water.\n- Build a Tippy-Tap: DIY foot-leverage washing station using a plastic jerrycan, rope, and wood.\n- Keep household waste, animals, and toilets at least 30 meters away from wells/rivers.\n- Cover all food pots to shield them from flies who carry diarrhea bacilli on their legs.",
    fullContent: `Many health problems arise from improper hand hygiene and contaminated open water sources. Simple physical interventions protect children against recurrent worm infections and parasitic intestinal illnesses.

### Implementing a Tippy Tap (Zero Cost Hygiene):
A Tippy Tap is a hands-free washing device using local materials:
1. A 5-liter clean plastic jug is suspended by a rope on a horizontal stick supported by two vertical branches.
2. A separate rope links the neck of the jug to a foot pedal branch on the ground.
3. Stepping on the pedal tilts the jug, releasing a small stream of water.
4. Bar soap hangs beside the tap on a string protected by a tin can shell.
This utilizes 90% less water than typical pouring, maintains soapy sterility, and avoids hand contact with the tap!

### Securing Safe Springs:
- Clear debris within 15 meters of wells.
- Ensure community latrines are built downhill from shallow water tables.
- Sun-dry clean kitchen cups on raised wooden racks ('dish racks') rather than flat on the dirt.`,
    precautions: [
      "Muddy river water must be settled first before chemical bleach disinfection.",
      "Wash hands BEFORE eating, BEFORE breastfeeding, and AFTER cleaning a child's bottom."
    ],
    offlineAvailable: true
  }
];

// 100% Client-Side / Offline Symptom screening flow dictionary.
// Branching logic starting from 'root'.
export const TRIAGE_FLOW: Record<string, TriageStep> = {
  "root": {
    id: "root",
    question: "Select the primary category of symptoms you or the patient is experiencing:",
    yesNext: "fever_branch", // Wait, in the interactive UI we will let them choose. Let's make a checklist or guided flow.
    noNext: "respiratory_branch"
  },
  // Pediatric Fever / Malaria Triage
  "peds_fever_start": {
    id: "peds_fever_start",
    question: "Is the patient under 3 months of age with a high fever (hot body)?",
    yesNext: "red", // Emergency under 3 months
    noNext: "peds_fever_convulsion"
  },
  "peds_fever_convulsion": {
    id: "peds_fever_convulsion",
    question: "Has the child experienced fits, convulsions, unusual shaking, or loss of consciousness?",
    yesNext: "red", // Severe Malaria / Meningitis indicators
    noNext: "peds_fever_drinking"
  },
  "peds_fever_drinking": {
    id: "peds_fever_drinking",
    question: "Is the child unable to drink, breastfeed, or vomiting everything they try to put in?",
    yesNext: "red",
    noNext: "peds_fever_breathing"
  },
  "peds_fever_breathing": {
    id: "peds_fever_breathing",
    question: "Is the child breathing much faster than usual, or is there an in-drawing of the lower chest?",
    yesNext: "red", // Pneumonia threat
    noNext: "peds_fever_stiff_neck"
  },
  "peds_fever_stiff_neck": {
    id: "peds_fever_stiff_neck",
    question: "Is the neck stiff, or is the patient sensitive to light and extremely sluggish?",
    yesNext: "red", // Meningitis threat
    noNext: "peds_fever_duration"
  },
  "peds_fever_duration": {
    id: "peds_fever_duration",
    question: "Has the fever lasted for more than 48 hours, or is it combined with yellow eyes/skin?",
    yesNext: "yellow", // Malaria / Hepatitis indicator needing professional clinical testing
    noNext: "peds_fever_mild"
  },
  "peds_fever_mild": {
    id: "peds_fever_mild",
    question: "Any runny nose, mild cough, but child remains playing and drinking okay?",
    yesNext: "green", // Home care management first, screen at health post if persistent
    noNext: "yellow"
  },

  // Diarrhea & Dehydration Triage
  "diarrhea_start": {
    id: "diarrhea_start",
    question: "Is the patient passing very frequent watery stools that look like rice-water?",
    yesNext: "red", // Cholera concern
    noNext: "diarrhea_blood"
  },
  "diarrhea_blood": {
    id: "diarrhea_blood",
    question: "Is there visible blood or dark mucus in the stool (Dysentery signs)?",
    yesNext: "red", // Dysentery needs clinic antibiotics
    noNext: "diarrhea_dehydration"
  },
  "diarrhea_dehydration": {
    id: "diarrhea_dehydration",
    question: "Are there signs of severe dehydration: sunken eyes, extreme dry tongue, or pinched tummy skin stays wrinkled for >2 seconds?",
    yesNext: "red", // Immediate IV fluids required
    noNext: "diarrhea_vomit"
  },
  "diarrhea_vomit": {
    id: "diarrhea_vomit",
    question: "Has vomiting persisted for more than 24 hours rendering ORS intake impossible?",
    yesNext: "red",
    noNext: "diarrhea_duration"
  },
  "diarrhea_duration": {
    id: "diarrhea_duration",
    question: "Has diarrhea lasted more than 5 days, or has the child looked increasingly weak/lethargic?",
    yesNext: "yellow",
    noNext: "diarrhea_home"
  },
  "diarrhea_home": {
    id: "diarrhea_home",
    question: "Is the patient alert, able to take liquids, with normal skin bounce?",
    yesNext: "green", // Safe home care with intensive home-prep ORS and Zinc
    noNext: "yellow"
  },

  // Cough & Respiratory Triage
  "resp_start": {
    id: "resp_start",
    question: "Is the patient experiencing heavy chest pain or severe gasping / struggling to draw breath?",
    yesNext: "red",
    noNext: "resp_grunting"
  },
  "resp_grunting": {
    id: "resp_grunting",
    question: "In pediatric child, is there audible grunting, or is the nostrils flaring open wide with each breath?",
    yesNext: "red",
    noNext: "resp_speed"
  },
  "resp_speed": {
    id: "resp_speed",
    question: "Check breath rate per minute: Is it >50 breaths/min for baby (2-11 mos) or >40 breaths/min for child (1-5 yrs)?",
    yesNext: "red", // Pneumonia criteria
    noNext: "resp_fever"
  },
  "resp_fever": {
    id: "resp_fever",
    question: "Is the cough accompanied by a deep fever, chest crackles, or rusty/bloody spit?",
    yesNext: "yellow",
    noNext: "resp_duration"
  },
  "resp_duration": {
    id: "resp_duration",
    question: "Has the cough persisted for more than 2 weeks, or is the patient experiencing unexplained weight loss/night sweats?",
    yesNext: "yellow", // Possible TB or Chronic illness
    noNext: "resp_home"
  },
  "resp_home": {
    id: "resp_home",
    question: "Is it mostly a dry ticklish cough or mild cold with no fever or breathing effort?",
    yesNext: "green", // Maintain hydration, steam inhalation, monitor closely
    noNext: "yellow"
  }
};

export const CLINICS: ClinicResource[] = [
  {
    id: "cli-1",
    name: "Kisumu Rural Dispensary",
    type: "dispensary",
    distanceKm: 2.4,
    travelTimeMin: { walking: 30, bicycle: 12, motorcycle: 5 },
    district: "Kisumu West",
    openHours: "Mon-Fri: 08:00 - 16:30",
    contactNumber: "+254 712 345 678",
    services: [
      "Malaria Rapid Diagnostic Tests (RDT)",
      "Essential Medicines Dispensing (ACT, ORS)",
      "Child Immunizations",
      "Antenatal Checkups"
    ],
    stockLevel: {
      malariaPills: "High",
      orsPackets: "High",
      vaccines: "Medium",
      antibiotics: "Low"
    },
    coordinates: { x: 35, y: 40 }
  },
  {
    id: "cli-2",
    name: "Khayelitsha Community Health Post",
    type: "primary-health-center",
    distanceKm: 5.1,
    travelTimeMin: { walking: 65, bicycle: 25, motorcycle: 10 },
    district: "Metro East",
    openHours: "Daily: 07:00 - 19:00",
    contactNumber: "+27 21 360 1122",
    services: [
      "Primary Care Consultation",
      "Maternity Ward & Skilled Midwifery",
      "Tuberculosis Treatment Support",
      "HIV Counseling & Antiretroviral Care",
      "Clean Water Sanitation Training"
    ],
    stockLevel: {
      malariaPills: "High",
      orsPackets: "High",
      vaccines: "High",
      antibiotics: "High"
    },
    coordinates: { x: 60, y: 55 }
  },
  {
    id: "cli-3",
    name: "Obalende Maternal & Child Clinic",
    type: "primary-health-center",
    distanceKm: 1.2,
    travelTimeMin: { walking: 15, bicycle: 6, motorcycle: 3 },
    district: "Lagos Island",
    openHours: "24/7 (Emergency Maternity Only) / Gen: 08:00-17:00",
    contactNumber: "+234 1 293 8844",
    services: [
      "Prenatal and Postnatal Delivery Care",
      "Emergency Obstetric Services",
      "Neonatal Support",
      "Family Planning",
      "Infant Dehydration Ward"
    ],
    stockLevel: {
      malariaPills: "Medium",
      orsPackets: "High",
      vaccines: "High",
      antibiotics: "Medium"
    },
    coordinates: { x: 20, y: 25 }
  },
  {
    id: "cli-4",
    name: "Mbarara District General Referral Hospital",
    type: "referral-hospital",
    distanceKm: 14.8,
    travelTimeMin: { walking: 180, bicycle: 75, motorcycle: 25 },
    district: "Mbarara Central",
    openHours: "24 Hours / 7 Days",
    contactNumber: "+256 485 20023",
    services: [
      "Inpatient Surgery & Intensive Care",
      "Complex Fever & Dehydration Admission",
      "Advanced Pediatric Ward",
      "Laboratory testing & Imaging",
      "Antivenom & Blood Transfusions"
    ],
    stockLevel: {
      malariaPills: "High",
      orsPackets: "High",
      vaccines: "High",
      antibiotics: "High"
    },
    coordinates: { x: 80, y: 75 }
  }
];
