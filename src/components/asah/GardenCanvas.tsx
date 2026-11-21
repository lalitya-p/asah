import type { AreaId } from '@/data/asahActivities';
import { plantStage } from '@/lib/moments';

type Props = { counts: Record<AreaId, number>; highlight?: AreaId[]; wateringKey?: string; labels: Record<AreaId, string>; onSelect?: (area: AreaId) => void };

const ORDER: AreaId[] = ['moving', 'talking', 'others', 'hands'];
const X: Record<AreaId, number> = { moving: 50, talking: 130, others: 210, hands: 290 };

/** Layered SVG garden: one plant per development area, grown by logged moments. */
export function GardenCanvas({ counts, highlight = [], wateringKey = '', labels, onSelect }: Props) {
  return (
    <svg className="garden-canvas" viewBox="0 0 340 200" role="img" aria-label={ORDER.map(a => `${labels[a]}: ${counts[a]}`).join(', ')}>
      <rect width="340" height="200" fill="var(--garden-sky)" />
      <circle cx="300" cy="36" r="18" fill="var(--garden-sun)" />
      <path d="M0 160 Q85 145 170 158 T340 155 V200 H0Z" fill="var(--garden-soil)" />
      {ORDER.map(area => {
        const stage = plantStage(counts[area]);
        const grow = highlight.includes(area);
        return (
          <g key={area} transform={`translate(${X[area]} 162)`} className={`garden-plant${grow ? ' garden-grow' : ''}`} onClick={onSelect ? () => onSelect(area) : undefined} style={onSelect ? { cursor: 'pointer' } : undefined}>
            <ellipse cx="0" cy="4" rx="22" ry="6" fill="var(--garden-mound)" />
            {stage === 0 ? <><ellipse cx="-5" cy="0" rx="3" ry="2" fill="var(--garden-seed)" /><ellipse cx="5" cy="1" rx="3" ry="2" fill="var(--garden-seed)" /></> : <Plant area={area} stage={stage} />}
            <text y="28" textAnchor="middle" className="garden-label">{labels[area]}</text>
            {grow && <g key={wateringKey} className="garden-water" aria-hidden="true">
              {[-10, 0, 10].map(x => <path key={x} d="M0 -7 Q-5 0 0 3 Q5 0 0 -7Z" transform={`translate(${x} -105)`} fill="var(--garden-water)" />)}
            </g>}
          </g>
        );
      })}
    </svg>
  );
}

function Leaf({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return <path d="M0 0 Q8 -8 16 0 Q8 6 0 0Z" fill="var(--garden-leaf)" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />;
}

function Plant({ area, stage }: { area: AreaId; stage: 1 | 2 | 3 }) {
  const h = stage === 3 ? 78 : stage === 2 ? 50 : 22;
  if (area === 'moving') {
    return <g>
      {Array.from({ length: stage + 1 }, (_, i) => <rect key={i} x="-4" y={-((i + 1) * h) / (stage + 1)} width="8" height={h / (stage + 1) - 2} rx="2" fill="var(--garden-stem)" />)}
      <Leaf x={3} y={-h + 4} r={-30} /><Leaf x={-3} y={-h / 2} r={210} />
      {stage === 3 && <><Leaf x={3} y={-h / 2 - 10} r={-10} /><Leaf x={-3} y={-h + 10} r={200} /></>}
    </g>;
  }
  if (area === 'talking') {
    return <g>
      <path d={`M0 0 C-12 ${-h / 3} 12 ${(-2 * h) / 3} 0 ${-h}`} stroke="var(--garden-stem)" strokeWidth="3" fill="none" />
      <Leaf x={0} y={-h / 3} r={-20} s={0.8} /><Leaf x={0} y={(-2 * h) / 3} r={200} s={0.8} />
      {stage >= 2 && <circle cx="0" cy={-h} r="4" fill="var(--garden-bud)" />}
      {stage === 3 && [[0, -h], [-10, -h + 20], [9, -h + 38]].map(([cx, cy], i) => <g key={i} transform={`translate(${cx} ${cy})`}>{[0, 72, 144, 216, 288].map(r => <ellipse key={r} rx="3" ry="6" cy="-5" fill="var(--garden-petal)" transform={`rotate(${r})`} />)}<circle r="2.5" fill="var(--garden-sun)" /></g>)}
    </g>;
  }
  if (area === 'others') {
    const c = stage * 10;
    return <g>
      <rect x="-3" y={-h + c / 2} width="6" height={h - c / 2} rx="2" fill="var(--garden-trunk)" />
      <circle cx="0" cy={-h} r={c} fill="var(--garden-leaf)" />
      {stage >= 2 && <><circle cx={-c * 0.8} cy={-h + c * 0.4} r={c * 0.7} fill="var(--garden-leaf-deep)" /><circle cx={c * 0.8} cy={-h + c * 0.4} r={c * 0.7} fill="var(--garden-leaf-deep)" /></>}
      {stage === 3 && <><circle cx="-8" cy={-h - 4} r="3" fill="var(--garden-bud)" /><circle cx="10" cy={-h + 6} r="3" fill="var(--garden-bud)" /></>}
    </g>;
  }
  return <g>
    <rect x="-2" y={-h} width="4" height={h} fill="var(--garden-stem)" />
    <Leaf x={0} y={-h / 3} r={-25} /><Leaf x={0} y={-h / 2} r={205} />
    {stage >= 2 && <circle cx="0" cy={-h} r={stage === 3 ? 7 : 5} fill={stage === 3 ? 'var(--garden-trunk)' : 'var(--garden-leaf-deep)'} />}
    {stage === 3 && Array.from({ length: 10 }, (_, i) => <ellipse key={i} rx="3.5" ry="7" cy={-h - 12} cx="0" fill="var(--garden-sun)" transform={`rotate(${i * 36} 0 ${-h})`} />)}
  </g>;
}
