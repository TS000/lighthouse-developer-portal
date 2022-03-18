import React, { FC } from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';

interface Environment {
  environment: string;
}

interface App {
  version: string;
  sha: string;
}

interface AppData {
  auth: Environment;
  app: App,
}

interface ConfigVersion extends Config {
  data?: AppData;
}

export const VersionAndEnv: FC = (): any => {
  const apiConfig: ConfigVersion = useApi(configApiRef);
  const environment = apiConfig?.data?.auth?.environment;
  const version = apiConfig?.data?.app?.version;
  const sha = apiConfig?.data?.app?.sha ? apiConfig?.data?.app?.sha.split('-')[1].substring(0, 8) : 'sha-00000';

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
      <p>{`v${version || sha}`}</p>
      {environment ? (
        <>
          <p>-</p>
          <p style={{ textTransform: 'capitalize' }}>{environment}</p>
        </>
      ) : null}
    </div>
  );
};
