import React, {ReactElement, useState} from 'react';
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
import EnvironmentContext from '../../EnvironmentContext';
import pluginConfig from '../../pluginConfig.json';

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
  const tabs = pluginConfig.tabs;
  const panelRoutes: SubRoute[] = [
    { 
      title: tabs.overview.title, 
      path: tabs.overview.path,
      children: <OverviewPanel />
    },
    { 
      title: tabs.configuration.title, 
      path: tabs.configuration.path, 
      children: <APIConfigComponent />
    },
    { title:  tabs.routing.title, 
      path: tabs.routing.path, 
      children: <RoutingPanel />
    },
    { title: tabs.versions.title,
      path: tabs.versions.path,
      children: (
        <Routes>
          <Route path='' element={<APIVersionComponent />} />
          <Route path='/:apiVersion/oas' element={<OASComponent />} />
          <Route path='/:apiVersion/oas/*' element={<OASComponent />} />
        </Routes>
      )
    },
    { title: tabs.endpointStatus.title,
      path: tabs.endpointStatus.path,
      children: <EndpointPanel />
    },
  ];

  const [envContext, setEnvContext] = useState(pluginConfig.defaultEnv);

  return (
    <Content>
      <EnvironmentContext.Provider value={{ envContext, setEnvContext }}>
        <ContentHeader titleComponent={<TitleComponent/>} />
        <Grid container spacing={3} direction="column">
          <Grid item>
            <RoutedTabs routes={panelRoutes}/>
          </Grid>
        </Grid>
      </EnvironmentContext.Provider>
    </Content>
  )
};
