import React from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
// import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useApi } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { IconButton, Tooltip } from '@material-ui/core';
import { docServerApiRef } from '../../docServerApis';


type API = {
  name: string;
  description: string;
  owner: string;
  health: string;
};

type DenseTableProps = {
  apis: API[];
};

function viewAPIPage (api: API){
  // TODO Full effort for this function to be completed by component navigation ticket
  window.location.href =`/provider-dashboard/${api.name}`;
}

const actions = (api: API) => {
  return (
    <Tooltip title="View">
      <IconButton onClick={() => viewAPIPage(api)}>
        <OpenInNew aria-label="View" fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export const DenseTable = ({ apis }: DenseTableProps) => {

  const rowData = apis.map(api => {
    return {
      name: `${api.name}`,
      description: ``,
      owner: ``,
      health: ``,
      actions: actions(api),
    };
  });

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Description', field: 'description' },
    { title: 'Owner', field: 'owner' },
    { title: 'Health', field: 'health' },
    { title: '', field: 'actions' },
  ];

  const tableRef = React.useRef();

  const refreshTitle = () => {
    const currentTable: any = tableRef?.current;
    const renderedRows = currentTable?.state.data.length;
    let titleText = `Total available ${apis.length}`;

    if(renderedRows < apis.length)
    titleText = `Found ${renderedRows} results`;

    const titleDiv = document.getElementById('apiTitle');
    if(titleDiv)
      titleDiv.innerHTML = titleText;
  };

  return (
    <Table
      title={<div id="apiTitle">Total available {apis.length}</div>}
      options={{ search: true, paging: false }}
      columns={columns}
      data={rowData}
      tableRef={tableRef}
      onSearchChange={refreshTitle}
    />
  );
};

export const APIFetchComponent = () => {
  // const config = useApi(configApiRef);
  const apiClient = useApi(docServerApiRef);

  const { value, loading, error } = useAsync(async (): Promise<API[]> => {
    // const backendUrl = config.getString('backend.baseUrl');
    // const proxyPath = '/api/proxy';
    // const basePath = `${backendUrl}${proxyPath}`;
    // const data = await response.json();
    // return data;
    const docServerData = apiClient.listApis();
    return docServerData;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable apis={value || []} />;
};
