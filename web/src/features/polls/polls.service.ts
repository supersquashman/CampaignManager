import { http } from '../../core/http';
import type { PollName, PollResult } from './polls.types';

export const pollsService = {
  get: (name: PollName, signal?: AbortSignal) => http.get<PollResult[]>(`/polls/${name}`, signal),
};
