import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import { MissionsPage } from './features/missions/missions-page';
import { CharactersPage } from './features/characters/characters-page';
import { PollsPage } from './features/polls/polls-page';

const NAV = [
  { href: '/missions', label: 'Missions' },
  { href: '/characters', label: 'Characters' },
  { href: '/polls', label: 'Polls' },
];

function Shell() {
  const { path } = useLocation();
  return (
    <>
      <header class="top">
        <h1>Campaign</h1>
        <nav>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} class={path.startsWith(n.href) ? 'is-active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <Router>
          <Route path="/" component={MissionsPage} />
          <Route path="/missions" component={MissionsPage} />
          <Route path="/characters" component={CharactersPage} />
          <Route path="/polls" component={PollsPage} />
          <Route default component={() => <p class="note">Page not found.</p>} />
        </Router>
      </main>
    </>
  );
}

export function App() {
  return (
    <LocationProvider>
      <Shell />
    </LocationProvider>
  );
}
