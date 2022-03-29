import React, {ReactElement} from 'react';
import { Link } from 'react-router-dom';
import {
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { apiRoutesRef } from '../../routes';

export const BreadcrumbComponent = (): ReactElement => {
    const params = useRouteRefParams(apiRoutesRef);
    const homeView = `/provider-dashboard/`;
    // TODO Full implementation of method is for breadcrumb ticket
  
    if(params.apiName) {
      return (
        <>
          <Link to={homeView}>APIs</Link>&nbsp;&gt;&nbsp;{params.apiName}
        </>
      );
    }
  
    return (<>APIs</>);
  }