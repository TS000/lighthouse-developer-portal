import { createTheme, SimpleThemeOptions } from '@backstage/theme';
import { gold, common, myYellow as yellow } from "./colorTypes";
import { darkPageTheme } from './pageThemes';

interface customThemes {
  dark: SimpleThemeOptions
}

const darkTheme: SimpleThemeOptions = {
  palette: {
    type: 'dark',
    background: {
      default: '#263238',
      paper: '#323a45', 
    },
    status: {
      ok: "#1DB954",
      warning: "#FF9800",
      error: "#E22134",
      running: "#2E77D0",
      pending: "#FFED51",
      aborted: "#757575"
    },
    bursts: {
      fontColor: "#FEFEFE",
      slackChannelText: "#ddd",
      backgroundColor: {
        default: "#7C3699"
      },
    },
    primary: {
      main: '#94bfa2',
    },
    banner: {
      info: "#2E77D0",
      error: "#E22134",
      text: common.white,
      link: common.black
    },
    border: "#E6E6E6",
    textContrast: common.black,
    textVerySubtle: "#DDD",
    textSubtle: "#6E6E6E",
    highlight: "#FFFBCC",
    // info boxes
    errorBackground: "#FFEBEE",
    warningBackground: "#F59B23",
    infoBackground: "#ebf5ff",
    errorText: "#CA001B",
    infoText: "#004e8a",
    warningText: common.black,
    linkHover: "#2196F3",
    link: "#0A6EBE",
    gold: yellow.A700,
    // Colors for side nav bar
    navigation: {
      background: '#112238',
      indicator: gold.A200,
      color: '#d6d7d9',
      selectedColor: gold.A200,
    },
    pinSidebarButton: {
      icon: "#181818",
      background: "#BDBDBD"
    },
    tabbar: {
      indicator: "#9BF0E1"
    }
  },
  fontFamily: 'Source Sans Pro,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif',
  // Headers
  defaultPageTheme: 'home',
  pageTheme: darkPageTheme
}

const themes: customThemes = {
  dark: darkTheme
};

const darkThemeVA = createTheme(themes.dark);

export { darkThemeVA };
