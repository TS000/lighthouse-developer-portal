import React from 'react';

import { PageWithHeader } from '@backstage/core-components';

/**
 * Props for {@link TechDocsPageWrapper}
 *
 * @public
 */
export type TechDocsPageWrapperProps = {
  children?: React.ReactNode;
};

/**
 * Component wrapping a techdocs page with Page and Header components
 *
 * @public
 */
export const TechDocsPageWrapper = (props: TechDocsPageWrapperProps) => {
  const { children } = props;
  const generatedSubtitle = `Documentation available in the Lighthouse Developer Portal`;

  return (
    <PageWithHeader
      title="Documentation"
      subtitle={generatedSubtitle}
      themeId="documentation"
    >
      {children}
    </PageWithHeader>
  );
};