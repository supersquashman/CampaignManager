import type { Entity } from '../../shared/types';

export type CharacterKind = 'pcs' | 'npcs' | 'factions';
export interface Character extends Entity {}
