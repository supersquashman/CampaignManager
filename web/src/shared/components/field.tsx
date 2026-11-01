import type { ComponentChildren } from 'preact';

export function Field(props: { label: string; required?: boolean; error?: string; children: ComponentChildren }) {
  return (
    <label class="field">
      <span>
        {props.label}
        {props.required && ' *'}
      </span>
      {props.children}
      {props.error && <span class="field-error">{props.error}</span>}
    </label>
  );
}
