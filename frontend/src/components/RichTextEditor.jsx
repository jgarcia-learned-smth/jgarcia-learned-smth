import { useEffect, useMemo, useState } from 'react'

const formattingOptions = [
  { id: 'bold', label: 'Negrita', command: 'bold' },
  { id: 'italic', label: 'Itálica', command: 'italic' },
  { id: 'insertUnorderedList', label: 'Lista', command: 'insertUnorderedList' },
]

export function RichTextEditor({ value, users, onSave, onAttachFiles, busy }) {
  const [draft, setDraft] = useState(value)
  const [mentionTerm, setMentionTerm] = useState('')

  useEffect(() => {
    setDraft(value)
    setMentionTerm('')
  }, [value])

  const mentionCandidates = useMemo(() => {
    if (!mentionTerm) {
      return []
    }

    return users.filter((user) => user.name.toLowerCase().includes(mentionTerm.toLowerCase())).slice(0, 4)
  }, [mentionTerm, users])

  const applyCommand = (command) => {
    document.execCommand(command)
  }

  const handleInput = (event) => {
    const html = event.currentTarget.innerHTML
    const text = event.currentTarget.textContent || ''
    const mentionMatch = text.match(/@([\wáéíóúñ]*)$/i)

    setDraft(html)
    setMentionTerm(mentionMatch ? mentionMatch[1] : '')
  }

  const appendMention = (user) => {
    const nextValue = `${draft} <span class="rounded bg-violet-500/20 px-1 text-violet-200">@${user.name}</span>&nbsp;`
    setDraft(nextValue)
    setMentionTerm('')
  }

  return (
    <div className="space-y-3 rounded-xl bg-slate-900/70 p-4 ring-1 ring-white/10">
      <div className="flex flex-wrap gap-2">
        {formattingOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:border-violet-400"
            onClick={() => applyCommand(option.command)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        className="min-h-36 rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-200 outline-none focus:border-violet-400"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: draft }}
      />

      {mentionCandidates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {mentionCandidates.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => appendMention(candidate)}
              className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-200 hover:bg-violet-500/30"
            >
              @{candidate.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-100 hover:border-violet-400">
          Adjuntar archivos
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files || []).map((file) => file.name)
              onAttachFiles(files)
              event.target.value = ''
            }}
          />
        </label>

        <button
          type="button"
          onClick={() => onSave(draft)}
          disabled={busy}
          className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {busy ? 'Guardando...' : 'Guardar descripción'}
        </button>
      </div>
    </div>
  )
}
