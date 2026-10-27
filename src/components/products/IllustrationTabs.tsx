'use client'

import { useState, type ComponentType } from 'react'
import { cn } from '@/lib/utils'

export type IllustrationView = {
  id: string
  label: string
  summary: string
  Illustration: ComponentType
}

/** One illustration at a time, so an overview page shows the idea without the full walkthrough. */
export function IllustrationTabs({ views, label }: { views: readonly IllustrationView[]; label: string }) {
  const [active, setActive] = useState(views[0].id)
  const view = views.find((v) => v.id === active) ?? views[0]
  const { Illustration } = view

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex self-start rounded-full border border-border bg-card p-1" role="tablist" aria-label={label}>
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={v.id === active}
              onClick={() => setActive(v.id)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                v.id === active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{view.summary}</p>
      </div>
      <div className="mt-6" role="tabpanel">
        <Illustration />
      </div>
    </div>
  )
}
