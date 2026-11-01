import { http } from '../../core/http';
import type { Character, CharacterDraft, CharacterType } from './characters.types';

// export const charactersService = {
//   list: (kind: CharacterType, signal?: AbortSignal) => http.get<Character[]>(`/characters/${kind}`, signal),
// };
export const charactersService = {
  list: (characterType: CharacterType, signal?: AbortSignal) =>
    http.get<Character[]>(`/characters/${characterType}`, signal),
  create: (draft: CharacterDraft) => http.post<Character>('/characters', draft),
};