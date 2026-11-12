// Enugu State Administrative Data and Verified Public Projects Directory
// Coordinates: [longitude, latitude] for Mapbox

export const ENUGU_STATE_BOUNDS = [
  [6.85, 5.95], // Southwest coordinates
  [7.95, 7.15], // Northeast coordinates
];

export const ENUGU_CENTER = [7.51, 6.44]; // Enugu City Center

export const LGAS = [
  {
    id: "enugu-north",
    name: "Enugu North",
    hq: "Enugu",
    senatorialDistrict: "Enugu East",
    center: [7.4983, 6.4474],
    zoom: 12.5,
    summary: "Urban core hosting the state secretariat, commercial hubs, and historic government quarters.",
    stats: { projectsCount: 4, totalBudget: "₦14.2B" }
  },
  {
    id: "enugu-south",
    name: "Enugu South",
    hq: "Uwani",
    senatorialDistrict: "Enugu East",
    center: [7.5135, 6.4182],
    zoom: 12.5,
    summary: "Commercial and residential zone comprising Uwani, Achara Layout, and Awkunanaw.",
    stats: { projectsCount: 3, totalBudget: "₦8.5B" }
  },
  {
    id: "enugu-east",
    name: "Enugu East",
    hq: "Nkwo Nike",
    senatorialDistrict: "Enugu East",
    center: [7.5621, 6.4891],
    zoom: 12,
    summary: "Rapidly expanding metropolitan district, site of the New Enugu City development.",
    stats: { projectsCount: 4, totalBudget: "₦28.0B" }
  },
  {
    id: "nsukka",
    name: "Nsukka",
    hq: "Nsukka",
    senatorialDistrict: "Enugu North",
    center: [7.3986, 6.8561],
    zoom: 12,
    summary: "Northern educational hub hosting the University of Nigeria, Nsukka, and major agricultural markets.",
    stats: { projectsCount: 4, totalBudget: "₦12.8B" }
  },
  {
    id: "udi",
    name: "Udi",
    hq: "Udi",
    senatorialDistrict: "Enugu West",
    center: [7.3824, 6.3218],
    zoom: 11.5,
    summary: "Centrally located with rich heritage, undulating hills, and key road transport corridors.",
    stats: { projectsCount: 3, totalBudget: "₦6.7B" }
  },
  {
    id: "ezeagu",
    name: "Ezeagu",
    hq: "Aguobu-Owa",
    senatorialDistrict: "Enugu West",
    center: [7.2145, 6.3872],
    zoom: 11,
    summary: "Agricultural and eco-tourism heartland featuring caves, waterfalls, and agro-colleges.",
    stats: { projectsCount: 3, totalBudget: "₦5.4B" }
  },
  {
    id: "nkanu-east",
    name: "Nkanu East",
    hq: "Amagunze",
    senatorialDistrict: "Enugu East",
    center: [7.6892, 6.3456],
    zoom: 11,
    summary: "Vast agrarian LGA and pioneer host of the Enugu Smart Green School initiative at Owo.",
    stats: { projectsCount: 3, totalBudget: "₦7.2B" }
  },
  {
    id: "nkanu-west",
    name: "Nkanu West",
    hq: "Agbani",
    senatorialDistrict: "Enugu East",
    center: [7.5342, 6.3129],
    zoom: 11.5,
    summary: "Educational and legal hub hosting the Nigerian Law School Augustine Nnamani Campus, Agbani.",
    stats: { projectsCount: 2, totalBudget: "₦4.1B" }
  },
  {
    id: "oji-river",
    name: "Oji River",
    hq: "Oji River",
    senatorialDistrict: "Enugu West",
    center: [7.2721, 6.2573],
    zoom: 11.5,
    summary: "Crossroads town with thermal power history, leprosy treatment centre, and police college.",
    stats: { projectsCount: 2, totalBudget: "₦3.9B" }
  },
  {
    id: "awgu",
    name: "Awgu",
    hq: "Awgu",
    senatorialDistrict: "Enugu West",
    center: [7.4789, 6.0712],
    zoom: 11,
    summary: "Scenic hilly southern LGA, host to the NYSC Permanent Orientation Camp and agrarian communities.",
    stats: { projectsCount: 3, totalBudget: "₦5.1B" }
  },
  {
    id: "aninri",
    name: "Aninri",
    hq: "Ndeaboh",
    senatorialDistrict: "Enugu West",
    center: [7.5891, 6.0234],
    zoom: 11,
    summary: "Fertile agricultural hub renowned for high-yield rice, cassava, and yam production.",
    stats: { projectsCount: 2, totalBudget: "₦3.2B" }
  },
  {
    id: "udenu",
    name: "Udenu",
    hq: "Obollo-Afor",
    senatorialDistrict: "Enugu North",
    center: [7.5023, 6.9142],
    zoom: 11.5,
    summary: "Gateway interstate commercial hub with Obollo-Afor international market and border connections.",
    stats: { projectsCount: 3, totalBudget: "₦6.3B" }
  },
  {
    id: "igbo-etiti",
    name: "Igbo-Etiti",
    hq: "Ogbede",
    senatorialDistrict: "Enugu North",
    center: [7.3712, 6.7123],
    zoom: 11.5,
    summary: "Bridge LGA between Enugu metropolis and Nsukka urban, prominent for ceramics and agriculture.",
    stats: { projectsCount: 2, totalBudget: "₦3.6B" }
  },
  {
    id: "igbo-eze-north",
    name: "Igbo-Eze North",
    hq: "Enugu-Ezike",
    senatorialDistrict: "Enugu North",
    center: [7.4523, 7.0123],
    zoom: 11.5,
    summary: "Densely populated northern territory bordering Benue and Kogi States with famous palm wine.",
    stats: { projectsCount: 3, totalBudget: "₦4.8B" }
  },
  {
    id: "igbo-eze-south",
    name: "Igbo-Eze South",
    hq: "Ibagwa-Aka",
    senatorialDistrict: "Enugu North",
    center: [7.3512, 6.9621],
    zoom: 11.5,
    summary: "Commercial and agrarian hub centered around Ibagwa-Aka and surrounding farm communities.",
    stats: { projectsCount: 2, totalBudget: "₦3.1B" }
  },
  {
    id: "isi-uzo",
    name: "Isi-Uzo",
    hq: "Ikem",
    senatorialDistrict: "Enugu East",
    center: [7.7123, 6.7823],
    zoom: 11,
    summary: "Eastern borderland rich in limestone deposits, cash crops, and rural road expansion projects.",
    stats: { projectsCount: 2, totalBudget: "₦4.5B" }
  },
  {
    id: "uzo-uwani",
    name: "Uzo-Uwani",
    hq: "Umulokpa",
    senatorialDistrict: "Enugu North",
    center: [7.1023, 6.7812],
    zoom: 11,
    summary: "The state's largest landmass, home to the massive Adani Rice Irrigation Valley projects.",
    stats: { projectsCount: 3, totalBudget: "₦8.9B" }
  }
];

