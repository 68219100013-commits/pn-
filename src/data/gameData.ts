import { Badge, CropInfo, Mission, QuizQuestion } from '../types';

export const CROPS_DATA: Record<string, CropInfo> = {
  morning_glory: {
    id: 'morning_glory',
    name: 'ผักบุ้งจีน',
    scientificName: 'Ipomoea aquatica',
    category: 'leafy',
    unlockLevel: 1,
    seedPrice: 5,
    sellPrice: 15,
    expReward: 25,
    growthDurationSeconds: 16,
    waterDemand: 0.8,
    fertilizerDemand: 0.6,
    icon: '🌱',
    stageEmojis: ['🌰', '🌱', '🌿', '🥬'],
    stageDescriptions: [
      'เมล็ดดูดซับน้ำและเริ่มแทงรากแรก',
      'ต้นกล้าแตกใบเลี้ยง 2 ใบแรก พร้อมเริ่มสังเคราะห์แสง',
      'แตกยอดใบเขียวสมบูรณ์ ลำต้นกลวงอวบน้ำ',
      'ผักบุ้งโตเต็มที่ กิ่งก้านกรอบสด พร้อมเก็บเกี่ยว!'
    ],
    scienceFact: 'ผักบุ้งจีนต้องการธาตุไนโตรเจน (N) สูงในการสร้างคลอโรฟิลล์เพื่อสังเคราะห์แสงและเร่งการเจริญเติบโตของลำต้นและใบ',
    idealFertilizer: 'N'
  },
  tomato: {
    id: 'tomato',
    name: 'มะเขือเทศเชอร์รี่',
    scientificName: 'Solanum lycopersicum var. cerasiforme',
    category: 'fruit',
    unlockLevel: 1,
    seedPrice: 10,
    sellPrice: 30,
    expReward: 45,
    growthDurationSeconds: 24,
    waterDemand: 0.7,
    fertilizerDemand: 0.8,
    icon: '🍅',
    stageEmojis: ['🌰', '🌱', '🌼', '🍅'],
    stageDescriptions: [
      'เมล็ดเล็กเริ่มบวมน้ำและแตกหน่อรากแก้ว',
      'ต้นกล้าเริ่มมีใบจริงที่มีกลิ่นเฉพาะตัว',
      'ต้นโตเต็มวัย ออกดอกสีเหลืองสวยงามเพื่อรอการผสมเกสร',
      'ผลมะเขือเทศสุกสีแดงสด อุดมด้วยไลโคปีนและวิตามินซี!'
    ],
    scienceFact: 'ระยะติดดอกและออกผลของมะเขือเทศต้องการธาตุฟอสฟอรัส (P) และโพแทสเซียม (K) เพื่อเร่งดอกและเพิ่มความหวานของผล',
    idealFertilizer: 'P'
  },
  corn: {
    id: 'corn',
    name: 'ข้าวโพดหวาน',
    scientificName: 'Zea mays var. saccharata',
    category: 'grain',
    unlockLevel: 2,
    seedPrice: 20,
    sellPrice: 55,
    expReward: 75,
    growthDurationSeconds: 32,
    waterDemand: 0.9,
    fertilizerDemand: 0.9,
    icon: '🌽',
    stageEmojis: ['🌰', '🌱', '🌾', '🌽'],
    stageDescriptions: [
      'เมล็ดข้าวโพดสีทองเริ่มแตกหน่อแทงยอดขึ้นสู่ผิวดิน',
      'ต้นกล้าลำต้นตั้งตรง ปล้องใบเริ่มขยายตัว',
      'ลำต้นสูงใหญ่ ผลิช่อดอกตัวผู้ที่ยอดและช่อไหมตัวเมียที่ซอกใบ',
      'ฝักข้าวโพดหวานเต็มฝัก เมล็ดเรียงตัวเต่งตึงสีเหลืองทอง!'
    ],
    scienceFact: 'ข้าวโพดเป็นพืช C4 ที่มีประสิทธิภาพการสังเคราะห์ด้วยแสงสูงมากในสภาพแดดจัดและอุณหภูมิอบอุ่น',
    idealFertilizer: 'K'
  },
  carrot: {
    id: 'carrot',
    name: 'แครอทสีส้ม',
    scientificName: 'Daucus carota subsp. sativus',
    category: 'root',
    unlockLevel: 2,
    seedPrice: 25,
    sellPrice: 65,
    expReward: 90,
    growthDurationSeconds: 28,
    waterDemand: 0.6,
    fertilizerDemand: 0.7,
    icon: '🥕',
    stageEmojis: ['🌰', '🌱', '🌿', '🥕'],
    stageDescriptions: [
      'เมล็ดเล็กยาวเริ่มดูดความชื้นในดินร่วน',
      'ยอดใบขนนกละเอียดสีเขียวเริ่มแตกขึ้นเหนือดิน',
      'รากแก้วใต้ดินเริ่มสะสมแป้งและเบตาแคโรทีนจนขยายใหญ่',
      'หัวแครอทสีส้มสดกรอบ อุดมด้วยวิตามินเอ พร้อมขุดเก็บเกี่ยว!'
    ],
    scienceFact: 'แครอทเป็นพืชหัวใต้ดิน ดินที่ปลูกต้องมีความร่วนซุยและระบายน้ำดี เพื่อให้รากแก้วขยายตัวตรงสวยงาม',
    idealFertilizer: 'K'
  },
  sunflower: {
    id: 'sunflower',
    name: 'ทานตะวันยิ้มแฉ่ง',
    scientificName: 'Helianthus annuus',
    category: 'flower',
    unlockLevel: 3,
    seedPrice: 35,
    sellPrice: 95,
    expReward: 130,
    growthDurationSeconds: 36,
    waterDemand: 0.7,
    fertilizerDemand: 0.8,
    icon: '🌻',
    stageEmojis: ['🌰', '🌱', '🌿', '🌻'],
    stageDescriptions: [
      'เมล็ดลายทางเปลือกแข็งแตกออกส่งรากหยั่งลึก',
      'ต้นกล้าหันใบตามทิศทางดวงอาทิตย์ (Heliotropism)',
      'ต้นสูงสง่า ดอกตูมเริ่มก่อรูปที่ยอดลำต้น',
      'ดอกทานตะวันสีเหลืองบานสะพรั่ง เมล็ดเต็มจานดอก!'
    ],
    scienceFact: 'ปรากฏการณ์ทานตะวันหันตามแสงอาทิตย์เกิดจากการทำงานของฮอร์โมนพืช "ออกซิน (Auxin)" ที่เคลื่อนไปสะสมด้านร่มเงา',
    idealFertilizer: 'P'
  },
  strawberry: {
    id: 'strawberry',
    name: 'สตรอว์เบอร์รีหวานฉ่ำ',
    scientificName: 'Fragaria × ananassa',
    category: 'fruit',
    unlockLevel: 4,
    seedPrice: 50,
    sellPrice: 150,
    expReward: 200,
    growthDurationSeconds: 42,
    waterDemand: 0.8,
    fertilizerDemand: 1.0,
    icon: '🍓',
    stageEmojis: ['🌰', '🌱', '🌸', '🍓'],
    stageDescriptions: [
      'เมล็ดจิ๋วบนผลเจริญงอกเป็นต้นอ่อนอย่างช้าๆ',
      'แตกกอใบ 3 แฉก และเริ่มแตกไหล (Runner) ขยายพันธุ์',
      'ผลิดอกสีขาวน่ารัก แมลงตัวน้อยช่วยผสมเกสร',
      'ผลสตรอว์เบอร์รีสีแดงฉ่ำหวาน กรุ่นกลิ่นหอมน่ารับประทาน!'
    ],
    scienceFact: 'ผลสตรอว์เบอร์รีที่เราทาน แท้จริงคือ "ฐานรองดอกที่ขยายตัว" ส่วนเม็ดเล็กๆ รอบผลคือผลแท้ (Achene)',
    idealFertilizer: 'organic'
  },
  rice: {
    id: 'rice',
    name: 'ข้าวหอมมะลิอินทรีย์',
    scientificName: 'Oryza sativa',
    category: 'grain',
    unlockLevel: 5,
    seedPrice: 80,
    sellPrice: 240,
    expReward: 320,
    growthDurationSeconds: 50,
    waterDemand: 1.0,
    fertilizerDemand: 0.9,
    icon: '🌾',
    stageEmojis: ['🌰', '🌱', '🌾', '🍚'],
    stageDescriptions: [
      'เมล็ดข้าวเปลือกแช่น้ำเริ่มงอกตุ่มรากและยอดอ่อน',
      'ต้นกล้าเขียวขจีในแปลง แตกกอแน่นและแข็งแรง',
      'ระยะตั้งท้องและออกรวง ดอกข้าวผสมเกสรตัวเองยามเช้า',
      'รวงข้าวสีทองสุกอร่าม กลิ่นหอมใบเตยธรรมชาติ พร้อมเกี่ยว!'
    ],
    scienceFact: 'กลิ่นหอมเฉพาะตัวของข้าวหอมมะลิเกิดจากสาร 2-Acetyl-1-pyrroline (2AP) ซึ่งพืชสร้างขึ้นในดินที่มีแร่ธาตุอุดมสมบูรณ์',
    idealFertilizer: 'organic'
  }
};

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'step_1_water',
    stepNumber: 1,
    title: 'ภารกิจที่ 1: ตักน้ำเตรียมรดแปลง',
    description: 'ไปที่หน้า "มินิเกม" แล้วเล่นเกมจับหยดน้ำ หรือตอบคำถามเพื่อสะสมน้ำ 2 ถัง',
    type: 'collect_water',
    targetAmount: 2,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 30,
    rewardCoins: 20,
    rewardItems: { seeds: { morning_glory: 2 } },
    guideTip: 'กดแท็บ "มินิเกม" ด้านล่าง แล้วเลือก "เกมจับหยดน้ำสายฝน" หรือ "ควิซวิทยาศาสตร์เกษตร"'
  },
  {
    id: 'step_2_plant',
    stepNumber: 2,
    title: 'ภารกิจที่ 2: เพาะเมล็ดพันธุ์แรก',
    description: 'เลือกแปลงเกษตรที่ว่างอยู่ แล้วหยอดเมล็ด "ผักบุ้งจีน"',
    type: 'plant_crop',
    targetAmount: 1,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 40,
    rewardCoins: 25,
    rewardItems: { fertilizerOrganic: 2 },
    guideTip: 'แตะที่แปลงเกษตรว่าง แล้วเลือกเมล็ดผักบุ้งเพื่อเริ่มปลูก'
  },
  {
    id: 'step_3_water_crop',
    stepNumber: 3,
    title: 'ภารกิจที่ 3: ให้น้ำต้นกล้า',
    description: 'รดน้ำแปลงผักเพื่อให้เมล็ดได้รับความชื้นและเริ่มงอกเป็นต้นกล้า',
    type: 'water_crop',
    targetAmount: 1,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 40,
    rewardCoins: 25,
    rewardItems: { seeds: { tomato: 2 } },
    guideTip: 'แตะที่แปลงผักที่กำลังขาดน้ำ แล้วกดปุ่ม "รดน้ำ 💧"'
  },
  {
    id: 'step_4_quiz',
    stepNumber: 4,
    title: 'ภารกิจที่ 4: เติมความรู้นักเกษตร',
    description: 'ตอบคำถามวิทยาศาสตร์การเกษตรให้ถูกต้อง 1 ข้อในมินิเกม',
    type: 'answer_quiz',
    targetAmount: 1,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 50,
    rewardCoins: 35,
    rewardItems: { fertilizerN: 2 },
    guideTip: 'เข้าไปที่ "มินิเกม" -> "ควิซวิทยาศาสตร์เกษตร" แล้วเลือกคำตอบที่ถูกต้อง'
  },
  {
    id: 'step_5_fertilize',
    stepNumber: 5,
    title: 'ภารกิจที่ 5: บำรุงด้วยปุ๋ยอินทรีย์',
    description: 'ใส่ปุ๋ยให้พืชเพื่อเร่งอัตราการเจริญเติบโตให้แข็งแรงสมบูรณ์',
    type: 'fertilize_crop',
    targetAmount: 1,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 50,
    rewardCoins: 40,
    rewardItems: { waterBuckets: 3 },
    guideTip: 'แตะแปลงผัก แล้วกดปุ่ม "ใส่ปุ๋ย 🧪"'
  },
  {
    id: 'step_6_harvest',
    stepNumber: 6,
    title: 'ภารกิจที่ 6: เก็บเกี่ยวผลผลิตแสนภูมิใจ',
    description: 'รอจนพืชเติบโตครบ 4 ระยะ แล้วกดเก็บเกี่ยวผลผลิต',
    type: 'harvest_crop',
    targetAmount: 1,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 80,
    rewardCoins: 60,
    rewardItems: { seeds: { corn: 2 }, pestSprays: 2 },
    guideTip: 'เมื่อพืชโตถึงระยะ 4 จะมีสัญลักษณ์ "พร้อมเก็บเกี่ยว ✨" แตะเพื่อเก็บเกี่ยว'
  },
  {
    id: 'step_7_level2',
    stepNumber: 7,
    title: 'ภารกิจที่ 7: ก้าวสู่เกษตรกรเลเวล 2',
    description: 'สะสมค่าประสบการณ์ (EXP) จนเพิ่มเป็นเลเวล 2 เพื่อปลดล็อกแปลงใหม่และพืชใหม่',
    type: 'reach_level',
    targetAmount: 2,
    currentAmount: 1,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 100,
    rewardCoins: 100,
    rewardItems: { seeds: { carrot: 2 } },
    guideTip: 'เก็บเกี่ยวผลผลิตและตอบควิซเพื่อรับ EXP อย่างต่อเนื่อง'
  },
  {
    id: 'step_8_math_fertilizer',
    stepNumber: 8,
    title: 'ภารกิจที่ 8: นักผสมสูตรปุ๋ยอัจฉริยะ',
    description: 'เล่นมินิเกมผสมสูตรปุ๋ยคำนวณคณิตศาสตร์ให้สำเร็จ 1 ครั้ง',
    type: 'solve_math',
    targetAmount: 1,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 120,
    rewardCoins: 80,
    rewardItems: { fertilizerP: 2, fertilizerK: 2 },
    guideTip: 'ไปที่มินิเกม "ห้องแล็บผสมปุ๋ยคณิตศาสตร์" เพื่อผสมปุ๋ยตามอัตราส่วน'
  },
  {
    id: 'step_9_master_harvest',
    stepNumber: 9,
    title: 'ภารกิจที่ 9: เกษตรกรมืออาชีพ',
    description: 'เก็บเกี่ยวผลผลิตรวมให้ครบ 5 ครั้งเพื่อพิสูจน์ฝีมือ',
    type: 'harvest_crop',
    targetAmount: 5,
    currentAmount: 0,
    isCompleted: false,
    isClaimed: false,
    rewardExp: 200,
    rewardCoins: 150,
    rewardItems: { seeds: { sunflower: 2, strawberry: 1 } },
    guideTip: 'ปลูกและดูแลพืชอย่างสม่ำเสมอทั้งผักบุ้ง มะเขือเทศ หรือข้าวโพด'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'photosynthesis',
    categoryLabel: 'การสังเคราะห์ด้วยแสง',
    question: 'พืชใช้ก๊าซชนิดใดจากอากาศในการสังเคราะห์ด้วยแสงเพื่อสร้างอาหาร?',
    options: ['ก๊าซออกซิเจน (O₂)', 'ก๊าซคาร์บอนไดออกไซด์ (CO₂)', 'ก๊าซไนโตรเจน (N₂)', 'ก๊าซฮีเลียม (He)'],
    correctIndex: 1,
    explanation: 'พืชใช้ก๊าซคาร์บอนไดออกไซด์ (CO₂) ร่วมกับน้ำและแสงแดด เพื่อสร้างน้ำตาลกลูโคสและปล่อยออกซิเจนออกมา',
    rewardType: 'water',
    rewardAmount: 2
  },
  {
    id: 'q2',
    category: 'nutrients',
    categoryLabel: 'ธาตุอาหารพืช N-P-K',
    question: 'ตัวอักษร "N" ในสูตรปุ๋ย N-P-K หมายถึงธาตุใด และช่วยบำรุงส่วนใดของพืชเป็นหลัก?',
    options: [
      'ไนโตรเจน (Nitrogen) - บำรุงใบและลำต้นเขียวชอุ่ม',
      'นีออน (Neon) - บำรุงรากแก้ว',
      'โซเดียม (Natrium) - บำรุงรสหวานของผล',
      'นิกเกิล (Nickel) - บำรุงสีของดอก'
    ],
    correctIndex: 0,
    explanation: 'ไนโตรเจน (N) มีหน้าที่สำคัญในการสร้างคลอโรฟิลล์และโปรตีน ช่วยให้ใบเขียวและลำต้นเจริญเติบโตได้ดี',
    rewardType: 'fertilizer',
    rewardAmount: 2
  },
  {
    id: 'q3',
    category: 'nutrients',
    categoryLabel: 'ธาตุอาหารพืช N-P-K',
    question: 'ถ้าต้องการให้พืช "ออกดอกดกและระบบรากแข็งแรง" ควรเลือกปุ๋ยที่เน้นธาตุใด?',
    options: ['ไนโตรเจน (N)', 'ฟอสฟอรัส (P)', 'คลอรีน (Cl)', 'ซัลเฟอร์ (S)'],
    correctIndex: 1,
    explanation: 'ฟอสฟอรัส (P) ช่วยในการพัฒนาระบบราก การสร้างตาดอก และการติดผลของพืช',
    rewardType: 'fertilizer',
    rewardAmount: 2
  },
  {
    id: 'q4',
    category: 'soil_water',
    categoryLabel: 'ดินและความชื้น',
    question: 'สิ่งมีชีวิตชนิดใดในดินที่ช่วยพรวนดินให้ร่วนซุยและสร้างมูลที่เป็นปุ๋ยธรรมชาติชั้นยอด?',
    options: ['ไส้เดือนดิน (Earthworm)', 'มดแดง', 'หนูนา', 'ตั๊กแตน'],
    correctIndex: 0,
    explanation: 'ไส้เดือนดินช่วยขุดรูพรวนดินให้อากาศและน้ำถ่ายเทได้สะดวก มูลไส้เดือนยังอุดมด้วยจุลินทรีย์และธาตุอาหาร',
    rewardType: 'fertilizer',
    rewardAmount: 2
  },
  {
    id: 'q5',
    category: 'photosynthesis',
    categoryLabel: 'การสังเคราะห์ด้วยแสง',
    question: 'สารสีเขียวในใบพืชที่ทำหน้าที่ดูดกลืนพลังงานแสงอาทิตย์มีชื่อเรียกว่าอะไร?',
    options: ['แคโรทีนอยด์', 'คลอโรฟิลล์ (Chlorophyll)', 'แอนโทไซยานิน', 'ฮีโมโกลบิน'],
    correctIndex: 1,
    explanation: 'คลอโรฟิลล์ (Chlorophyll) คือรงควัตถุสีเขียวที่อยู่ในคลอโรพลาสต์ ทำหน้าที่รับพลังงานแสงในการสังเคราะห์อาหาร',
    rewardType: 'water',
    rewardAmount: 2
  },
  {
    id: 'q6',
    category: 'ecology',
    categoryLabel: 'ระบบนิเวศและการควบคุมศัตรูพืช',
    question: 'แมลงชนิดใดจัดเป็น "ตัวห้ำ (Predator)" ที่เป็นมิตรกับชาวสวน ช่วยกินเพลี้ยอ่อนศัตรูพืช?',
    options: ['แมลงเต่าทอง (Ladybug)', 'ตั๊กแตนปาทังก้า', 'เพลี้ยกระโดดสีน้ำตาล', 'หนอนผีเสื้อเจาะลำต้น'],
    correctIndex: 0,
    explanation: 'แมลงเต่าทองเป็นแมลงตัวห้ำที่มีประโยชน์มาก ทั้งตัวอ่อนและตัวเต็มวัยช่วยกินเพลี้ยอ่อนและแมลงศัตรูพืชขนาดเล็ก',
    rewardType: 'seed',
    rewardAmount: 1
  },
  {
    id: 'q7',
    category: 'soil_water',
    categoryLabel: 'การจัดการน้ำในแปลง',
    question: 'ช่วงเวลาใดที่ "เหมาะสมที่สุด" ในการรดน้ำต้นไม้เพื่อลดการระเหยและป้องกันเชื้อรา?',
    options: [
      'ตอนเช้าตรู่ (06:00 - 08:00 น.)',
      'ตอนเที่ยงวันแดดจัด (12:00 น.)',
      'ตอนบ่ายสองโมง (14:00 น.)',
      'ตอนดึกกลางคืน (23:00 น.)'
    ],
    correctIndex: 0,
    explanation: 'การรดน้ำตอนเช้าตรู่ช่วยให้พืชมีน้ำพร้อมใช้สังเคราะห์แสงตลอดวัน แดดยังไม่อ่อนหรือแรงเกินไป ไม่เกิดความชื้นสะสมข้ามคืนจนเกิดเชื้อรา',
    rewardType: 'water',
    rewardAmount: 3
  },
  {
    id: 'q8',
    category: 'nutrients',
    categoryLabel: 'ธาตุอาหารพืช N-P-K',
    question: 'ธาตุ "โพแทสเซียม (K)" มีบทบาทเด่นในเรื่องใดของพืชผล?',
    options: [
      'ช่วยเพิ่มความหวาน ขนาดผล และสร้างภูมิต้านทานโรค',
      'ช่วยทำให้ใบมีสีม่วง',
      'ช่วยให้ลำต้นเหี่ยวแห้งเร็วขึ้น',
      'ทำหน้าที่สะท้อนแสงอาทิตย์'
    ],
    correctIndex: 0,
    explanation: 'โพแทสเซียม (K) ช่วยในการลำเลียงน้ำตาลและแป้ง เพิ่มคุณภาพและความหวานของผลผลิต รวมถึงช่วยให้พืชทนต่อแล้งและโรค',
    rewardType: 'fertilizer',
    rewardAmount: 2
  },
  {
    id: 'q9',
    category: 'crop_science',
    categoryLabel: 'วิทยาศาสตร์เมล็ดพันธุ์',
    question: 'ปัจจัยจำเป็น 3 ประการในการ "งอกของเมล็ดพืช (Seed Germination)" คืออะไร?',
    options: [
      'น้ำ/ความชื้น + อุณหภูมิที่พอเหมาะ + ก๊าซออกซิเจน',
      'น้ำส้มสายชู + เกลือ + แสงนีออน',
      'น้ำแข็ง + ปุ๋ยเคมีเข้มข้น + ความมืดสนิท',
      'ยาฆ่าแมลง + แดดเผา + ความแห้งแล้ง'
    ],
    correctIndex: 0,
    explanation: 'เมล็ดต้องการน้ำเพื่อกระตุ้นเอนไซม์ ต้องการออกซิเจนเพื่อหายใจสร้างพลังงาน และต้องการอุณหภูมิที่เหมาะสมในการแบ่งเซลล์',
    rewardType: 'seed',
    rewardAmount: 1
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_sprout',
    title: 'ต้นกล้าแรกผลิใบ',
    description: 'เพาะเมล็ดและดูแลจนกลายเป็นต้นกล้าครั้งแรก',
    icon: '🌱',
    isUnlocked: false,
    current: 0,
    target: 1
  },
  {
    id: 'water_keeper',
    title: 'ผู้พิทักษ์สายน้ำ',
    description: 'รวบรวมน้ำจากมินิเกมครบ 15 ถัง',
    icon: '💧',
    isUnlocked: false,
    current: 0,
    target: 15
  },
  {
    id: 'green_scholar',
    title: 'นักวิทยาศาสตร์เกษตร',
    description: 'ตอบคำถามควิซความรู้เกษตรถูกต้องครบ 5 ข้อ',
    icon: '🧠',
    isUnlocked: false,
    current: 0,
    target: 5
  },
  {
    id: 'master_harvester',
    title: 'เซียนเก็บเกี่ยวผลผลิต',
    description: 'เก็บเกี่ยวผลผลิตจากแปลงเกษตรครบ 10 ครั้ง',
    icon: '🧺',
    isUnlocked: false,
    current: 0,
    target: 10
  },
  {
    id: 'fertilizer_chemist',
    title: 'ปรมาจารย์ปรุงปุ๋ย',
    description: 'เล่นมินิเกมผสมสูตรปุ๋ยคณิตศาสตร์สำเร็จ 3 ครั้ง',
    icon: '🧪',
    isUnlocked: false,
    current: 0,
    target: 3
  },
  {
    id: 'pest_defender',
    title: 'ผู้พิทักษ์แปลงผัก',
    description: 'กำจัดศัตรูพืชในแปลงหรือมินิเกมครบ 5 ตัว',
    icon: '🐞',
    isUnlocked: false,
    current: 0,
    target: 5
  }
];

