// Editorial reading paths, not popularity or ranking claims.
// Choose the next question a reader can investigate in the published essays.
export const journalReadingPaths: Record<string, string[]> = {
  'dark-fantasy-gothic-fantasy': ['monstrous-motherhood', 'why-we-root-for-monsters'],
  'she-gave-birth-to-a-dragon': ['monstrous-motherhood', 'dark-fantasy-gothic-fantasy'],
  'monstrous-motherhood': ['why-we-root-for-monsters', 'she-gave-birth-to-a-dragon'],
  'why-we-root-for-monsters': ['monstrous-motherhood', 'she-gave-birth-to-a-dragon'],
};
