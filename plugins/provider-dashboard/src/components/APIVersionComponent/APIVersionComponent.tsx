import React, {ReactElement, useContext} from 'react';
import { Link } from 'react-router-dom';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Compare from '@material-ui/icons/Compare';
import { IconButton, Tooltip, Button} from '@material-ui/core';
import { apiRoutesRef } from '../../routes';
import { docServerApiRef, APIVersion } from '../../docServerApis';
import EnvironmentContext from '../../EnvironmentContext';

type DenseTableProps = {
  versions: APIVersion[];
  apiName: string;
};

const actions = (apiName: string, version: APIVersion) => {
  const viewURL = `/provider-dashboard/apis/${apiName}/versions/${version.majorVersion}/oas`;
  const compareURL = `/provider-dashboard/apis/${apiName}/versions/${version.majorVersion}/oas/latest/delta`;
  return (
    <>
      <Link to={viewURL}>
        <Tooltip title="View">
          <IconButton>
            <OpenInNew aria-label="View" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Link>
      <Link to={compareURL} onClick={ (event) => event.preventDefault() }>
        <Tooltip title="Compare">
          <IconButton>
            <Compare aria-label="Compare" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Link>
    </>
  );
};

const APIVersionTable = ({ apiName, versions }: DenseTableProps) => {

  const rowData = versions.map(version => {
    let updatedAt = ``;

    if(version.updatedAt) {
      updatedAt = new Date(version.updatedAt).toLocaleString();
    }

    return {
      version: `${version.majorVersion}`,
      status: `${version.status}`,
      internal: `${version.internalOnly}`,
      updatedAt: `${updatedAt}`,
      activity: ``,
      actions: actions(apiName, version),
    };
  });

  const columns: TableColumn[] = [
    { title: 'Ver#', field: 'version' },
    { title: 'API Status', field: 'status' },
    { title: 'Internal', field: 'internal' },
    { title: 'Last Updated', field: 'updatedAt' },
    { title: 'Activity', field: 'activity' },
    { title: '', field: 'actions' },
  ];

  const handleAddClick = () => {
    return; // TODO When access management ticket completed
  };

  const TableTitle = (): ReactElement => {
    return (
      <>
        <span id="versionTitle">Versions ({versions.length})</span>
        <Button
          disabled
          onClick={handleAddClick}
        >
          Add Version
        </Button>
      </>
    );
  };

  return (
    <Table
      title={<TableTitle/>}
      options={{ search: false, paging: false, padding: 'dense' }}
      columns={columns}
      data={rowData}
    />
  );
};

export const APIVersionComponent = () => {
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

  return <APIVersionTable apiName={apiName} versions={value || []} />;
};
