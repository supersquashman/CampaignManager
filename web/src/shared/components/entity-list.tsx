import type { FetchState } from '../../core/use-fetch';
import type { Entity } from '../types';

const HIDDEN = new Set(['id', 'name', 'title']);

function show(v: unknown): string {
  return typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v);
}

export function EntityList({ state, empty }: { state: FetchState<Entity[]>; empty: string }) {
  if (state.loading) return <p class="note">Loading…</p>;
  if (state.error) return <p class="note is-error">Couldn’t load this list ({state.error}). Check that the Go server is running on :8080.</p>;
  if (!state.data?.length) return <p class="note">{empty}</p>;

  return (
    <ul class="entities">
      {state.data.map((e, i) => (
        <li key={e.id ?? i}>
          <h3>{e.name ?? e.title ?? `Entry ${i + 1}`}</h3>
          <dl>
            {Object.entries(e)
              .filter(([k, v]) => !HIDDEN.has(k) && v != null && v !== '')
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k.replace(/_/g, ' ')}</dt>
                  <dd>{show(v)}</dd>
                </div>
              ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}
