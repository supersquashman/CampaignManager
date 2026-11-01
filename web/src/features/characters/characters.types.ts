import type { Entity, StringMap } from '../../shared/types';

export type CharacterType = 'pc' | 'npc' | 'faction' | 'minion';

export const CHARACTER_TYPES: { value: CharacterType; label: string }[] = [
  { value: 'pc', label: 'Player character' },
  { value: 'npc', label: 'NPC' },
  { value: 'minion', label: 'Minion' },
];

export const STARTING_TOWNS: {value: string, label:string}[] = [
  {value:'pearl', label:'The Pearl'},
  {value:'mines', label:'The Mines'},
  {value:'fishtown', label:'Fishing Village'}
]

export const PARTY_ROLES: string[] = ['Face','Negotiator','DPS','Healing','Tank','Stealth','Thief']
export const ROLE_ORDINALITY: string[] = ['Primary','Secondary','Tertiary','Emergency']


// export interface Character extends Entity {
//     id: number;
//     name: string;
//     chartype: CharacterType;
//     race?: string;
//     class?: string;
//     PreferredMissions?: StringMap;
//     PartyRoles?: StringMap
//     ClassLevels?: StringMap;
// }

export type Character = {
  id: number;
  name: string;
  characterType: CharacterType;
  ClassLevels: Record<string, number>; // {class: level}
  preferredMissions?: Record<string, string>; // {rankingNumber: missionType}
  partyRoles?: Record<string, string>; // {rankString: roleString}
  hometown?: string;
  starting_town?: string;
};

export type CharacterDraft = Omit<Character, 'id'>;
