export interface Pair {
  label: string;
  value: string;
}

/**
 * Rows -> JSON object. With `ranked`, labels are ignored and the keys become
 * "1", "2", ... in row order (blank rows are skipped, so ranks stay contiguous).
 */
export function pairsToObject(pairs: Pair[], ranked = false): Record<string, string> {
  const result: Record<string, string> = {};
  let rank = 0;
  for (const pair of pairs) {
    const label = pair.label.trim();
    const value = pair.value.trim();
    if (ranked) {
      if (value) result[String(++rank)] = value;
    } else if (label || value) {
      result[label] = value;
    }
  }
  return result;
}

interface PairEditorProps {
  title: string;
  labelHeading: string;
  valueHeading: string;
  pairs: Pair[];
  onChange: (pairs: Pair[]) => void;
  numeric?: boolean;
  ranked?: boolean;
  requireFirst?: boolean;
  error?: string;
}

export function PairEditor(props: PairEditorProps) {
  const { pairs, onChange, numeric, ranked } = props;

  const update = (position: number, change: Partial<Pair>) =>
    onChange(pairs.map((pair, current) => (current === position ? { ...pair, ...change } : pair)));

  const remove = (position: number) =>
    onChange(pairs.length > 1 ? pairs.filter((unused, current) => current !== position) : [{ label: '', value: '' }]);

  return (
    <fieldset class="pair-editor">
      <legend>{props.title}</legend>
      {pairs.map((pair, position) => (
        <div class={ranked ? 'pair-row is-ranked' : 'pair-row'} key={position}>
          {ranked ? (
            <span class="pair-rank">#{position + 1}</span>
          ) : (
            <input
              aria-label={props.labelHeading}
              placeholder={props.labelHeading}
              required={props.requireFirst && position === 0}
              value={pair.label}
              onInput={(event) => update(position, { label: event.currentTarget.value })}
            />
          )}
          <input
            aria-label={props.valueHeading}
            placeholder={props.valueHeading}
            type={numeric ? 'number' : 'text'}
            min={numeric ? 1 : undefined}
            required={props.requireFirst && position === 0}
            value={pair.value}
            onInput={(event) => update(position, { value: event.currentTarget.value })}
          />
          <button type="button" class="icon-button" aria-label="Remove row" onClick={() => remove(position)}>
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        class="link-button"
        onClick={() => onChange([...pairs, { label: '', value: numeric ? '1' : '' }])}
      >
        + Add row
      </button>
      {props.error && <p class="field-error">{props.error}</p>}
    </fieldset>
  );
}
