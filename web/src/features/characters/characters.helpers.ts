/** {Rogue: 3, Wizard: 2} -> "Rogue 3 · Wizard 2" */
export function describeClasses(classLevels?: Record<string, number>): string {
  return Object.entries(classLevels ?? {})
    .map(([className, level]) => `${className}: ${level}`)
    .join(', ')// .join(' · ');
}

/** {"2": "Rescue", "1": "Exploration"} -> ["Exploration", "Rescue"] */
export function rankedMissions(preferred?: Record<string, string>): string[] {
  return Object.entries(preferred ?? {})
    .sort(([first], [second]) => Number(first) - Number(second))
    .map(([, missionType]) => missionType);
}
