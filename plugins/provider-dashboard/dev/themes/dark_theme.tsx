import { createTheme, SimpleThemeOptions } from '@backstage/theme';
import { blue, gray, green, gold, red, common } from "./colorTypes";
import { darkPageTheme } from './pageThemes';

interface customThemes {
  dark: SimpleThemeOptions
}

const darkTheme: SimpleThemeOptions = {
  palette: {
    type: 'dark',
    background: {
      default: gray.A700,               // background for entire website
      paper: gray[800],
    },
    status: {
      ok: green[500],
      warning: gold[500],
      error: red[500],
      running: blue[500],
      pending: gold[100],
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
      main: green[400], 
    },
    banner: {
      info: blue[500],
      error: red[700],
      text: common.white,
      link: common.black
    },
    border: gray[100],
    textContrast: common.black,
    textVerySubtle: gray[200],
    textSubtle: gray[500],
    highlight: gold[100],

    // info boxes
    errorBackground: red[700],
    warningBackground: gold[600],
    infoBackground: blue[100],
    errorText: red[700],
    infoText: blue[800],
    warningText: common.black,
    linkHover: common.linkColorFocus,
    link: common.linkColorDefault,
    gold: gold.A700,
    // Colors for side nav bar
    navigation: {
      background: blue[900],
      indicator: gold.A200,
      color: gray.A400,
      selectedColor: gold.A200,
    },
    pinSidebarButton: {
      icon: gray[900],
      background: gray[400]
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
  defaultPageTheme: 'home',
  pageTheme: darkPageTheme
}

const themes: customThemes = {
  dark: darkTheme
};

const darkThemeVA = createTheme(themes.dark);

export { darkThemeVA };
