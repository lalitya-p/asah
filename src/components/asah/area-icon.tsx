import { Footprints, Hand, MessageCircle, Users } from 'lucide-react';
import type { AreaId } from '@/data/asahActivities';
const icons = { moving: Footprints, hands: Hand, talking: MessageCircle, others: Users } as const;
export function AreaIcon({ area }: { area: AreaId }) { const Icon = icons[area]; return <Icon aria-hidden size={24} />; }
