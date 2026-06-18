export interface EventTypeCount {
  type: string;
  label: string;
  count: number;
  color: string;
}

interface EventSummaryCardsProps {
  events: EventTypeCount[];
  endToEndRate?: number;
}

export default function EventSummaryCards({
  events,
  endToEndRate,
}: EventSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {events.map((event) => (
        <div
          key={event.type}
          className="bg-bg rounded-xl p-4 border border-border"
        >
          <div className="text-xs text-text-muted mb-2 leading-snug">
            {event.label}
          </div>
          <div className="text-2xl font-bold" style={{ color: event.color }}>
            {event.count.toLocaleString()}
          </div>
        </div>
      ))}
      {endToEndRate !== undefined && (
        <div
          className="bg-bg rounded-xl p-4 border"
          style={{ borderColor: "#f59e0b66" }}
        >
          <div className="text-xs text-text-muted mb-2 leading-snug">
            End-to-End Rate
          </div>
          <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
            {endToEndRate}%
          </div>
        </div>
      )}
    </div>
  );
}
