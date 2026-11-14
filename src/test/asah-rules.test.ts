import { describe, expect, it } from 'vitest';
import { addCompletion, ageMonths, currentDay, editObservation, jakartaDay, migrateState, replaceActivity, setDuration, stageFor, type Completion, type DayState } from '@/lib/asah';
import { activities, activityFor, durationSteps } from '@/lib/catalog';
const day: DayState = { day:'2026-11-14',used:0,choice:0,duration:5 };
describe('Approved primary age stages',()=>{
  it.each([[0,1],[3,1],[4,2],[11,2],[12,3],[23,3],[24,4],[47,4],[48,5],[71,5],[72,null],[-1,null]])('maps %i months to stage %s',(months,stage)=>expect(stageFor(months)).toBe(stage));
  it.each([[4,2],[12,3],[24,4],[48,5],[72,null]])('changes at the %i-month birthday',(months,stage)=>{const birth=new Date(Date.UTC(2026,10-months,14));const dob=birth.toISOString().slice(0,10);expect(ageMonths(dob,new Date('2026-11-14T00:00:00Z'))).toBe(months);expect(stageFor(ageMonths(dob,new Date('2026-11-14T00:00:00Z')))).toBe(stage);expect(ageMonths(dob,new Date('2026-11-13T00:00:00Z'))).toBe(months-1);});
  it('clamps a January 31 anniversary to February 28',()=>expect(ageMonths('2026-01-31',new Date('2026-02-28T00:00:00Z'))).toBe(1));
  it('rejects future birth dates',()=>expect(ageMonths('2026-11-15',new Date('2026-11-14T00:00:00Z'))).toBe(-1));
  it('rejects invalid calendar dates',()=>expect(ageMonths('2026-02-30',new Date('2026-11-14T00:00:00Z'))).toBe(-1));
});
describe('Activity allowance',()=>{
 it('allows five Free replacements and blocks the sixth',()=>{let value=day;for(let i=0;i<5;i++)value=replaceActivity(value,'free');expect(value.used).toBe(5);expect(value.choice).toBe(5);expect(replaceActivity(value,'free')).toBe(value);});
 it('allows unlimited Pro replacements',()=>{let value={...day,used:5};for(let i=0;i<200;i++)value=replaceActivity(value,'pro');expect(value.choice).toBe(200);expect(value.used).toBe(5);});
 it('resets at midnight WIB, not midnight UTC',()=>{const value={...day,used:5};expect(jakartaDay(new Date('2026-11-14T16:59:59Z'))).toBe('2026-11-14');expect(currentDay(value,new Date('2026-11-14T16:59:59Z')).used).toBe(5);expect(currentDay(value,new Date('2026-11-14T17:00:00Z')).used).toBe(0);expect(jakartaDay(new Date('2026-11-14T17:00:00Z'))).toBe('2026-11-15');});
 it('keeps child allowances independent',()=>{const children={a:day,b:{...day}};const next={...children,a:replaceActivity(children.a,'free')};expect(next.a.used).toBe(1);expect(next.b.used).toBe(0);});
 it('changing duration never consumes replacements',()=>{expect(setDuration({...day,used:4},1)).toEqual({...day,used:4,duration:1});expect(setDuration({...day,used:5},10).used).toBe(5);});
 it('reopening the same day preserves the activity',()=>expect(currentDay({...day,choice:3},new Date('2026-11-14T10:00:00Z')).choice).toBe(3));
});
describe('Observation records',()=>{
 const log:Completion={id:'one',childId:'child',activityId:'s4-0',title:'Menara',focus:'Motorik halus',stage:4,duration:5,at:'2026-11-14T10:00:00Z',response:'Ya'};
 it('creates a distinct record for each repeat completion',()=>{const logs=addCompletion(addCompletion([],log),{...log,id:'two',at:'2026-11-14T11:00:00Z'});expect(logs).toHaveLength(2);expect(logs[0]?.id).not.toBe(logs[1]?.id);});
 it('edits exactly one record without adding a completion',()=>{const logs=editObservation([log,{...log,id:'two'}],'one','Belum');expect(logs).toHaveLength(2);expect(logs[0]?.response).toBe('Belum');expect(logs[1]?.response).toBe('Ya');});
});
describe('Sample catalog safeguards',()=>{
 it('all suggestions stay in their selected stage',()=>{for(let stage=1;stage<=5;stage++)for(let choice=0;choice<20;choice++)expect(activityFor(stage,choice)?.stage).toBe(stage);});
 it('under-three activities exclude small objects',()=>{const infant=activities.filter(a=>a.stage<=3);expect(infant.length).toBe(18);expect(infant.every(a=>!a.smallItems)).toBe(true);});
 it('under-three activities contain speech prompts and supervision/mouthing safety',()=>{for(const a of activities.filter(a=>a.stage<=3)){expect(a.speech.length).toBeGreaterThan(10);expect(a.safety).toContain('Selalu dampingi');expect(a.safety).toContain('masuk mulut');}});
 it('all seven required content fields are present',()=>{for(const a of activities){expect(a.stage).toBeGreaterThan(0);expect(a.focus.length).toBeGreaterThan(0);expect(a.aim.length).toBeGreaterThan(0);expect(a.materials.length).toBeGreaterThan(0);expect(a.steps.length).toBeGreaterThan(0);expect(a.observe.length).toBeGreaterThan(0);expect(a.safety.length).toBeGreaterThan(0);}});
 it('duration variants provide different steps without changing classification',()=>{const a=activityFor(4,0);expect(a).toBeDefined();if(!a)return;expect(durationSteps(a,1)).toHaveLength(2);expect(durationSteps(a,5)).toHaveLength(3);expect(durationSteps(a,10)).toHaveLength(4);expect(a.stage).toBe(4);});
});describe('Account-level caregiver role',()=>{
 it('adopts the first child\'s legacy role and strips per-child roles',()=>{const migrated=migrateState({children:[{id:'a',name:'Nara',dob:'2023-01-01',role:'Ayah'},{id:'b',name:'Bima',dob:'2024-01-01',role:'Ibu'}],selected:'a',plan:'free',days:{},logs:[],saved:[],consent:true});expect(migrated.role).toBe('Ayah');expect(migrated.children).toEqual([{id:'a',name:'Nara',dob:'2023-01-01'},{id:'b',name:'Bima',dob:'2024-01-01'}]);});
 it('keeps an existing account role and leaves other data untouched',()=>{const migrated=migrateState({children:[{id:'a',name:'Nara',dob:'2023-01-01',role:'Ibu'}],selected:'a',plan:'pro',role:'Kakek / Nenek',days:{},logs:[],saved:[],consent:true});expect(migrated.role).toBe('Kakek / Nenek');expect(migrated.plan).toBe('pro');});
 it('defaults to an empty role when no role was ever stored',()=>expect(migrateState({children:[],selected:'',plan:'free',days:{},logs:[],saved:[],consent:false}).role).toBe(''));
});
