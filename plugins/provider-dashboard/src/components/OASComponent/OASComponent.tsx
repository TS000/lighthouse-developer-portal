import React from 'react';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { apiVersionRoutesRef } from '../../routes';

export const OASComponent = () => {
  const params = useRouteRefParams(apiVersionRoutesRef);
  const apiName= params.apiName;
  const apiVersion = params.apiVersion;

  return(
    <div>Manage {apiName} ver. {apiVersion} OAS Iteration: Work in progress...</div>
  );
};
