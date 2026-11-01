import { MapList, MapListItemized, Section } from '../../shared/components/map-list';
import { Modal } from '../../shared/components/modal';
import { describeClasses, rankedMissions } from './characters.helpers';
import type { Character } from './characters.types';

// function Section({ title, children }: { title: string; children: preact.ComponentChildren }) {
//   return (
//     <section class="modal-section">
//       <h3>{title}</h3>
//       {children}
//     </section>
//   );
// }

// export function CharacterModal({ character: c, onClose }: { character: Character; onClose: () => void }) {
//     const meta = [c.race, c.class].filter(Boolean).join(' · ');

//     return (
//         <Modal onClose={onClose}>
//             <h2 id="modal-title">{c.name}</h2>
//             {meta && <p class="card-meta">{meta}</p>}
//             {/* {c.preferred_mission_type && (
//                 <p class="card-pref">
//                     <span>Prefers</span> {c.preferred_mission_type}
//                 </p>
//             )} */}

//             {/* {c.ClassLevels && (
//         <Section title="Class Levels">
//           <p>{c.ClassLevels}</p>
//         </Section>
//       )} */}
//             <MapList title="Class Levels" entries={c.ClassLevels} />
//             <MapListItemized title="Preferred Missions" entries={c.PreferredMissions} />
//             <MapList title="Party Roles" entries={c.PartyRoles} />

//             {/* <div class="modal-cols">
//         {!!c.likes?.length && (
//           <Section title="Likes">
//             <ul>{c.likes.map((l) => <li key={l}>{l}</li>)}</ul>
//           </Section>
//         )}
//         {!!c.dislikes?.length && (
//           <Section title="Dislikes">
//             <ul>{c.dislikes.map((d) => <li key={d}>{d}</li>)}</ul>
//           </Section>
//         )}
//       </div> */}

//             {/* {!c.backstory && !c.likes?.length && !c.dislikes?.length && (
//         <p class="card-summary">No further details recorded yet.</p>
//       )} */}
//         </Modal>
//     );
// }

function PairList({ title, entries }: { title: string; entries?: Record<string, string | number> }) {
  const pairs = Object.entries(entries ?? {});
  if (!pairs.length) return null;
  return (
    <Section title={title}>
      <ul class="pair-list">
        {pairs.map(([label, value]) => (
          <li key={label}>
            <span class="pair-label">{label}</span>
            <span class="pair-value">{value}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function CharacterModal({ character, onClose }: { character: Character; onClose: () => void }) {
  const missions = rankedMissions(character.preferredMissions);

  return (
    <Modal onClose={onClose}>
      <h2 id="modal-title">{character.name}</h2>
      <p class="card-meta">{describeClasses(character.ClassLevels)}</p>

      <div class="modal-cols">
        {character.hometown && (
          <Section title="Hometown">
            <p>{character.hometown}</p>
          </Section>
        )}
        {character.starting_town && (
          <Section title="Starting town">
            <p>{character.starting_town}</p>
          </Section>
        )}
      </div>

      {/* <PairList title="Class levels" entries={character.ClassLevels} /> */}

      {!!missions.length && (
        <Section title="Preferred missions">
          <ol class="ranked-list">
            {missions.map((missionType, position) => (
              <li key={position}>{missionType}</li>
            ))}
          </ol>
        </Section>
      )}

      <PairList title="Party roles" entries={character.partyRoles} />
    </Modal>
  );
}