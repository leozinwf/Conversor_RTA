export default function DataPreview({ data }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white h-[450px] flex flex-col">
      <div className="overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              {headers.map((header) => (
                <th key={header} className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-tighter border-r border-slate-200 last:border-0">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-emerald-50 transition-colors group">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-3 text-sm text-slate-600 border-r border-slate-100 last:border-0 font-medium">
                    {row[header]?.toString() || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}