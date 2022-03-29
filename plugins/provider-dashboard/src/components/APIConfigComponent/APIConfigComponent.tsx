import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import Create from '@material-ui/icons/Create';
import { IconButton, Tooltip } from '@material-ui/core';
import { apiRoutesRef } from '../../routes';
import { docServerApiRef, APIVersion } from '../../docServerApis';
import EnvironmentContext from '../../EnvironmentContext';

type DenseTableProps = {
  versions: APIVersion[];
  apiName: string;
};

type Flatten = {
  [key: string]: any
}

const actions = (apiName: string, version: APIVersion) => {
//   TODO: update this link in another ticket
  const viewURL = `/provider-dashboard/apis/${apiName}/versions/${version.majorVersion}/oas`;

  return (
    <>
      <Link to={viewURL}>
        <Tooltip title="Edit">
          <IconButton>
            <Create aria-label="Edit" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Link>
    </>
  );
};

const APIConfigTable = ({ apiName, versions }: DenseTableProps) => {

  const flattenObj = (obj: Flatten) => {
    Object.entries(obj).map(([key, value]) => {
      if(value && typeof value === 'object') {
           delete obj[key];
           Object.assign(obj, value);
      }
    });
    return obj;
  }

  const apiConfigData = versions.map(version => {  
    const configData = flattenObj(version)
    const tableRowData = Object.entries(configData).map(([key, value]) => {
        return {
            name: `${key}`,
            version: `v${version.majorVersion}`,
            value: `${value}`,
            activity: ``,
            actions: actions(apiName, version),
          };
    });
    return tableRowData;
  });
 
  const rowData = apiConfigData.flat();

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Version', field: 'version' },
    { title: 'Value', field: 'value' },
    { title: '', field: 'actions' },
  ];

  return (
    <Table
    // TODO: change versions.length to count configs
      title={`API Configurations ${rowData.length}`}
      options={{ search: true, paging: false, padding: 'dense' }}
      columns={columns}
      data={rowData}
    /> 
  );
};

export const APIConfigComponent = () => {
  const params = useRouteRefParams(apiRoutesRef);
  const apiName= params.apiName;
  const apiClient = useApi(docServerApiRef);
  const { envContext } = useContext(EnvironmentContext);

  const { value, loading, error } = useAsync(async (): Promise<APIVersion[]> => {
    const docServerData = apiClient.getApiVersions(apiName, envContext);
    return docServerData;
  }, [envContext]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <APIConfigTable apiName={apiName} versions={value || []} />;
};
