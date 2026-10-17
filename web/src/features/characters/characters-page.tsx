import { useState } from 'preact/hooks';
import { useFetch } from '../../core/use-fetch';
import { Tabs } from '../../shared/components/tabs';
import { EntityList } from '../../shared/components/entity-list';
import { charactersService } from './characters.service';
import type { CharacterKind } from './characters.types';

const TABS = [
  { key: 'pcs', label: 'Player characters' },
  { key: 'npcs', label: 'NPCs' },
  { key: 'factions', label: 'Factions' },
];

export function CharactersPage() {
  const [kind, setKind] = useState<CharacterKind>('pcs');
  const state = useFetch((s) => charactersService.list(kind, s), [kind]);

  return (
    <section>
      <h2>Characters</h2>
      <Tabs tabs={TABS} active={kind} onChange={(k) => setKind(k as CharacterKind)} />
      <EntityList state={state} empty="Nothing here yet." />
    </section>
  );
}
