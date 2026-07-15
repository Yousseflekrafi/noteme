import { useAuth } from '../Protected/AuthContext'

export default function Account() {
  const { user } = useAuth()
  if (!user) return null

  const fields: { label: string; value: string }[] = [
    { label: 'Name', value: user.name ?? '—' },
    { label: 'Email', value: user.email },
    { label: 'User ID', value: user.id },
    ...(user.createdAt ? [{ label: 'Member since', value: new Date(user.createdAt).toLocaleDateString() }] : []),
  ]

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink sm:text-3xl">Account</h1>

      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral-500 font-display text-xl font-semibold text-white">
            {(user.name ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{user.name ?? user.email}</p>
            <p className="text-sm text-ink/50">{user.email}</p>
          </div>
        </div>

        <dl className="divide-y divide-ink/10">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center justify-between gap-4 py-3 text-sm">
              <dt className="text-ink/50">{f.label}</dt>
              <dd className="truncate font-medium text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}