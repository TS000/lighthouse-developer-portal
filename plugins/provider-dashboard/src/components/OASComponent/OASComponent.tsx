import React, {ReactElement} from 'react';
import { Link } from 'react-router-dom';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Compare from '@material-ui/icons/Compare';
import CloudUpload from '@material-ui/icons/CloudUpload';
import TransformIcon from '@material-ui/icons/Transform';
import { IconButton, Tooltip, Button} from '@material-ui/core';
import { apiVersionRoutesRef } from '../../routes';
import { docServerApiRef, OAS } from '../../docServerApis';

type DenseTableProps = {
  oasResults: OAS[];
  apiName: string;
  apiVersion: string;
};

const actions = (apiName: string, apiVersion: string, iteration: string) => {
  const viewURL = `/provider-dashboard/apis/${apiName}/versions/${apiVersion}/oas/${iteration}`;
  const viewOriginalURL = `/provider-dashboard/apis/${apiName}/versions/${apiVersion}/oas/${iteration}`;
  const compareURL = `/provider-dashboard/apis/${apiName}/versions/${apiVersion}/oas/${iteration}/delta`;
  const uploadURL = `/provider-dashboard/apis/${apiName}/versions/${apiVersion}/oas/${iteration}/upload`;
  const retransformURL = `/provider-dashboard/apis/${apiName}/versions/${apiVersion}/oas/${iteration}/retransform`;
  return (
    <>
      <Link to={viewURL}>
        <Tooltip title="View OAS">
          <IconButton>
            <OpenInNew aria-label="View OAS" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Link>
      <Link to={viewOriginalURL}>
        <Tooltip title="View original OAS">
          <IconButton>
            <OpenInNew aria-label="View original OAS" fontSize="small" />
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
      <Link to={uploadURL} onClick={ (event) => event.preventDefault() }>
        <Tooltip title="Upload">
          <IconButton>
            <CloudUpload aria-label="Upload" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Link>
      <Link to={retransformURL} onClick={ (event) => event.preventDefault() }>
        <Tooltip title="Retransform">
          <IconButton>
            <TransformIcon aria-label="Retransform" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Link>
    </>
  );
};

const OASIterationTable = ({ apiName, apiVersion, oasResults }: DenseTableProps) => {

  const rowData = oasResults.map(oas => {
    let updatedAt = ``;
    const iteration = oas.iteration;

    if(oas.updatedAt) {
      updatedAt = new Date(oas.updatedAt).toLocaleString();
    }

    return {
      iteration: `${iteration}`,
      status: `${oas.status}`,
      updatedAt: `${updatedAt}`,
      actions: actions(apiName, apiVersion, iteration),
    };
  });

  const columns: TableColumn[] = [
    { title: 'ID', field: 'iteration' },
    { title: 'Status', field: 'status' },
    { title: 'Last Updated', field: 'updatedAt' },
    { title: '', field: 'actions' },
  ];

  const handleAddClick = () => {
    return; // TODO When access management ticket completed
  };

  const TableTitle = (): ReactElement => {
    return (
      <>
        <span id="iterationTitle">Iterations ({oasResults.length})</span>
        <Button
          disabled
          onClick={handleAddClick}
        >
          Upload Latest
        </Button>
        <Button
          disabled
          onClick={handleAddClick}
        >
          Compare
        </Button>
      </>
    );
  };

  return (
    <Table
      title={<TableTitle/>}
      options={{ search: false, paging: true }}
      columns={columns}
      data={rowData}
    />
  );
};

export const OASComponent = () => {
  const params = useRouteRefParams(apiVersionRoutesRef);
  const apiName= params.apiName;
  const apiVersion = params.apiVersion;

  const apiClient = useApi(docServerApiRef);

  const { value, loading, error } = useAsync(async (): Promise<OAS[]> => {
    const docServerData = apiClient.getOASIterations(apiName, apiVersion);
    return docServerData;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <OASIterationTable apiName={apiName} apiVersion={apiVersion} oasResults={value || []} />;
};
