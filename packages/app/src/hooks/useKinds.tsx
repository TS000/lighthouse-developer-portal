import { useEffect, useState } from 'react';

import { useEntityKinds } from './';

/**
 * Obtains all current "kinds" within the catalog entry.
 * By default the kinds returned removes Locations as they aren't useful.
 *
 * @returns A list of kinds within catalog entries.
 */
export const useKinds = (): Array<string> => {
  const [allKinds, setAllKinds] = useState<Array<string>>([]);

  // Obtain list of current kinds
  const { kinds } = useEntityKinds();

  // Filters out Location kind if within newKinds
  const updateKinds = (newKinds: Array<string> = []) => {
    const filteredKinds = newKinds.filter(kind => kind !== 'Location');

    setAllKinds(filteredKinds);
  };

  // Updates the list of kinds once the hook returns a value.
  useEffect(() => {
    updateKinds(kinds);
  }, [kinds]);

  return allKinds;
};
