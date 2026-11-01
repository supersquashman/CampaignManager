import { useState } from 'preact/hooks';
import { useFetch } from '../../core/use-fetch';
import { Tabs } from '../../shared/components/tabs';
import { EntityList } from '../../shared/components/entity-list';
import { charactersService } from './characters.service';
import type { Character, CharacterType } from './characters.types';
import { CharacterCard } from './character-card';
import { CharacterModal } from './character-modal';
import { CharacterForm } from './character-form';

const TABS = [
  { key: 'pc', label: 'Player characters' },
  { key: 'npc', label: 'NPCs' },
  { key: 'faction', label: 'Factions' },
  { key: 'minion', label: 'Minions'}
];

// export function CharactersPage() {
//   const [kind, setKind] = useState<CharacterType>('pcs');
//   const state = useFetch((s) => charactersService.list(kind, s), [kind]);

//   return (
//     <section>
//       <h2>Characters</h2>
//       <Tabs tabs={TABS} active={kind} onChange={(k) => setKind(k as CharacterType)} />
//       <EntityList state={state} empty="Nothing here yet." />
//     </section>
//   );
// }

// export function CharactersPage() {
//   const [kind, setKind] = useState<CharacterType>('pc');
//   const [selected, setSelected] = useState<Character | null>(null);
//   const { data, error, loading } = useFetch((s) => charactersService.list(kind, s), [kind]);

//   return (
//     <section>
//       <h2>Characters</h2>
//       <Tabs tabs={TABS} active={kind} onChange={(k) => setKind(k as CharacterType)} />

//       {loading && <p class="note">Loading…</p>}
//       {error && <p class="note is-error">Couldn’t load characters ({error}). Check that the Go server is running on :8080.</p>}
//       {data && !data.length && <p class="note">Nothing here yet.</p>}

//       {!!data?.length && (
//         <ul class="card-grid">
//           {data.map((c) => (
//             <li key={c.id}>
//               <CharacterCard character={c} onOpen={() => setSelected(c)} />
//             </li>
//           ))}
//         </ul>
//       )}

//       {selected && <CharacterModal character={selected} onClose={() => setSelected(null)} />}
//     </section>
//   );
// }
export function CharactersPage() {
  const [characterType, setCharacterType] = useState<CharacterType>('pc');
  const [selected, setSelected] = useState<Character | null>(null);
  const [adding, setAdding] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const { data, error, loading } = useFetch(
    (signal) => charactersService.list(characterType, signal),
    [characterType, reloadCount],
  );

  function handleSaved(created: Character) {
    setAdding(false);
    setCharacterType(created.characterType); // jump to the tab the new character lives in
    setReloadCount((current) => current + 1);
  }

  return (
    <section>
      <h2>Characters</h2>
      <div class="toolbar">
        <Tabs tabs={TABS} active={characterType} onChange={(tabKey) => setCharacterType(tabKey as CharacterType)} />
        <button class="primary-button" onClick={() => setAdding(true)}>
          + Add character
        </button>
      </div>

      {loading && <p class="note">Loading…</p>}
      {error && <p class="note is-error">Couldn’t load characters ({error}). Check that the Go server is running on :8080.</p>}
      {data && !data.length && <p class="note">Nothing here yet.</p>}

      {!!data?.length && (
        <ul class="card-grid">
          {data.map((character) => (
            <li key={character.id}>
              <CharacterCard character={character} onOpen={() => setSelected(character)} />
            </li>
          ))}
        </ul>
      )}

      {selected && <CharacterModal character={selected} onClose={() => setSelected(null)} />}
      {adding && <CharacterForm initialType={characterType} onSaved={handleSaved} onClose={() => setAdding(false)} />}
    </section>
  );
}