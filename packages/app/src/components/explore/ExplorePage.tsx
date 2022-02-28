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
      title="Plugins"
      subtitle="Browse the plugins ecosystem for the Lighthouse developer portal"
    >
      <ExploreLayout.Route path="tools" title="Tools">
        <ToolExplorerContent />
      </ExploreLayout.Route>
    </ExploreLayout>
  );
};
