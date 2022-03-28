import { createTheme, SimpleThemeOptions } from '@backstage/theme';
import { blue, gray, green, gold, red, common } from "./colorTypes";
import { lightPageTheme } from './pageThemes';

interface customThemes {
  light: SimpleThemeOptions,
}

const lightTheme: SimpleThemeOptions = {
  palette: {
    type: 'light',
    background: {
      default: gray.A100,
      paper: common.white,
    },
    status: {
      ok: green.A400,
      warning: gold[500],
      error: red[600],
      running: blue[500],
      pending: gold[400],
      aborted: gray[500]
    },
    bursts: {
      fontColor: common.white,
      slackChannelText: gray.A200,
      backgroundColor: {
        default: common.linkColorVisited
      },
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)'
      }
    },
    primary: {
      main: blue[900]
    },
    banner: {
      info: blue[500],
      error: red[600],
      text: common.white,
      link: blue[500]
    },
    border: gray[100],
    textContrast: common.black,
    textVerySubtle: gray[200],
    textSubtle: gray[500],
    highlight: gold[50],
    // info boxes
    errorBackground: red[100],
    warningBackground: gold[500],
    infoBackground: blue.A200,
    errorText: red[700],
    infoText: blue[800],
    warningText: common.base,
    linkHover: common.linkColorFocus,
    link: common.linkColorDefault,
    gold: gold[500],
    // Colors for side nav
    navigation: {
      background: blue[900],
      indicator: gold[300],
      color: common.white,
      selectedColor: gold[500],
    },
    pinSidebarButton: {
      icon: blue[500],
      background: blue[50]
    },
    tabbar: {
      indicator: green.A100
    }
  },
  
  fontFamily: [
    '"Source Sans Pro"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  // Headers
  defaultPageTheme: "home",
  pageTheme: lightPageTheme
}

const themes: customThemes = {
  light: lightTheme,
};

const lightThemeVA = createTheme(themes.light);

export { lightThemeVA };
