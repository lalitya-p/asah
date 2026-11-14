import type { AreaId } from '@/data/asahActivities';
import moving from '@/assets/asah/area-moving.svg.asset.json';
import hands from '@/assets/asah/area-hands.svg.asset.json';
import talking from '@/assets/asah/area-talking.svg.asset.json';
import others from '@/assets/asah/area-others.svg.asset.json';
const icons = { moving, hands, talking, others } as const;
export function AreaIcon({ area }: { area: AreaId }) { return <img src={icons[area].url} alt="" width={40} height={40} />; }
