import type { Character } from './characters.types';
import type { StringMap } from '../../shared/types';
import { MapList, MapListItemized } from '../../shared/components/map-list';
import { describeClasses, rankedMissions } from './characters.helpers';

// export function CharacterCard({ character: c, onOpen }: { character: Character; onOpen: () => void }) {
//   const meta = [c.race, c.class].filter(Boolean).join(' · ');

//   return (
//     <button class="card" onClick={onOpen} aria-haspopup="dialog">
//       <h3>{c.name}</h3>
//       {meta && <p class="card-meta">{meta}</p>}
//       {c.summary && <p class="card-summary">{c.summary}</p>}
//       {/* {c.PreferredMissions && (
//         <p class="card-pref">
            
//           <span>Prefers</span> {c.PreferredMissions.toString()}
//         </p>
//       )} */}
//       <MapList title="Class Levels" entries={c.ClassLevels} />
//       <MapListItemized title="Preferred Missions" entries={c.PreferredMissions} />
//       <MapList title="Party Roles" entries={c.PartyRoles} />
//       <span class="card-more">View full profile →</span>
//     </button>
//   );
// }

export function CharacterCard({ character, onOpen }: { character: Character; onOpen: () => void }) {
  const [topMission] = rankedMissions(character.preferredMissions);

  return (
    <button class="card" onClick={onOpen} aria-haspopup="dialog">
      <h3>{character.name}</h3>
      {/* <h3>{character.ClassLevels}</h3> */}
      <p class="card-meta">{describeClasses(character.ClassLevels)}</p>
      {/* {console.log(character)} */}
      {character.hometown && <p class="card-summary">From {character.hometown}</p>}
      
      {/* <MapList title="Class Levels" entries={character.ClassLevels} /> */}
       {/* <MapListItemized title="Preferred Missions" entries={character.preferredMissions} /> */}
      {topMission && (
        <p class="card-pref">
          <span>Prefers</span> {topMission}
        </p>
      )}
      <span class="card-more">View full profile →</span>
    </button>
  );
}