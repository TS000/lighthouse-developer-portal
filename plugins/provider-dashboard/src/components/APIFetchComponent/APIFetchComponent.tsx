import React from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';

type API = {
  name: string;
  details: string;
};

type DenseTableProps = {
  apis: API[];
};

export const DenseTable = ({ apis }: DenseTableProps) => {

  const rowData = apis.map(api => {
    return {
      name: `${api.name}`,
      details: ``,
    };
  });

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Details', field: 'details' },
  ];

  return (
    <Table
      title="Available APIs"
      options={{ search: true, paging: false }}
      columns={columns}
      data={rowData}
    />
  );
};

export const APIFetchComponent = () => {
  const config = useApi(configApiRef);

  const { value, loading, error } = useAsync(async (): Promise<API[]> => {
  const backendUrl = config.getString('backend.baseUrl');
  const proxyPath = '/api/proxy';
  const basePath = `${backendUrl}${proxyPath}`;

  const response = await fetch(`${basePath}/docserver/apis/`);  // TODO: Move this call into a proper client soon
  const data = await response.json();
  return data;

  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable apis={value || []} />;
};
