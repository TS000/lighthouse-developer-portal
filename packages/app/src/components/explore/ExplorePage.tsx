import { ToolExplorerContent, ExploreLayout } from '@backstage/plugin-explore';
import React from 'react';

/**
 * Contains a custom explore page that only displays the tool toolbar.
 *
 * Other options are domains and ecosystems
 *
 * @see https://github.com/backstage/backstage/tree/master/plugins/explore
 */
export const ExplorePage = () => {
  return (
    <ExploreLayout
      title="Explore the Embark ecosystem"
      subtitle="Browse our ecosystem"
    >
      <ExploreLayout.Route path="tools" title="Tools">
        <ToolExplorerContent />
      </ExploreLayout.Route>
    </ExploreLayout>
  );
};
