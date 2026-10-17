export interface Tab {
  key: string;
  label: string;
}

export function Tabs(props: { tabs: Tab[]; active: string; onChange: (key: string) => void }) {
  return (
    <div class="tabs" role="tablist">
      {props.tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={t.key === props.active}
          class={t.key === props.active ? 'tab is-active' : 'tab'}
          onClick={() => props.onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
