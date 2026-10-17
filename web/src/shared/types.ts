/** Loose shape until you pin down the real JSON from the Go server. */
export interface Entity {
  id?: string | number;
  name?: string;
  title?: string;
  [field: string]: unknown;
}
