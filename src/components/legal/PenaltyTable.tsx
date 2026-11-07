import { DPDP_PENALTIES, PENALTY_CAVEAT } from '@/lib/dpdp-facts'

export function PenaltyTable() {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">What went wrong</th>
              <th scope="col" className="px-4 py-3 font-medium">Legal source</th>
              <th scope="col" className="px-4 py-3 font-medium">Legal maximum</th>
            </tr>
          </thead>
          <tbody>
            {DPDP_PENALTIES.map((penalty) => (
              <tr key={penalty.provision} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{penalty.failure}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{penalty.provision}</td>
                <td className="px-4 py-3 font-medium text-foreground">{penalty.maximum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{PENALTY_CAVEAT}</p>
    </div>
  )
}
