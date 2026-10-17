import { http } from '../../core/http';
import type { Character, CharacterKind } from './characters.types';

export const charactersService = {
  list: (kind: CharacterKind, signal?: AbortSignal) => http.get<Character[]>(`/characters/${kind}`, signal),
};
