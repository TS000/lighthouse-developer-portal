import React, { FC } from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
import versionNumber from '../../version.json';

interface Environment {
  environment: string;
}

interface AppData {
  auth: Environment;
}

interface ConfigVersion extends Config {
  data?: AppData;
}

export const VersionAndEnv: FC = (): any => {
  const { version } = versionNumber;
  const apiConfig: ConfigVersion = useApi(configApiRef);

  const environment = apiConfig?.data?.auth?.environment;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: '0 auto',
        marginBottom: '0.5rem',
        color: 'white',
        width: '100%',
      }}
    >
      <p>{`v${version}`}</p>
      {environment ? (
        <>
          <p>-</p>
          <p style={{ textTransform: 'capitalize' }}>{environment}</p>
        </>
      ) : null}
    </div>
  );
};
