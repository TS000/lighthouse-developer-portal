import { createTheme, SimpleThemeOptions } from '@backstage/theme';
import { gold, blue, common, myYellow as yellow } from "./colorTypes";
import { lightPageTheme, darkPageTheme } from './pageThemes';

interface customThemes {
  light: SimpleThemeOptions,
  dark: SimpleThemeOptions
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
  light: lightTheme,
  dark: darkTheme
};


const lightThemeVA = createTheme(themes.light);
const darkThemeVA = createTheme(themes.dark);

export { lightThemeVA, darkThemeVA };
