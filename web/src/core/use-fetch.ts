import { useEffect, useState } from 'preact/hooks';

export type FetchState<T> = { data?: T; error?: string; loading: boolean };

export function useFetch<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ loading: true });

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ loading: true });
    load(ctrl.signal)
      .then((data) => setState({ data, loading: false }))
      .catch((e: Error) => {
        if (ctrl.signal.aborted) return;
        setState({ error: e.message, loading: false });
      });
    return () => ctrl.abort();
  }, deps);

  return state;
}
