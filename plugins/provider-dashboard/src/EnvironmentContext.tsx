import { createContext } from 'react';

const DefaultContext: any = {};
const EnvironmentContext = createContext(DefaultContext);

export default EnvironmentContext;