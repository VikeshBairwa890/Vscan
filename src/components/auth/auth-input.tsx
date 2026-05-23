'use client'
interface Props {
  label: string
  type?: string
  placeholder?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AuthInput({ label, type = 'text', placeholder, name, value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-app-text-muted">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'name'}
        className="h-[42px] w-full rounded-lg border border-app-border bg-app-surface px-3 text-sm text-white outline-none transition duration-150 placeholder:text-app-text-dimmed hover:border-primary/50 hover:bg-app-surface/85 focus:border-primary focus:bg-app-surface focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}