// import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { themes } from '../themes';
import { isSystemDark } from '../utils';

// export const selectTheme = createSelector(
//   [(state: RootState) => state.theme],
//   theme => {
//     if (theme?.selected === 'system') {
//       return isSystemDark ? themes.dark : themes.light;
//     }
//     return theme ? themes[theme.selected] : themes.light;
//   },
// );

export const selectTheme =
  // [(state: RootState) => state.theme],
  (theme: RootState['theme']) => {
    if (theme?.selected === 'system') {
      return isSystemDark ? themes.dark : themes.light;
    }
    return theme ? themes[theme.selected] : themes.light;
  };
// );

// export const selectThemeKey = createSelector(
//   [(state: RootState) => state.theme],
//   theme => theme?.selected,
// );

export const selectThemeKey = (theme: RootState['theme']) => theme?.selected;
