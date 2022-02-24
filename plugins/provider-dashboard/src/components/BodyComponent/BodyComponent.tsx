import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Header,
  Page,
  HeaderLabel,
} from '@backstage/core-components';
import { APIListComponent } from '../APIListComponent';
import { APIComponent } from '../APIComponent';

export const BodyComponent = () => {
  return (
    <Page themeId="tool">
      <Header title="Provider Dashboard" subtitle="">
        <HeaderLabel label="Owner" value="Team Quokka" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Routes>
        <Route path='/' element={<APIListComponent />} />
        <Route path='/apis/:apiName' element={<APIComponent />} />
        <Route path='/apis/:apiName/*' element={<APIComponent />} />
      </Routes>
    </Page>
    )
};
