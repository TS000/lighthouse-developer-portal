import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Header,
  Page,
  HeaderLabel,
} from '@backstage/core-components';
import { APIListComponent } from '../APIListComponent';
import { APIComponent } from '../APIComponent';
import pluginConfig from '../../pluginConfig.json';

export const BodyComponent = () => {
  return (
    <Page themeId="tool">
      <Header title={pluginConfig.headerTitle} subtitle="">
        <HeaderLabel label="Owner" value={pluginConfig.owner} />
        <HeaderLabel label="Lifecycle" value={pluginConfig.lifecycle} />
      </Header>
      <Routes>
        <Route path='/' element={<APIListComponent />} />
        <Route path='/apis/:apiName' element={<APIComponent />} />
        <Route path='/apis/:apiName/*' element={<APIComponent />} />
      </Routes>
    </Page>
    )
};
