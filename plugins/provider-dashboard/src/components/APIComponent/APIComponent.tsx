import React, {ReactElement} from 'react';
import { 
  Grid,
} from '@material-ui/core';
import {
  Content,
  ContentHeader,
  RoutedTabs,
} from '@backstage/core-components';
import { TitleComponent } from '../TitleComponent';

const OverviewPanel = (): ReactElement => {
  return(
    <div>Overview: Work in progress...</div>
  );
};

const ConfigPanel = (): ReactElement => {
  return(
    <div>Configuration: Work in progress...</div>
  );
};

const RoutingPanel = (): ReactElement => {
  return(
    <div>Auth/Routing: Work in progress...</div>
  );
};

const ManagePanel = (): ReactElement => {
  return(
    <div>Manage OAS: Work in progress...</div>
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
      path: "",
      children: <OverviewPanel />
    },
    { 
      title: "Configuration", 
      path: "/configuration", 
      children: <ConfigPanel />
    },
    { title: "Authorization/Routing", 
      path: "/routing", 
      children: <RoutingPanel />
    },
    { title: "Manage OAS",
      path: "/manage-oas",
      children: <ManagePanel />
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
