import * as React from 'react';

import WidgetOrder from '@procraft/widget-order';
import { AppProps } from './interfaces';

export const App: React.FC<AppProps> = ({ ...other }) => {
  return <WidgetOrder {...other} />;
};
