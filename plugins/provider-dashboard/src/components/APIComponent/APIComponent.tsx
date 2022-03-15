import React, {ReactElement} from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Grid,
} from '@material-ui/core';
import {
  Content,
  ContentHeader,
  RoutedTabs,
} from '@backstage/core-components';
import { TitleComponent } from '../TitleComponent';
import { APIVersionComponent } from '../APIVersionComponent';
import { APIConfigComponent } from '../APIConfigComponent';
import { OASComponent } from '../OASComponent';

const OverviewPanel = (): ReactElement => {
  return(
    <div>Overview: Work in progress...</div>
  );
};

const RoutingPanel = (): ReactElement => {
  return(
    <div>Auth/Routing: Work in progress...</div>
  );
};

const EndpointPanel = (): ReactElement => {
  return(
    <div>Endpoint Status: Work in progress...</div>
  );
};

interface SubRoute {
  path: string;
  title: string;
  children: JSX.Element;
}

export const APIComponent = () => {

  const panelRoutes: SubRoute[] = [
    { 
      title: "Overview", 
      path: "/overview",
      children: <OverviewPanel />
    },
    { 
      title: "Configuration", 
      path: "/configuration", 
      children: <APIConfigComponent />
    },
    { title: "Authorization/Routing", 
      path: "/routing", 
      children: <RoutingPanel />
    },
    { title: "Manage OAS",
      path: "/versions",
      children: (
        <Routes>
          <Route path='' element={<APIVersionComponent />} />
          <Route path='/:apiVersion/oas' element={<OASComponent />} />
          <Route path='/:apiVersion/oas/*' element={<OASComponent />} />
        </Routes>
      )
    },
    { title: "Endpoint Status",
      path: "/endpoint-status",
      children: <EndpointPanel />
    },
  ];

  return (
    <Content>
      <ContentHeader titleComponent={<TitleComponent/>} />
      <Grid container spacing={3} direction="column">
        <Grid item>
          <RoutedTabs routes={panelRoutes}/>
        </Grid>
      </Grid>
    </Content>
  )
};