export const KNOWLEDGE_ARTICLES = [
  {
    id: 'photosynthesis',
    title: '☀️ กระบวนการสังเคราะห์ด้วยแสง (Photosynthesis)',
    category: 'วิทยาศาสตร์พืช',
    summary: 'โรงงานผลิตอาหารมหัศจรรย์ของโลกสีเขียว',
    content: `
**สมการการสังเคราะห์ด้วยแสง:**
\`6CO₂ (คาร์บอนไดออกไซด์) + 6H₂O (น้ำ) + พลังงานแสง ➔ C₆H₁₂O₆ (น้ำตาลกลูโคส) + 6O₂ (ออกซิเจน)\`

🌿 **สิ่งสำคัญที่พืชต้องการ:**
1. **แสงแดด:** คลอโรฟิลล์ในใบพืชดูดซับโฟตอนจากแสงอาทิตย์
2. **น้ำ (H₂O):** รากดูดน้ำจากดินส่งผ่านท่อลำเลียงไซเลม (Xylem) ขึ้นสู่ใบ
3. **ก๊าซคาร์บอนไดออกไซด์ (CO₂):** ปากใบ (Stomata) เปิดรับก๊าซจากอากาศรอบตัว

🍎 **ผลลัพธ์ที่ได้:**
- น้ำตาลกลูโคสสำหรับเปลี่ยนเป็นแป้งและเซลลูโลสสร้างลำต้น ดอก และผล
- ก๊าซออกซิเจนบริสุทธิ์คืนสู่บรรยากาศให้สิ่งมีชีวิตบนโลกหายใจ
    `
  },
  {
    id: 'npk_nutrients',
    title: '🧪 ธาตุอาหารหลักของพืช N-P-K',
    category: 'ดินและปุ๋ย',
    summary: 'อาหารจานหลัก 3 ชนิดที่พืชขาดไม่ได้',
    content: `
ตัวเลข 3 ตัวบนถุงปุ๋ย (เช่น 15-15-15 หรือ 46-0-0) คือเปอร์เซ็นต์ของธาตุอาหารหลัก 3 ตัว:

1. **N - ไนโตรเจน (Nitrogen) 🌿 "บำรุงใบและยอด"**
   - ช่วยสร้างคลอโรฟิลล์ ใบเขียวเข้ม โตไว เหมาะมากกับพืชกินใบ เช่น ผักบุ้ง คะน้า กะหล่ำ

2. **P - ฟอสฟอรัส (Phosphorus) 🌸 "บำรุงรากและดอก"**
   - เร่งการแตกราก กระตุ้นการออกดอกและการผสมเกสร เหมาะกับระยะก่อนติดดอก เช่น มะเขือเทศ ทานตะวัน

3. **K - โพแทสเซียม (Potassium) 🍅 "บำรุงผลและความหวาน"**
   - ช่วยลำเลียงแป้งและน้ำตาล ทำให้ผลเต่งตึง รสหวาน ผิวสวย และช่วยให้พืชทนต่อสภาพอากาศแล้ง
    `
  },
  {
    id: 'growth_stages',
    title: '🌱 4 ระยะการเจริญเติบโตของพืช',
    category: 'ชีววิทยาการเกษตร',
    summary: 'ตั้งแต่เมล็ดจิ๋วจนถึงผลผลิตแสนอร่อย',
    content: `
1. **ระยะเมล็ด (Seed Stage 🌰):** เมล็ดดูดน้ำ (Imbibition) เปลือกหุ้มเมล็ดนุ่มลง รากแรกเกิด (Radicle) แทงลงดิน
2. **ระยะต้นกล้า (Seedling Stage 🌱):** ใบเลี้ยงกางออก ใบจริงเริ่มผลิ เริ่มสังเคราะห์แสงเองได้ ต้องการความชื้นสม่ำเสมอ
3. **ระยะเติบโตและออกดอก (Vegetative & Flowering 🌿🌼):** ลำต้นขยายกิ่งก้าน ออกตาดอก ต้องการแสงและธาตุอาหารเต็มที่
4. **ระยะผลสุกพร้อมเก็บเกี่ยว (Harvesting Stage 🍅🌾):** แป้งและสารอาหารสะสมในผลเต็มที่ เมล็ดพันธุ์พร้อมสืบต่อวงจรชีวิต
    `
  },
  {
    id: 'soil_and_water',
    title: '💧 ดิน น้ำ และจุลินทรีย์มีชีวิต',
    category: 'การอนุรักษ์ธรรมชาติ',
    summary: 'ความลับของดินดีที่อุดมสมบูรณ์',
    content: `
- **ดินร่วนปนทราย:** ระบายน้ำดีแต่เก็บความชื้นได้พอเหมาะ เหมาะกับพืชผักสวนครัวและพืชหัว
- **อินทรียวัตถุ (Compost/Humus):** ซากพืชซากสัตว์ที่ย่อยสลาย ช่วยกักเก็บธาตุอาหารและเป็นอาหารให้จุลินทรีย์ดิน
- **ไส้เดือนดิน:** สัญลักษณ์ของดินมีชีวิต ช่วยขุดอุโมงค์ระบายอากาศและผลิตปุ๋ยมูลไส้เดือนที่มีธาตุอาหารครบครัน
    `
  }
];
