// Enugu State Administrative Data and Verified Public Projects Directory
// Coordinates: [longitude, latitude] for Mapbox

export const ENUGU_STATE_BOUNDS = [
  [6.85, 5.95], // Southwest coordinates
  [7.95, 7.15], // Northeast coordinates
];

export const ENUGU_CENTER = [7.45, 6.55]; // State geographic center

export const LGAS = [
  {
    id: "enugu-north",
    name: "Enugu North",
    hq: "Enugu",
    senatorialDistrict: "Enugu East",
    center: [7.4983, 6.4474],
    zoom: 12.8,
    summary: "Urban core hosting the state secretariat, commercial hubs, and historic government quarters.",
    stats: { projectsCount: 3, totalBudget: "₦14.2B" },
    communities: [
      { name: "Independence Layout", coords: [7.5021, 6.4389], ward: "Ward 1" },
      { name: "GRA Enugu", coords: [7.4912, 6.4561], ward: "Ward 2" },
      { name: "Ogbete & Market", coords: [7.4812, 6.4312], ward: "Ward 3" },
      { name: "Asata", coords: [7.4965, 6.4412], ward: "Ward 4" },
      { name: "Coal Camp", coords: [7.4762, 6.4251], ward: "Ward 5" }
    ]
  },
  {
    id: "enugu-south",
    name: "Enugu South",
    hq: "Uwani",
    senatorialDistrict: "Enugu East",
    center: [7.5135, 6.4182],
    zoom: 12.8,
    summary: "Commercial and residential zone comprising Uwani, Achara Layout, and Awkunanaw.",
    stats: { projectsCount: 2, totalBudget: "₦8.5B" },
    communities: [
      { name: "Uwani Central", coords: [7.5135, 6.4182], ward: "Uwani West" },
      { name: "Achara Layout", coords: [7.5212, 6.4089], ward: "Achara Ward" },
      { name: "Amechi Awkunanaw", coords: [7.5342, 6.3891], ward: "Amechi Ward" },
      { name: "Obeagu", coords: [7.5451, 6.3721], ward: "Obeagu Ward" },
      { name: "Gariki", coords: [7.5281, 6.3982], ward: "Gariki Ward" }
    ]
  },
  {
    id: "enugu-east",
    name: "Enugu East",
    hq: "Nkwo Nike",
    senatorialDistrict: "Enugu East",
    center: [7.5621, 6.4891],
    zoom: 12.5,
    summary: "Rapidly expanding metropolitan district, site of the New Enugu City development.",
    stats: { projectsCount: 2, totalBudget: "₦28.0B" },
    communities: [
      { name: "New Enugu City", coords: [7.5812, 6.5021], ward: "New City Reserve" },
      { name: "Abakpa Nike", coords: [7.5345, 6.4812], ward: "Abakpa Ward" },
      { name: "Emene", coords: [7.5712, 6.4689], ward: "Emene Ward" },
      { name: "Trans-Ekulu", coords: [7.5123, 6.4712], ward: "Trans-Ekulu Ward" },
      { name: "Ibagwa Nike", coords: [7.5912, 6.5214], ward: "Nike Ward" }
    ]
  },
  {
    id: "nsukka",
    name: "Nsukka",
    hq: "Nsukka",
    senatorialDistrict: "Enugu North",
    center: [7.3986, 6.8561],
    zoom: 12.5,
    summary: "Northern educational hub hosting the University of Nigeria, Nsukka, and major agricultural markets.",
    stats: { projectsCount: 2, totalBudget: "₦12.8B" },
    communities: [
      { name: "Nsukka Urban", coords: [7.3986, 6.8561], ward: "Urban Ward" },
      { name: "Ihe / Owerre", coords: [7.4121, 6.8645], ward: "Ihe Ward" },
      { name: "Eha-Alumona", coords: [7.4421, 6.8412], ward: "Eha-Alumona Ward" },
      { name: "Obukpa", coords: [7.3621, 6.8845], ward: "Obukpa Ward" },
      { name: "Alor-Uno", coords: [7.3712, 6.9023], ward: "Alor-Uno Ward" },
      { name: "Ede-Oballa", coords: [7.4312, 6.8214], ward: "Ede-Oballa Ward" }
    ]
  },
  {
    id: "udi",
    name: "Udi",
    hq: "Udi",
    senatorialDistrict: "Enugu West",
    center: [7.3824, 6.3218],
    zoom: 12,
    summary: "Centrally located with rich heritage, undulating hills, and key road transport corridors.",
    stats: { projectsCount: 2, totalBudget: "₦6.7B" },
    communities: [
      { name: "9th Mile Corner", coords: [7.4123, 6.4234], ward: "Ngwo Corridor" },
      { name: "Udi Town", coords: [7.3824, 6.3218], ward: "Udi Urban" },
      { name: "Ngwo", coords: [7.4321, 6.4389], ward: "Ngwo Asaa" },
      { name: "Eke", coords: [7.3512, 6.4312], ward: "Eke Ward" },
      { name: "Abia", coords: [7.3912, 6.3512], ward: "Abia Ward" }
    ]
  },
  {
    id: "ezeagu",
    name: "Ezeagu",
    hq: "Aguobu-Owa",
    senatorialDistrict: "Enugu West",
    center: [7.2145, 6.3872],
    zoom: 12,
    summary: "Agricultural and eco-tourism heartland featuring caves, waterfalls, and agro-colleges.",
    stats: { projectsCount: 2, totalBudget: "₦5.4B" },
    communities: [
      { name: "Aguobu-Owa", coords: [7.2145, 6.3872], ward: "Aguobu-Owa Ward" },
      { name: "Iwollo", coords: [7.2812, 6.4214], ward: "Iwollo Ward" },
      { name: "Olo", coords: [7.2023, 6.4612], ward: "Olo Ward" },
      { name: "Obinofia Ndiuno", coords: [7.2412, 6.3512], ward: "Obinofia Ward" }
    ]
  },
  {
    id: "nkanu-east",
    name: "Nkanu East",
    hq: "Amagunze",
    senatorialDistrict: "Enugu East",
    center: [7.6892, 6.3456],
    zoom: 11.8,
    summary: "Vast agrarian Local Government Area and pioneer host of the Enugu Smart Green School initiative at Owo.",
    stats: { projectsCount: 2, totalBudget: "₦7.2B" },
    communities: [
      { name: "Owo", coords: [7.6521, 6.3689], ward: "Owo Ward" },
      { name: "Amagunze", coords: [7.6892, 6.3456], ward: "Amagunze Ward" },
      { name: "Nara Unateze", coords: [7.7214, 6.2812], ward: "Nara Ward" },
      { name: "Nkerefi", coords: [7.7812, 6.2145], ward: "Nkerefi Ward" }
    ]
  },
  {
    id: "nkanu-west",
    name: "Nkanu West",
    hq: "Agbani",
    senatorialDistrict: "Enugu East",
    center: [7.5342, 6.3129],
    zoom: 12,
    summary: "Educational and legal hub hosting the Nigerian Law School Augustine Nnamani Campus, Agbani.",
    stats: { projectsCount: 2, totalBudget: "₦4.1B" },
    communities: [
      { name: "Agbani Town", coords: [7.5342, 6.3129], ward: "Agbani Ward" },
      { name: "Akpugo", coords: [7.5612, 6.3412], ward: "Akpugo Ward" },
      { name: "Ozalla", coords: [7.5112, 6.3312], ward: "Ozalla Ward" }
    ]
  },
  {
    id: "oji-river",
    name: "Oji River",
    hq: "Oji River",
    senatorialDistrict: "Enugu West",
    center: [7.2721, 6.2573],
    zoom: 12,
    summary: "Crossroads town with thermal power history, leprosy treatment centre, and police college.",
    stats: { projectsCount: 2, totalBudget: "₦3.9B" },
    communities: [
      { name: "Oji Urban", coords: [7.2654, 6.2612], ward: "Oji Urban Ward" },
      { name: "Achi", coords: [7.3212, 6.2145], ward: "Achi Ward" },
      { name: "Inyi", coords: [7.2412, 6.2012], ward: "Inyi Ward" }
    ]
  },
  {
    id: "awgu",
    name: "Awgu",
    hq: "Awgu",
    senatorialDistrict: "Enugu West",
    center: [7.4789, 6.0712],
    zoom: 11.8,
    summary: "Scenic hilly southern Local Government Area, host to the NYSC Permanent Orientation Camp and agrarian communities.",
    stats: { projectsCount: 2, totalBudget: "₦5.1B" },
    communities: [
      { name: "Awgu Urban", coords: [7.4812, 6.0689], ward: "Awgu Central" },
      { name: "Mgbowo", coords: [7.4612, 6.0912], ward: "Mgbowo Ward" },
      { name: "Agbogugu", coords: [7.5112, 6.1312], ward: "Agbogugu Ward" }
    ]
  },
  {
    id: "aninri",
    name: "Aninri",
    hq: "Ndeaboh",
    senatorialDistrict: "Enugu West",
    center: [7.5891, 6.0234],
    zoom: 11.8,
    summary: "Fertile agricultural hub renowned for high-yield rice, cassava, and yam production.",
    stats: { projectsCount: 2, totalBudget: "₦3.2B" },
    communities: [
      { name: "Ndeaboh", coords: [7.5891, 6.0234], ward: "Ndeaboh Ward" },
      { name: "Oduma", coords: [7.6212, 6.0512], ward: "Oduma Ward" },
      { name: "Mpu", coords: [7.6312, 6.0012], ward: "Mpu Ward" }
    ]
  },
  {
    id: "udenu",
    name: "Udenu",
    hq: "Obollo-Afor",
    senatorialDistrict: "Enugu North",
    center: [7.5023, 6.9142],
    zoom: 12,
    summary: "Gateway interstate commercial hub with Obollo-Afor international market and border connections.",
    stats: { projectsCount: 2, totalBudget: "₦6.3B" },
    communities: [
      { name: "Obollo-Afor", coords: [7.5145, 6.9234], ward: "Obollo Central" },
      { name: "Orba", coords: [7.4612, 6.8912], ward: "Orba Ward" },
      { name: "Amalla", coords: [7.5512, 6.9612], ward: "Amalla Ward" }
    ]
  },
  {
    id: "igbo-etiti",
    name: "Igbo-Etiti",
    hq: "Ogbede",
    senatorialDistrict: "Enugu North",
    center: [7.3712, 6.7123],
    zoom: 12,
    summary: "Bridge Local Government Area between Enugu metropolis and Nsukka urban, prominent for ceramics and agriculture.",
    stats: { projectsCount: 2, totalBudget: "₦3.6B" },
    communities: [
      { name: "Ogbede", coords: [7.3712, 6.7123], ward: "Ogbede Ward" },
      { name: "Aku", coords: [7.3412, 6.7412], ward: "Aku Ward" },
      { name: "Ukehe", coords: [7.3912, 6.6712], ward: "Ukehe Ward" }
    ]
  },
  {
    id: "igbo-eze-north",
    name: "Igbo-Eze North",
    hq: "Enugu-Ezike",
    senatorialDistrict: "Enugu North",
    center: [7.4523, 7.0123],
    zoom: 12,
    summary: "Densely populated northern territory bordering Benue and Kogi States with famous palm wine.",
    stats: { projectsCount: 2, totalBudget: "₦4.8B" },
    communities: [
      { name: "Enugu-Ezike", coords: [7.4523, 7.0123], ward: "Ezike Central" },
      { name: "Umuida", coords: [7.4612, 7.0312], ward: "Umuida Ward" },
      { name: "Ogrute", coords: [7.4412, 7.0012], ward: "Ogrute Ward" }
    ]
  },
  {
    id: "igbo-eze-south",
    name: "Igbo-Eze South",
    hq: "Ibagwa-Aka",
    senatorialDistrict: "Enugu North",
    center: [7.3512, 6.9621],
    zoom: 12,
    summary: "Commercial and agrarian hub centered around Ibagwa-Aka and surrounding farm communities.",
    stats: { projectsCount: 2, totalBudget: "₦3.1B" },
    communities: [
      { name: "Ibagwa-Aka", coords: [7.3512, 6.9621], ward: "Ibagwa Ward" },
      { name: "Alor-Agu", coords: [7.3812, 6.9812], ward: "Alor-Agu Ward" },
      { name: "Ovoko", coords: [7.3612, 6.9312], ward: "Ovoko Ward" }
    ]
  },
  {
    id: "isi-uzo",
    name: "Isi-Uzo",
    hq: "Ikem",
    senatorialDistrict: "Enugu East",
    center: [7.7123, 6.7823],
    zoom: 11.5,
    summary: "Eastern borderland rich in limestone deposits, cash crops, and rural road expansion projects.",
    stats: { projectsCount: 2, totalBudget: "₦4.5B" },
    communities: [
      { name: "Ikem", coords: [7.7123, 6.7823], ward: "Ikem Ward" },
      { name: "Eha-Amufu", coords: [7.7612, 6.6612], ward: "Eha-Amufu Ward" },
      { name: "Mbu", coords: [7.6412, 6.7712], ward: "Mbu Ward" }
    ]
  },
  {
    id: "uzo-uwani",
    name: "Uzo-Uwani",
    hq: "Umulokpa",
    senatorialDistrict: "Enugu North",
    center: [7.1023, 6.7812],
    zoom: 11.5,
    summary: "The state's largest landmass, home to the massive Adani Rice Irrigation Valley projects.",
    stats: { projectsCount: 2, totalBudget: "₦8.9B" },
    communities: [
      { name: "Adani", coords: [7.0214, 6.7412], ward: "Adani Ward" },
      { name: "Umulokpa", coords: [7.1023, 6.7812], ward: "Umulokpa Ward" },
      { name: "Nimbo", coords: [7.1412, 6.8412], ward: "Nimbo Ward" }
    ]
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
    contractor: "Enugu Basic Education Board (ENSPEB)",
    sourceDocument: "Enugu State Approved 2024 Capital Budget, Head 428B, Sub-head 12",
    description: "State-of-the-art interactive smart school equipped with fiber broadband, solar mini-grid, robotics lab, digital smartboards, and modern sanitation.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920314/1H1A0613_omzzpx.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920311/1H1A0610_ymtx2w.jpg"
    ],
    gapNote: "Operational guidelines released; third-party performance audit scheduled for Q3 2026."
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
    sourceDocument: "Ministry of Works & Infrastructure Medium Term Framework 2024-2026",
    description: "Dual 8-lane arterial expressway, underground storm drainage, ducting for 5G telecommunication networks, and high-voltage transmission lines spanning 10,000 hectares.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920983/DJI_0205_fzaesv.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920981/DJI_0204_f0bes4.jpg"
    ],
    gapNote: "Interim contractor payment certificates verified; Phase 1 asphalt laying is 68% complete."
  },
  {
    id: "prj-003",
    title: "9th Mile 24/7 Water Scheme Expansion",
    category: "Water & Utilities",
    lgaId: "udi",
    lgaName: "Udi",
    ward: "9th Mile Corridor",
    coordinates: [7.4123, 6.4234],
    status: "Completed",
    budget: "₦3,800,000,000",
    contractor: "FordMarx Hydro Company Ltd",
    sourceDocument: "Enugu State Water Corporation Revitalization Gazette Vol. 33",
    description: "Installation of heavy-duty solar-powered industrial submersible pumps delivering 70 million liters daily from the 9th Mile aquifer into metropolitan reservoirs.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921814/images_15_wmerk3.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921812/images_16_pope7k.jpg"
    ],
    gapNote: "Primary trunk line pressure tests certified; neighborhood reticulation ongoing."
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
    description: "Smart 25-classroom block featuring STEM interactive hardware, automated weather station, and clean water treatment facility.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920308/1H1A0612_csqmtw.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920303/1H1A0607_w3lfam.jpg"
    ],
    gapNote: "Civil works complete; deployment of computer terminals and solar battery banks in progress."
  },
  {
    id: "prj-005",
    title: "Type-2 Primary Healthcare Center Eha-Alumona",
    category: "Healthcare",
    lgaId: "nsukka",
    lgaName: "Nsukka",
    ward: "Eha-Alumona Ward",
    coordinates: [7.4421, 6.8412],
    status: "Completed",
    budget: "₦265,000,000",
    contractor: "Enugu Primary Healthcare Development Agency (ENPHCDA)",
    sourceDocument: "State Healthcare Revitalization Directive 2025/HQ",
    description: "20-bed maternal and infant care facility with solar cold-chain vaccine storage, diagnostic lab, staff quarters, and emergency dispatch.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920837/DJI_0850_vkbqqw.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920831/DJI_0448_zg3tef.jpg"
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
    contractor: "Ministry of Culture & Tourism / Special Projects",
    sourceDocument: "Approved Supplementary Budget 2024, Schedule IV",
    description: "Rehabilitation and total completion of the landmark 3,000-seater auditorium, exhibition halls, VIP meeting rooms, and cultural pavilion.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794646807/images_1_avzcvi.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921329/images_2_umulem.jpg"
    ],
    gapNote: "Structural audit and fire safety certification verified in January 2026."
  },
  {
    id: "prj-007",
    title: "Adani Rice Modern Irrigation & Processing Cluster",
    category: "Agriculture",
    lgaId: "uzo-uwani",
    lgaName: "Uzo-Uwani",
    ward: "Adani Ward",
    coordinates: [7.0214, 6.7412],
    status: "Ongoing",
    budget: "₦4,500,000,000",
    contractor: "Agro-Industrial Development Corp with AFEX",
    sourceDocument: "Enugu Agricultural Transformation Policy Paper (2024)",
    description: "Canal desilting, center-pivot irrigation systems, and construction of automated 100-ton daily parboiling and milling plant.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921604/images_12_sgidya.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921602/images_13_pieejp.jpg"
    ],
    gapNote: "Canal dredging 85% completed; milling machinery awaiting site electrical hookup."
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
    description: "Equipped with ultrasound imaging, solar power backup, labor ward, and digital record indexing.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920824/DJI_0853_pmi1uw.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920821/DJI_0449_u7pif9.jpg"
    ],
    gapNote: "Records show full staff deployment; solar battery inspection log current."
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
    sourceDocument: "Rural Access and Agricultural Marketing Project (RAAMP) Records",
    description: "14.2km asphalt road construction with concrete side drains and retaining walls along steep gradient terrain.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920983/DJI_0205_fzaesv.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920981/DJI_0204_f0bes4.jpg"
    ],
    gapNote: "Final engineering sign-off obtained; contractor maintenance warranty active."
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
    description: "Dedicated learning center catering to special needs with speech therapy suites and vocational workshops.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920291/1H1A0604_sjipva.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920276/1H1A0597_ywmt2d.jpg"
    ],
    gapNote: "Roofing and plastering complete; specialized equipment procurement underway."
  },
  {
    id: "prj-011",
    title: "Iwollo Agro-Entrepreneurship Facility",
    category: "Agriculture & Training",
    lgaId: "ezeagu",
    lgaName: "Ezeagu",
    ward: "Iwollo Ward",
    coordinates: [7.2812, 6.4214],
    status: "Completed",
    budget: "₦650,000,000",
    contractor: "Ministry of Agriculture and Agro-Allied Industrialization",
    sourceDocument: "State Agro-College Revitalization Plan 2024",
    description: "Greenhouses, drip-irrigation training fields, poultry demonstration hatcheries, and food processing laboratory.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921601/images_14_gctolf.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921604/images_12_sgidya.jpg"
    ],
    gapNote: "First cohort of 250 youth trainees graduated in April 2026."
  },
  {
    id: "prj-012",
    title: "Agbani Smart Green School",
    category: "Education",
    lgaId: "nkanu-west",
    lgaName: "Nkanu West",
    ward: "Agbani Ward",
    coordinates: [7.5342, 6.3129],
    status: "Ongoing",
    budget: "₦1,120,000,000",
    contractor: "Enugu State Universal Basic Education Board",
    sourceDocument: "SUBEB Capital Projects Directory 2025",
    description: "25-classroom smart model block with solar power, computerized coding laboratory, and recreation fields.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920275/1H1A0598_sslsws.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920274/1H1A0614_cqporn.jpg"
    ],
    gapNote: "Foundation and structural pillars completed; roofing work active."
  },
  {
    id: "prj-013",
    title: "Achara Layout Primary Health Reconstruction",
    category: "Healthcare",
    lgaId: "enugu-south",
    lgaName: "Enugu South",
    ward: "Achara Ward",
    coordinates: [7.5212, 6.4089],
    status: "Completed",
    budget: "₦210,000,000",
    contractor: "ENPHCDA & Local Council",
    sourceDocument: "Urban Health Infrastructure Scorecard 2025",
    description: "Upgraded outpatient clinic with maternal ward, emergency treatment room, and 24-hour solar lighting.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920686/homeoverviewimage-arbcmmkd_1_w3naaq.png",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920837/DJI_0850_vkbqqw.jpg"
    ],
    gapNote: "Commissioned and active; serving over 1,500 monthly patient visits."
  },
  {
    id: "prj-014",
    title: "Ndeaboh-Oduma Rice Valley Link Road",
    category: "Road Infrastructure",
    lgaId: "aninri",
    lgaName: "Aninri",
    ward: "Ndeaboh Ward",
    coordinates: [7.5891, 6.0234],
    status: "Completed",
    budget: "₦1,750,000,000",
    contractor: "CGC Nigeria Ltd",
    sourceDocument: "Ministry of Works Feeder Roads Initiative 2024",
    description: "11.8km paved asphalt road linking farming clusters directly with the major interstate transport corridor.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920981/DJI_0204_f0bes4.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920983/DJI_0205_fzaesv.jpg"
    ],
    gapNote: "Drainage inspection completed; post-rainy season pavement audit certified."
  },
  {
    id: "prj-015",
    title: "Enugu-Ezike Model Primary Healthcare Centre",
    category: "Healthcare",
    lgaId: "igbo-eze-north",
    lgaName: "Igbo-Eze North",
    ward: "Ezike Central",
    coordinates: [7.4523, 7.0123],
    status: "Completed",
    budget: "₦240,000,000",
    contractor: "Enugu Primary Healthcare Development Agency",
    sourceDocument: "Northern District Healthcare Investment Schedule 2025",
    description: "Full maternal clinic, solar vaccine refrigeration, pharmacy dispensary, and ambulance dispatch point.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920824/DJI_0853_pmi1uw.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920831/DJI_0448_zg3tef.jpg"
    ],
    gapNote: "Full medical staff deployed and verified by State Ministry of Health."
  },
  {
    id: "prj-016",
    title: "Ikem-Eha-Amufu Agro-Transport Highway",
    category: "Road Infrastructure",
    lgaId: "isi-uzo",
    lgaName: "Isi-Uzo",
    ward: "Ikem Ward",
    coordinates: [7.7123, 6.7823],
    status: "Ongoing",
    budget: "₦3,200,000,000",
    contractor: "China Civil Engineering Construction Corporation (CCECC)",
    sourceDocument: "Eastern Corridor Infrastructure Development Bill 2024",
    description: "Rehabilitation and total asphalt surfacing of the critical 18km commercial link road connecting farming communities.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920983/DJI_0205_fzaesv.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921325/images_4_fhwyrf.jpg"
    ],
    gapNote: "Earthworks and culvert construction completed; binder course laying underway."
  },
  {
    id: "prj-017",
    title: "Ogbede-Aku Rural Electricity Mini-Grid",
    category: "Water & Utilities",
    lgaId: "igbo-etiti",
    lgaName: "Igbo-Etiti",
    ward: "Ogbede Ward",
    coordinates: [7.3712, 6.7123],
    status: "Completed",
    budget: "₦420,000,000",
    contractor: "Enugu State Rural Electrification Board",
    sourceDocument: "Clean Energy Transition Gazette 2025",
    description: "500kW hybrid solar mini-grid supplying uninterrupted power to local markets, schools, and cottage processing facilities.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921811/images_17_szvqth.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794921814/images_15_wmerk3.jpg"
    ],
    gapNote: "Operational metering installed; power distribution active across 450 households."
  },
  {
    id: "prj-018",
    title: "Ibagwa-Aka Maternal and Child Clinic",
    category: "Healthcare",
    lgaId: "igbo-eze-south",
    lgaName: "Igbo-Eze South",
    ward: "Ibagwa Ward",
    coordinates: [7.3512, 6.9621],
    status: "Completed",
    budget: "₦225,000,000",
    contractor: "ENPHCDA & Community Development Union",
    sourceDocument: "Primary Healthcare Facilities Directory 2025",
    description: "Comprehensive maternal healthcare unit, pediatric immunizations, solar water borehole, and clean delivery rooms.",
    images: [
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920821/DJI_0449_u7pif9.jpg",
      "https://res.cloudinary.com/zl99z5t1/image/upload/v1794920837/DJI_0850_vkbqqw.jpg"
    ],
    gapNote: "Fully certified by State Ministry of Health; weekly antenatal clinic schedule active."
  }
];

