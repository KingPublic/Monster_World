import { mvpConfig } from '../config/mvpConfig';
import { valleyTrails } from './Landscape';
export type ResidentRole='traveler'|'guide'|'guard';
export interface ResidentDefinition{id:string;name:string;title:string;role:ResidentRole;model:'traveler'|'knight';height:number;route:readonly (readonly [number,number])[];pause:number;pace?:number;heading?:number;tint:number;nestId?:string;camp?:boolean;}
export interface DialogueOption{label:string;topic?:string;nestId?:string;}
export interface DialoguePage{name:string;title:string;text:string;options:DialogueOption[];}
const regionPeople:Record<string,string>={forest:'Rowan',highland:'Orin',volcano:'Ember',frost:'Eira',meadow:'Linden',canyon:'Sable',marsh:'Mira',ruins:'Archivist Vale',dunes:'Dalia',ember:'Kael',glacier:'Neris',moonwell:'Liora',sunreach:'Aurel',stormspire:'Skykeeper Orrin'};
const regionStories:Record<string,[string,string]>={
 forest:['The forest remembers every wingbeat. Mountain Dragons shelter their young among these old groves. I watch the path, and they watch their eggs.','A Horse is a good companion for the first journey. When you take an egg, begin your return at once. The Guardian follows you all the way home.'],
 highland:['Meadow Dragons love these broad windswept slopes. Watch the stone cairns when the morning mist rolls in; they lead back toward the valley.','A Young Dragon makes the climb easier. Leave enough room to turn, and descend toward the Sanctuary while you are still moving home.'],
 volcano:['Ashscale wings look like embers against the cliffs. The nesting grounds are warm, but the Guardians are much less welcoming than I am.','Before entering the nest, choose your escape direction. Hold Boost when you need distance, then release it to recover stamina on your return.'],
 frost:['Frostcrest Dragons are quiet until someone approaches their young. Even in this cold air, a wingbeat can carry a long way.','This is a long journey. Alternate normal flight and held Boost, and land within the Sanctuary shield to secure what you carry.'],
 meadow:['The flowers bend before you hear the Meadow Dragons. Their young keep the same soft colours when their wings grow strong enough to carry you.','The grassland trail is wide enough for your Horse. Follow the road shoulders back to the Sanctuary and avoid the scattered boulders.'],
 canyon:['The canyon turns every roar into an echo. Ashscale Dragons rest between the shelves, where the wind rises along the warm stone.','Flight gives you room above the shelves. Climb before a ridge, and save stamina for the return journey rather than spending it all on the approach.'],
 marsh:['Mountain Dragons nest on dry ground above the reedwater. I mend my maps here while the pools reflect the passing clouds.','Stay on the dry trail if you ride a Horse. The Guardian will not forget a stolen egg just because you cross a pool or fly farther away.'],
 ruins:['Frostcrest wings have circled these broken pillars for generations. I record the carvings; the Dragons seem to prefer guarding the silence.','The pillars are solid. Take off in the open clearing and rise above them. Your compass always points toward the route you last marked.'],
 dunes:['Duneback Dragons sleep among the gold dunes. Their heavy horns and plated backs shelter them from the desert wind; their broad wings can still carry a rider.','Rare eggs lie on the dry ledge. Plan your return through Reedwater, and keep your Dragon fed so its health can carry you through a Guardian pursuit.'],
 ember:['The strong Emberdrakes belong to this broken crater. They grow broad chests and blazing crests; Epic eggs are common here, with a chance of Legendary.','The basalt columns leave an open landing court. Steal, saddle up, then leave through the gap toward Amber Canyon. C lowers your Dragon after flight.'],
 glacier:['Crystalwyverns have two strong legs and great crystalline wings. Their young keep the same angular crest. These high nests often hold Legendary eggs.','Watch your stamina and health before the long return. Follow the ridge toward Frost Summit; keep above solid crystal spires and descend in an open clearing.'],
 moonwell:['Moonveil Dragons spread wide velvet wings beneath crescent horns. This grove shelters Legendary eggs, and sometimes a Mythical one.','The ruins and flowers mark the long way home through Wildflower Meadow. A fallen Dragon will recover at Sanctuary, but you must still bring its egg home yourself.'],
 sunreach:['Suncrest Dragons carry a golden mane and feather-like wings. Every egg in this temple nest is Legendary; rarity stays with your companion throughout its life.','This is a distant physical journey. Build health and stamina with food, save Boost for the chase, and return under the Sanctuary shield to secure a Legendary egg.'],
 stormspire:['Stormserpents twist through the high wind with long bodies and branching antlers. The eggs in this nest are Mythical. The Guardian protects every one.','A healthy grown companion and rider upgrades make this journey easier. Do not spend every point of Boost on arrival. Mythical companions recover for ten minutes if they fall.'],
};
const city:ResidentDefinition[]=[
 {id:'garden-traveler',name:'Tarin',title:'Valley wanderer',role:'traveler',model:'traveler',height:4.9,route:[[-28,20],[-28,42]],pause:0,tint:0xffffff},
 {id:'market-traveler',name:'Nessa',title:'Supply runner',role:'traveler',model:'traveler',height:4.6,route:[[-53,52],[-78,52]],pause:1.4,tint:0xdac5aa},
 {id:'arrival-knight',name:'Captain Elian',title:'Shield warden',role:'guard',model:'knight',height:5.5,route:[[28,94]],pause:0,heading:-.25,tint:0xffffff},
 {id:'hatchery-keeper',name:'Lyra',title:'Dragon caretaker',role:'guide',model:'traveler',height:5.1,route:[[21,-66]],pause:0,heading:-1,tint:0xcad8b4},
 {id:'court-keeper',name:'Bram',title:'Companion keeper',role:'guide',model:'traveler',height:5.2,route:[[42,20]],pause:0,heading:-1.4,tint:0xd9c89f},
 {id:'south-traveler',name:'Aven',title:'Returning explorer',role:'traveler',model:'traveler',height:5,route:[[35,100],[55,107]],pause:2.1,tint:0xbacfd7},
 {id:'road-traveler',name:'Fen',title:'Trail messenger',role:'traveler',model:'traveler',height:5.3,route:[[136,105],[150,121]],pause:.8,tint:0xc7bcb2},
];
const roamingNames=['Ivo','Sera','Wren','Galen','Pia','Rook','Theo','Rina','Cato','Dara','Eli','Faye','Hale','Juno','Kira','Leif','Moss','Nell','Pax','Rey','Sol','Tess','Una','Wynn'];
// Walkways and open park edges, outside service thresholds and Dragon berths.
const cityWalks=[
 {id:'arrival-walker',name:'Rhea',title:'Homeward wanderer',route:[[10,40],[10,64]]},
 {id:'plaza-runner',name:'Milo',title:'Sanctuary messenger',route:[[-11,76],[-11,96]]},
 {id:'fountain-visitor',name:'Luma',title:'Fountain visitor',route:[[12,16],[12,32]]},
 {id:'garden-reader',name:'Esme',title:'Garden wanderer',route:[[-38,14],[-38,29]]},
 {id:'market-visitor',name:'Beni',title:'Market visitor',route:[[-46,38],[-46,57]]},
 {id:'market-wanderer',name:'Suki',title:'Returning from market',route:[[-44,70],[-39,78]]},
 {id:'court-visitor',name:'Solan',title:'Companion admirer',route:[[24,22],[24,36]]},
 {id:'upper-court-walker',name:'Ada',title:'Hatchery visitor',route:[[-17,-72],[-21,-87]]},
 {id:'north-garden-walker',name:'Theo',title:'North garden walker',route:[[-62,-121],[-62,-140]]},
 {id:'west-promenade-walker',name:'Elowen',title:'West park wanderer',route:[[-161,-12],[-161,11]]},
 {id:'east-promenade-walker',name:'Finn',title:'East park wanderer',route:[[164,-5],[164,13],[160,26]]},
 {id:'south-park-walker',name:'Mae',title:'Promenade visitor',route:[[-75,155],[-56,165]]},
 {id:'south-garden-walker',name:'Tova',title:'South garden walker',route:[[23,157],[38,160]]},
 {id:'east-street-walker',name:'Kian',title:'Roadside wanderer',route:[[125,21],[153,21]]},
]as const;
for(const [i,r]of cityWalks.entries())city.push({...r,role:'traveler',model:'traveler',height:4.7+(i%4)*.16,route:i%2?[...r.route].reverse():r.route,pause:(i*1.13)%4.6,pace:.67+(i%4)*.055,tint:[0xffffff,0xf2e3d5,0xe5e8ee,0xe0eee1][i%4]!});
city.push(
 {id:'market-gardener',name:'Nori',title:'Sanctuary gardener',role:'guide',model:'traveler',height:4.8,route:[[-36,53]],pause:0,heading:-.7,tint:0xe3eedb},
 {id:'north-park-guide',name:'Celia',title:'North park caretaker',role:'guide',model:'traveler',height:5,route:[[-90,-128]],pause:0,heading:.7,tint:0xf4e8d6},
 {id:'east-road-watch',name:'Sir Alden',title:'East road watch',role:'guard',model:'knight',height:5.4,route:[[126,56]],pause:0,heading:2.5,tint:0xf0e7d8},
 {id:'south-park-watch',name:'Captain Anya',title:'South promenade watch',role:'guard',model:'knight',height:5.3,route:[[14,144]],pause:0,heading:-.4,tint:0xe5edf3},
);
const extraRoamingNames=['Ari','Niko','Maren','Oda','Brin','Evan','Ilia','Nia','Hugo','Ines','Jori','Lark','Mika','Oren','Rumi','Vera'];
const wild:ResidentDefinition[]=[];
for(const [index,trail]of valleyTrails.entries()){
 const sample=(t:number,side:number):readonly [number,number]=>{const p=trail.curve.getPointAt(t),v=trail.curve.getTangentAt(t);return [p.x-v.z*side,p.z+v.x*side];};
 // Different route lengths/initial rests prevent a synchronized procession.
 for(let i=0;i<5;i++){const mid=[.18,.43,.68,.30,.81][i]!,start=Math.max(.02,mid-.025-index*.0004),end=Math.min(.86,mid+.025+index*.0004),side=(i%2?1:-1)*Math.min(5.5,trail.width/2-1.8);wild.push({id:trail.nestId+'-traveler-'+i,name:i<3?roamingNames[(index*3+i)%roamingNames.length]!:extraRoamingNames[(index*2+i-3)%extraRoamingNames.length]!,title:'On the '+trail.nestId+' trail',role:'traveler',model:'traveler',height:5.1+(i%2)*.3,route:[sample(start,side),sample(mid,side),sample(end,side)],pause:(index*.73+i*1.17)%3,pace:.68+((index+i)%5)*.04,tint:[0xffffff,0xe3eedb,0xf0e5db][(index+i)%3]!,nestId:trail.nestId});}
 wild.push({id:trail.nestId+'-guide',name:regionPeople[trail.nestId]!,title:mvpConfig.nests.find(n=>n.id===trail.nestId)!.name+' wayfarer',role:'guide',model:index===7?'knight':'traveler',height:5.6,route:[sample(.84,trail.width/2+11)],pause:0,heading:Math.PI*.2,tint:[0xd8d0b5,0xcad6df,0xffffff][index%3]!,nestId:trail.nestId,camp:true});
}
export const residentCatalog:readonly ResidentDefinition[]=[...city,...wild];
export const residentLimits={load:220,unload:320,draw:300,maxActive:20,talk:8.5} as const;
export function mayTalk(carried:number,mounted:boolean):boolean{return carried===0&&!mounted;}
export function dialoguePage(id:string,topic='welcome'):DialoguePage|undefined{
 const r=residentCatalog.find(r=>r.id===id);if(!r)return;
 let text:string;
 if(r.nestId){const story=regionStories[r.nestId]!;text=topic==='advice'?story[1]:story[0];}
 else if(id==='arrival-knight')text=topic==='advice'?'The shield protects the Sanctuary up to its marked ceiling. Return inside the boundary below it to secure your eggs. We cannot call you home while a Guardian is pursuing you.':'Welcome back, rider. I keep watch at the southern gate. Beyond this shield the wild Dragons protect their nests; within it, your companions have a place to grow.';
 else if(id==='hatchery-keeper')text=topic==='advice'?'Bring secured eggs to the Hatchery, then meet your Baby in the companion garden. Two meals of Basic Food bring a Baby to the Young stage. Its lineage stays the same as it grows.':'I am Lyra. Every egg that reaches us is the beginning of a friendship. The hatchlings need gentle care before their wings are strong enough to carry a rider.';
 else if(id==='court-keeper')text=topic==='advice'?'Choose any companion in the Collection Hall. Young Dragons wait at the central mount berth; Babies can be called to the garden for feeding. Those resting elsewhere are still safely in your collection.':'Bram, keeper of the companion garden. The central berth belongs to the Dragon you have selected. The resting rows leave plenty of space for wings and for riders to walk between them.';
 else if(id==='market-gardener')text=topic==='advice'?'The Food Shop is beside this square. Take your time here and let your sprint stamina recover before setting off. Your companions have their own place in the garden.':'I am Nori. I tend the Sanctuary gardens while riders are out exploring. The market is busiest when travelers return, full of stories about the Dragons they have met.';
 else if(id==='north-park-guide')text=topic==='advice'?'The outer promenade makes a lovely walk. Follow its stone path around the gardens, then return to the main square for the Hatchery and companion court.':'Celia, caretaker of the north gardens. This quiet corner is where I like to watch the wings above the valley. A city needs room for its Dragons, and room for its people too.';
 else if(r.role==='guard')text=topic==='advice'?'The shield marks your safe return. Keep below its ceiling when bringing an egg home. These roads stay open for riders, so leave your Horse room to turn.':`I am ${r.name}, keeping watch along the Sanctuary roads. It is good to see these paths busy again. Travelers bring news from the forests while the young Dragons rest safely inside the shield.`;
 else text=topic==='advice'?`Roads link ${mvpConfig.nests.length} nesting regions. The Horse is quick on land, but a Young Dragon carries you over the long climbs. Talk to the wayfarers by the trails before you approach a guarded nest.`:`Good to see another explorer. I am ${r.name}. I carry stories between the Sanctuary and the wild roads. There is always another valley to see, and another Dragon to understand.`;
 const options:DialogueOption[]=topic==='welcome'?[{label:r.nestId?'Any advice for this region?':'What should I know?',topic:'advice'}]:[{label:'Tell me about this place.',topic:'welcome'}];
 options.push({label:r.nestId?'Mark this nesting region':'Mark the nearby Forest Nest',nestId:r.nestId??'forest'});
 return{name:r.name,title:r.title,text,options};
}
