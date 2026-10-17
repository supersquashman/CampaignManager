import { useState } from 'preact/hooks';
import { useFetch } from '../../core/use-fetch';
import { Tabs } from '../../shared/components/tabs';
import { EntityList } from '../../shared/components/entity-list';
import { missionsService } from './missions.service';
import type { MissionStatus } from './missions.types';

const TABS = [
  { key: 'open', label: 'Open' },
  { key: 'completed', label: 'Completed' },
];

export function MissionsPage() {
  const [status, setStatus] = useState<MissionStatus>('open');
  const state = useFetch((s) => missionsService.list(status, s), [status]);

  return (
    <section>
      <h2>Missions</h2>
      <Tabs tabs={TABS} active={status} onChange={(k) => setStatus(k as MissionStatus)} />
      <EntityList state={state} empty={`No ${status} missions yet.`} />
    </section>
  );
}