// Local photographs supplied for the AskEnugu gallery. The source folder did
// not identify a project for each file, so these are initially distributed in
// project order and can be adjusted when the project-photo mapping is confirmed.
const LOCAL_PROJECT_GALLERIES = {
  "prj-001": ["/gallery/1H1A0596.JPG", "/gallery/1H1A0597.JPG"],
  "prj-002": ["/gallery/1H1A0598.JPG", "/gallery/1H1A0599.JPG"],
  "prj-003": ["/gallery/1H1A0603.JPG", "/gallery/1H1A0604.JPG"],
  "prj-004": ["/gallery/1H1A0606.JPG", "/gallery/1H1A0607.JPG"],
  "prj-005": ["/gallery/1H1A0610.JPG", "/gallery/1H1A0611.JPG"],
  "prj-006": ["/gallery/1H1A0612.JPG", "/gallery/1H1A0613.JPG"],
  "prj-007": ["/gallery/1H1A0614.JPG", "/gallery/DJI_0032.JPG"],
  "prj-008": ["/gallery/DJI_0040.JPG", "/gallery/DJI_0140 - Copy.JPG"],
  "prj-009": ["/gallery/DJI_0140.JPG", "/gallery/DJI_0144 - Copy.JPG"],
  "prj-010": ["/gallery/DJI_0149 - Copy.JPG", "/gallery/DJI_0201.JPG"],
  "prj-011": ["/gallery/DJI_0202.JPG", "/gallery/DJI_0203.JPG"],
  "prj-012": ["/gallery/DJI_0204.JPG"],
  "prj-013": ["/gallery/DJI_0205.JPG"],
  "prj-014": ["/gallery/DJI_0208.JPG"],
  "prj-015": ["/gallery/174A6340.jpg"],
  "prj-016": ["/gallery/174A6341.jpg"],
  "prj-017": ["/gallery/174A6362.jpg"],
  "prj-018": ["/gallery/174A6449.jpg"],
};

PROJECTS.forEach((project) => {
  project.images = LOCAL_PROJECT_GALLERIES[project.id] || project.images;
});
