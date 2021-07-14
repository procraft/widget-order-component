import * as React from 'react';
import { ThemeProvider as OriginalThemeProvider } from 'styled-components';
import { selectTheme } from './slice/selectors';

export const ThemeProvider = (props: { children: React.ReactChild }) => {
  const theme = selectTheme({
    theme: {
      selected: 'system',
    },
  });
  return (
    <OriginalThemeProvider theme={theme}>
      {React.Children.only(props.children)}
    </OriginalThemeProvider>
  );
};
