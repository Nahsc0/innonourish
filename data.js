export const LGAS = ['Chikun', 'Kaduna North', 'Zaria', "Jema'a"];
export const MONTHS = ['2026-09', '2026-10', '2026-11'];
export const PILOT = {name:'Kaduna nutrition pilot', months:12, lgas:4, sites:12, ceiling:20_000_000};
// Entirely invented aggregate examples. No facility or individual identifiers.
export const seedRecords = MONTHS.flatMap((month,m)=>LGAS.map((lga,i)=>({
  month,lga,sites:3,reportsExpected:3,reportsReceived:[[2,2,1,2],[3,2,2,2],[3,3,2,2]][m][i],
  approved:6_000_000+i*500_000+m*250_000,
  released:3_600_000+i*250_000+m*450_000,
  spent:2_400_000+i*200_000+m*400_000,
  staffTrained:[[6,5,4,3],[8,7,5,6],[9,8,7,6]][m][i],
  communitySessions:[[2,2,1,1],[3,2,2,2],[3,3,2,3]][m][i],
  peopleReached:[[110,95,70,80],[145,120,100,110],[170,150,130,135]][m][i]
})));
export const seedActions = [
  {id:'A01',title:'Agree the pilot mandate and state focal team',lga:'State-wide',pillar:'Partnerships',owner:'State liaison',due:'2026-11-24',status:'In progress',priority:'High'},
  {id:'A02',title:'Confirm site selection and reporting permissions',lga:'Chikun',pillar:'Evidence',owner:'LGA coordinator',due:'2026-11-27',status:'Not started',priority:'High'},
  {id:'A03',title:'Cost the joint nutrition workplan',lga:'State-wide',pillar:'Financing',owner:'Finance lead',due:'2026-11-30',status:'In progress',priority:'High'},
  {id:'A04',title:'Hold the first community listening session',lga:'Kaduna North',pillar:'Participation',owner:'Community liaison',due:'2026-12-04',status:'Not started',priority:'Medium'},
  {id:'A05',title:'Train designated aggregate reporting focal staff',lga:'Zaria',pillar:'Capacity',owner:'Training lead',due:'2026-12-08',status:'Not started',priority:'Medium'},
  {id:'A06',title:'Resolve missing monthly aggregate reports',lga:"Jema'a",pillar:'Evidence',owner:'Data quality lead',due:'2026-11-20',status:'Blocked',priority:'High'},
  {id:'A07',title:'Prepare the demonstration data dictionary',lga:'State-wide',pillar:'Evidence',owner:'Data quality lead',due:'2026-11-16',status:'Done',priority:'Medium'},
  {id:'A08',title:'Review release and expenditure documentation',lga:'Chikun',pillar:'Financing',owner:'Finance lead',due:'2026-12-11',status:'Not started',priority:'Medium'}
];
export const seedPartners = [
  {id:'P01',name:'Kaduna State Ministry of Health',category:'Government',role:'Proposed policy stewardship and state coordination',status:'To approach',note:''},
  {id:'P02',name:'Kaduna State Primary Health Care Board',category:'Government',role:'Proposed PHC engagement, implementation oversight and reporting alignment',status:'To approach',note:''},
  {id:'P03',name:'State budget and planning authorities',category:'Government',role:'Proposed nutrition budget alignment and financing review',status:'To approach',note:''},
  {id:'P04',name:'Participating LGA health teams',category:'Local delivery',role:'Proposed supervision and monthly action follow-up in four LGAs',status:'To approach',note:''},
  {id:'P05',name:'Community and women-led organisations',category:'Community',role:'Proposed co-design, feedback and inclusive accountability',status:'To approach',note:''},
  {id:'P06',name:'Academic and evaluation collaborator',category:'Research',role:'Proposed independent evaluation and evidence quality review',status:'To identify',note:''},
  {id:'P07',name:'Nutrition development partners',category:'Development',role:'Proposed technical advice and eligible financing pathways',status:'To identify',note:''}
];
export const budgetItems = [
  {
    "id": "D01",
    "label": "Coordination",
    "unit": "month",
    "quantity": 12,
    "unitCost": 420000,
    "category": "Programme support"
  },
  {
    "id": "D02",
    "label": "Reporting workshops",
    "unit": "workshop",
    "quantity": 4,
    "unitCost": 680000,
    "category": "Training"
  },
  {
    "id": "D03",
    "label": "Field support visits",
    "unit": "visit",
    "quantity": 24,
    "unitCost": 74000,
    "category": "Field support"
  },
  {
    "id": "D04",
    "label": "Community listening",
    "unit": "session",
    "quantity": 12,
    "unitCost": 95000,
    "category": "Community participation"
  },
  {
    "id": "D05",
    "label": "Reporting and hosting",
    "unit": "month",
    "quantity": 12,
    "unitCost": 180000,
    "category": "Digital tools"
  },
  {
    "id": "D06",
    "label": "Learning review",
    "unit": "review",
    "quantity": 2,
    "unitCost": 630000,
    "category": "Evaluation"
  }
];
export const seedBudget = {items:budgetItems,contingency:10,assumedFunding:0,ceiling:PILOT.ceiling};
export const fundingFallback = {checkedOn:null,pathways:[]};
