import { useState, useEffect } from 'react';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import useObservable from 'react-use/lib/useObservable';

/**
 * Easily access and manage a list of currently dismissed banners.
 */
export const useDismissableBanner = () => {
  const storageApi = useApi(storageApiRef);
  const notificationsStore = storageApi.forBucket('notifications');
  const rawDismissedBanners =
    notificationsStore.snapshot<string[]>('dismissedBanners').value ?? [];

  // Lists dismissed banners without duplicates
  const [dismissedBanners, setDismissedBanners] = useState(
    new Set(rawDismissedBanners),
  );

  const observedItems = useObservable(
    notificationsStore.observe$<string[]>('dismissedBanners'),
  );

  // Updates the list of dismissed banners to remove duplicates
  useEffect(() => {
    if (observedItems?.value) {
      const currentValue = observedItems?.value ?? [];
      setDismissedBanners(new Set(currentValue));
    }
  }, [observedItems?.value]);

  // Adds a new dismissed banner to the dismissedBanners list
  const addBanner = (id: string): void => {
    const dismissedBannersArr = Array.from(dismissedBanners);

    notificationsStore.set('dismissedBanners', [...dismissedBannersArr, id]);
  };

  // Removes a dismissed banner from the dismissedBanners list
  const removeBanner = (id: string): void => {
    const updatedBannersArr = Array.from(dismissedBanners);
    const updatedBanners = [...updatedBannersArr].filter(
      bannerId => id !== bannerId,
    );

    notificationsStore.set('dismissedBanners', [...updatedBanners]);
  };

  return {
    dismissedBanners,
    addBanner,
    removeBanner,
  };
};
