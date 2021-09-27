import { yellow } from "@material-ui/core/colors";

// can export alias for colors from material-ui
export const myYellow = yellow;

// This is where we can define our own color's hue[shades]


/**
 * VADS Primary and Alt
 */
const vadsBlue = {
    50: '#E1F3F8',  //$color-primary-alt-lightest
    100: '#E1F3F8', 
    200: '#9BDAF1', //$color-primary-alt-light
    300: '#02BFE7', //$color-primary-alt
    400: '#00A6D2', //$color-primary-alt-dark
    500: '#0071BC', //$color-primary
    600: '#0071BC', 
    700: '#046B99', //$color-primary-alt-darkest
    800: '#003E73', //$color-primary-darker
    900: '#112E51', //$color-primary-darkest
    A100: '#CBE9F4',
    A200: '#6EC9EB',
    A400: '#159ABD',
    A700: '#115573',
};

export const blue = {
    50: vadsBlue[50],
    100: vadsBlue[100],
    200: vadsBlue[200],
    300: vadsBlue[300],
    400: vadsBlue[400],
    500: vadsBlue[500],
    600: vadsBlue[600],
    700: vadsBlue[700],
    800: vadsBlue[800],
    900: vadsBlue[900],
    A100: vadsBlue.A100,
    A200: vadsBlue.A200,
    A400: vadsBlue.A400,
    A700: vadsBlue.A700,
};

/**
 * VADS Sedondary
 */
const vadsRed = {
    50: '#FEF9F9',
    100: '#F9DEDE',
    200: '#EFBCBC',
    300: '#E59393',
    400: '#E07E7E',
    500: '#D65555',
    600: '#E31C3D',
    700: '#CD2026',
    800: '#981B1E',
    900: '#7A0609',
    A100: '#FFF8F8',
    A200: '#F7CECE',
    A400: '#C83030',
    A700: '#6D1315',
};

export const red = {
    50: vadsRed[50],
    100: vadsRed[100],
    200: vadsRed[200],
    300: vadsRed[300],
    400: vadsRed[400],
    500: vadsRed[500],
    600: vadsRed[600],
    700: vadsRed[700],
    800: vadsRed[800],
    900: vadsRed[900],
    A100: vadsRed.A100,
    A200: vadsRed.A200,
    A400: vadsRed.A400,
    A700: vadsRed.A700,
};

/**
 * VADS Gray
 */
const vadsGray = {
    50: '#F1F1F1',  //$color-gray-lightest
    100: '#E4E2E0', //$color-gray-warm-light 
    200: '#D6D7D9', //$color-gray-lighter
    300: '#DCE4EF', //$color-gray-cool-light
    400: '#AEB0B5', //$color-gray-light
    500: '#757575', //$color-gray-medium
    600: '#5B616B', //$color-gray
    700: '#494440', //$color-gray-warm-dark
    800: '#323A45', //$color-gray-dark
    900: '#07080A', 
    A100: '#F1F1F1',
    A200: '#DCDCDB',
    A400: '#CCCCCC',
    A700: '#535559'
};

export const gray = {
    50: vadsGray[50],
    100: vadsGray[100],
    200: vadsGray[200],
    300: vadsGray[300],
    400: vadsGray[400],
    500: vadsGray[500],
    600: vadsGray[600],
    700: vadsGray[700],
    800: vadsGray[800],
    900: vadsGray[900],
    A100: vadsGray.A100,
    A200: vadsGray.A200,
    A400: vadsGray.A400,
    A700: vadsGray.A700,
};

/**
 * VADS Gold
 */
const vadsGold = {
    50: '#FEFAEF',  
    100: '#FFF1D2', //$color-gold-lightest
    200: '#FAD980', //$color-gold-lighter 
    300: '#F9C642', //$color-gold-light
    400: '#FDC23E',
    500: '#FDB81E', //$color-gold
    600: '#ECB22F',
    700: '#D5B36F',
    800: '#C99E48',
    900: '#988530', //$color-gold-darker
    A100: '#FFE9B8',
    A200: '#EDD38D',
    A400: '#E0BC5B',
    A700: '#E7A82A'
};

export const gold = {
    50: vadsGold[50],
    100: vadsGold[100],
    200: vadsGold[200],
    300: vadsGold[300],
    400: vadsGold[400],
    500: vadsGold[500],
    600: vadsGold[600],
    700: vadsGold[700],
    800: vadsGold[800],
    900: vadsGold[900],
    A100: vadsGold.A100,
    A200: vadsGold.A200,
    A400: vadsGold.A400,
    A700: vadsGold.A700,
};

/**
 * VADS Green
 */
const vadsGreen = {
    50: '#FCFAFA',
    100: '#F1F1F1', //$color-green-lightest
    200: '#E4E2E0',
    300: '#D6D7D9', //$color-green-lighter
    400: '#7AA688',
    500: '#AEB0B5', //$color-green-light
    600: '#757575', //$color-green
    700: '#5B616B',
    800: '#494440', //$color-green-darker
    900: '#323A45',
    A100: '#F1F1F1',
    A200: '#DCDCDB',
    A400: '#CCCCCC',
    A700: '#535559',
};

export const green = {
    50: vadsGreen[50],
    100: vadsGreen[100],
    200: vadsGreen[200],
    300: vadsGreen[300],
    400: vadsGreen[400],
    500: vadsGreen[500],
    600: vadsGreen[600],
    700: vadsGreen[700],
    800: vadsGreen[800],
    900: vadsGreen[900],
    A100: vadsGreen.A100,
    A200: vadsGreen.A200,
    A400: vadsGreen.A400,
    A700: vadsGreen.A700,
};


/**
 * VADS Misc for common colors
 */
export const common = {
    base: "#212121",
    linkColorDefault: "#004795",
    linkColorVisited: "#4c2c92",
    linkColorFocus: "#3e94cf",
    white: "#FFFFFF",
    black: "#212121"
}