export const PROJECTS = [
  {
    id: "prj-001",
    title: "Flagship Smart Green School Model",
    category: "Education",
    lgaId: "nkanu-east",
    lgaName: "Nkanu East",
    ward: "Owo Ward",
    coordinates: [7.6521, 6.3689],
    status: "Completed",
    budget: "₦1,250,000,000",
    contractor: "Enugu Basic Education Board (ENSPEB) / Design-Build Consortium",
    sourceDocument: "Enugu State Approved 2024 Capital Budget, Head 428B, Sub-head 12",
    description: "State-of-the-art interactive smart school equipped with fiber broadband, solar mini-grid, robotics lab, digital smartboards, and sanitation facilities for early childhood to basic 9.",
    images: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Operational guidelines released; third-party academic performance evaluation report is scheduled for Q3 2026."
  },
  {
    id: "prj-002",
    title: "New Enugu City Infrastructure Phase 1",
    category: "Urban Infrastructure",
    lgaId: "enugu-east",
    lgaName: "Enugu East",
    ward: "Nike Agro / New City Reserve",
    coordinates: [7.5812, 6.5021],
    status: "Ongoing",
    budget: "₦18,400,000,000",
    contractor: "China Communication Construction Company (CCCC)",
    sourceDocument: "Ministry of Works & Infrastructure Medium Term Expenditure Framework 2024-2026",
    description: "Dual 8-lane arterial expressway, underground storm drainage, ducting for 5G telecommunication networks, and high-voltage transmission lines spanning 10,000 hectares.",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Interim contractor payment certificates verified; Phase 1 asphalt laying is 68% complete according to May 2026 Ministry bulletin."
  },
  {
    id: "prj-003",
    title: "9th Mile 24/7 Water Scheme Expansion",
    category: "Water & Utilities",
    lgaId: "ezeagu",
    lgaName: "Ezeagu / Udi Corridor",
    ward: "Aguobu-Owa / 9th Mile Basin",
    coordinates: [7.2845, 6.3989],
    status: "Completed",
    budget: "₦3,800,000,000",
    contractor: "FordMarx Hydro Company Ltd",
    sourceDocument: "Enugu State Water Corporation Revitalization Gazette Vol. 33",
    description: "Installation of heavy-duty solar-powered industrial submersible pumps delivering 70 million liters daily from the 9th Mile aquifer into the metropolitan reservoirs.",
    images: [
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Primary trunk line pressure tests certified; neighborhood reticulation in Uwani and Independence Layout ongoing."
  },
  {
    id: "prj-004",
    title: "Nsukka Smart Green School Model",
    category: "Education",
    lgaId: "nsukka",
    lgaName: "Nsukka",
    ward: "Ihe / Owerre Ward",
    coordinates: [7.4121, 6.8645],
    status: "Ongoing",
    budget: "₦1,180,000,000",
    contractor: "State Universal Basic Education Board (SUBEB)",
    sourceDocument: "2024 Education Sector Performance Scorecard, Item 88",
    description: "Smart 25-classroom block featuring STEM interactive hardware, automated weather recording station, and clean water treatment facility.",
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Civil works complete; deployment of computer terminals and solar battery banks in progress."
  },
  {
    id: "prj-005",
    title: "Type-2 Primary Healthcare Center",
    category: "Healthcare",
    lgaId: "nsukka",
    lgaName: "Nsukka",
    ward: "Eha-Alumona Ward",
    coordinates: [7.4421, 6.8412],
    status: "Completed",
    budget: "₦265,000,000",
    contractor: "Enugu Primary Healthcare Development Agency (ENPHCDA)",
    sourceDocument: "State Healthcare Revitalization Directive 2025/HQ",
    description: "20-bed maternal and infant care facility with solar cold-chain vaccine storage, diagnostic lab, staff quarters, and emergency ambulance dispatch.",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Facility certified operational; pharmacy inventory restocking schedule is published monthly."
  },
  {
    id: "prj-006",
    title: "International Conference Centre (ICC) Completion",
    category: "Commerce & Tourism",
    lgaId: "enugu-north",
    lgaName: "Enugu North",
    ward: "Independence Layout",
    coordinates: [7.5021, 6.4389],
    status: "Completed",
    budget: "₦6,200,000,000",
    contractor: "Enugu Ministry of Culture & Tourism / Special Projects",
    sourceDocument: "Approved Supplementary Budget 2024, Schedule IV",
    description: "Rehabilitation and total completion of the landmark 3,000-seater auditorium, exhibition halls, VIP meeting rooms, and landscaped cultural pavilion.",
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Structural audit and fire safety certification verified by the State Fire Service in January 2026."
  },
  {
    id: "prj-007",
    title: "Adani Rice Farm Modern Irrigation & Processing Cluster",
    category: "Agriculture",
    lgaId: "uzo-uwani",
    lgaName: "Uzo-Uwani",
    ward: "Adani Ward",
    coordinates: [7.0214, 6.7412],
    status: "Ongoing",
    budget: "₦4,500,000,000",
    contractor: "Agro-Industrial Development Corp in partnership with AFEX",
    sourceDocument: "Enugu Agricultural Transformation Policy Paper (2024)",
    description: "Canal desilting, installation of center-pivot irrigation systems, and construction of automated 100-ton daily parboiling and milling plant for smallholder farmers.",
    images: [
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Canal dredging 85% completed; machinery installation is awaiting final clearance at the port."
  },
  {
    id: "prj-008",
    title: "Type-2 Primary Healthcare Center Obollo-Afor",
    category: "Healthcare",
    lgaId: "udenu",
    lgaName: "Udenu",
    ward: "Obollo-Afor Central",
    coordinates: [7.5145, 6.9234],
    status: "Completed",
    budget: "₦280,000,000",
    contractor: "ENPHCDA & Local Government Council",
    sourceDocument: "Primary Healthcare Facilities Directory 2025",
    description: "Equipped with ultrasound imaging, solar backup, labor ward, and digital patient record indexing.",
    images: [
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Records show full staff deployment; solar inverter battery inspection log current through August 2026."
  },
  {
    id: "prj-009",
    title: "Awgu Hilly Ring-Road Asphalt Paving",
    category: "Road Infrastructure",
    lgaId: "awgu",
    lgaName: "Awgu",
    ward: "Awgu Urban / Ugwuleshi",
    coordinates: [7.4812, 6.0689],
    status: "Completed",
    budget: "₦2,150,000,000",
    contractor: "IDC Construction Nigeria Ltd",
    sourceDocument: "State Rural Access and Agricultural Marketing Project (RAAMP) Records",
    description: "14.2km asphalt road construction with concrete side drains and retaining walls along steep gradient terrain.",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Final engineering sign-off obtained; contractor maintenance warranty expires December 2027."
  },
  {
    id: "prj-010",
    title: "Oji River Special Education & Diagnostic Academy",
    category: "Education",
    lgaId: "oji-river",
    lgaName: "Oji River",
    ward: "Oji Urban Ward",
    coordinates: [7.2654, 6.2612],
    status: "Ongoing",
    budget: "₦890,000,000",
    contractor: "Ministry of Children, Gender Affairs and Social Development",
    sourceDocument: "2025 Special Intervention Fund Allocation, Gazette No. 14",
    description: "Dedicated learning center catering to children with hearing, visual, and cognitive special needs, with speech therapy suites and vocational workshops.",
    images: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
    ],
    gapNote: "Roofing and plastering finished; specialized assistive technology procurement underway."
  }
];

