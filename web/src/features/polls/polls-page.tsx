import { useFetch } from '../../core/use-fetch';
import { EntityList } from '../../shared/components/entity-list';
import { pollsService } from './polls.service';

export function PollsPage() {
  const state = useFetch((s) => pollsService.get('mission_interest', s), []);

  return (
    <section>
      <h2>Mission interest poll</h2>
      <EntityList state={state} empty="No poll responses yet." />
    </section>
  );
}
