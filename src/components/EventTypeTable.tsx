export interface EventTypeRow {
  type: string;
  count: number;
}

interface EventTypeTableProps {
  rows: EventTypeRow[];
}

export default function EventTypeTable({ rows }: EventTypeTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-text-muted text-sm text-center py-8">
        No events recorded yet.
      </p>
    );
  }

  const maxCount = rows[0]?.count ?? 1;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-text-muted font-medium pb-3 pr-4">
              Event Type
            </th>
            <th className="text-right text-text-muted font-medium pb-3 w-20">
              Count
            </th>
            <th className="text-left text-text-muted font-medium pb-3 pl-4 w-40">
              Volume
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.type}
              className="border-b border-border/40 hover:bg-bg/40 transition-colors"
            >
              <td className="py-2.5 pr-4 font-mono text-text">{row.type}</td>
              <td className="py-2.5 text-right text-text tabular-nums">
                {row.count.toLocaleString()}
              </td>
              <td className="py-2.5 pl-4">
                <div className="h-1.5 bg-border rounded-full">
                  <div
                    className="h-1.5 bg-accent rounded-full"
                    style={{
                      width: `${Math.round((row.count / maxCount) * 100)}%`,
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
