// src/components/ui/MetricBar.tsx
export default function MetricBar({ value }: { value: number }) {
  const color =
    value >= 90 ? 'bg-red-500' :
    value >= 75 ? 'bg-amber-400' :
                  'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-600">{value.toFixed(0)}%</span>
    </div>
  );
}