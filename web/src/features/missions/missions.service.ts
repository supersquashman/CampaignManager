import { http } from '../../core/http';
import type { Mission, MissionStatus } from './missions.types';

export const missionsService = {
  list: (status: MissionStatus, signal?: AbortSignal) => http.get<Mission[]>(`/missions/${status}`, signal),
};
