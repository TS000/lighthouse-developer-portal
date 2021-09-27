import { createTheme, SimpleThemeOptions } from '@backstage/theme';
import { gold, blue, common } from "./colorTypes";
import { lightPageTheme } from './pageThemes';

interface customThemes {
  light: SimpleThemeOptions,
}

const lightTheme: SimpleThemeOptions = {
  palette: {
    type: 'light',
    background: {
      default: "#FFF",
      paper: "#FAFAFA"
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
      gradient: {
        linear: 'linear-gradient(-137deg, #4BB8A5 0%, #187656 100%)'
      }
    },
    primary: {
      main: blue[900]
    },
    banner: {
      info: "#2E77D0",
      error: "#E22134",
      text: common.white,
      link: "#0A6EBE"
    },
    border: "#ECECEC",
    textContrast: common.black,
    textVerySubtle: "#DDD",
    textSubtle: "#6E6E6E",
    highlight: "#FFFBCC",
    // info boxes
    errorBackground: "#F9DEDE",
    warningBackground: "#FFF1D2",
    infoBackground: "#E1F3F8",
    errorText: "#323A45",
    infoText: "#323A45",
    warningText: "#323A45",
    linkHover: "#003e73",
    link: "#0A6EBE",
    gold: gold[500],
    // Colors for side nav
    navigation: {
      background: blue[900],
      indicator: gold[300],
      color: '#ffffff',
      selectedColor: gold[500],
    },
    pinSidebarButton: {
      icon: "#7C3699",
      background: "#E1F3F8"
    },
    tabbar: {
      indicator: "#9BF0E1"
    }
  },
  fontFamily: "Source Sans Pro, Helvetica Neue,Helvetica,Roboto,Arial,sans-serif",
  // Headers
  defaultPageTheme: "home",
  pageTheme: lightPageTheme
}

const themes: customThemes = {
  light: lightTheme,
};

const lightThemeVA = createTheme(themes.light);

export { lightThemeVA };
