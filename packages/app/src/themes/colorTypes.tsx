import { yellow } from "@material-ui/core/colors";

// can export alias for colors from material-ui
export const myYellow = yellow;

// VA Design System (VADS) color pallet documentaion
// https://design.va.gov/design/color-palette
// Colors are mapped to Material UI values with 
// ajacent VADS tokens for referance.

/**
 * VADS base colors
 */
 export const common = {
    base: "#212121",
    white: "#FFFFFF",
    black: "#000000",
    orange: "#eb7f29",
    warning_message: "#fac922",
    linkColorDefault: "#004795",
    linkColorVisited: "#4c2c92",
    linkColorFocus: "#3e94cf"
}

/**
 * VADS Primary and Alt Blue
 */
const vadsBlue = {
    50: '#F6FBFD',
    100: '#E1F3F8',
    200: '#9BDAF1',
    300: '#02BFE7',
    400: '#00A6D2',
    500: '#0071BB',
    600: '#046B99',
    700: '#003E73',
    800: '#112E51',
    900: '#112238',
    A100: '#DCE4EF',
    A200: '#8BA6CA',
    A400: '#4773AA',
    A700: '#205493'
};

export const blue = {
    50: vadsBlue[50],   
    100: vadsBlue[100], //$color-primary-alt-lightest
    200: vadsBlue[200], //$color-primary-alt-light
    300: vadsBlue[300], //$color-primary-alt
    400: vadsBlue[400], //$color-primary-alt-dark
    500: vadsBlue[500], //$color-primary
    600: vadsBlue[600],
    700: vadsBlue[700], //$color-primary-alt-darkest
    800: vadsBlue[800], //$color-primary-darker
    900: vadsBlue[900], //$color-primary-darkest
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
    100: vadsRed[100], //$color-secondary-lightest
    200: vadsRed[200],
    300: vadsRed[300], //$color-secondary-light
    400: vadsRed[400],
    500: vadsRed[500],
    600: vadsRed[600], //$color-secondary
    700: vadsRed[700], //$color-secondary-dark
    800: vadsRed[800], //$color-secondary-darkest
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
    50: '#F1F1F1',  
    100: '#E4E2E0',
    200: '#D6D7D9',
    300: '#DCE4EF',
    400: '#AEB0B5',
    500: '#757575',
    600: '#5B616B',
    700: '#494440',
    800: '#323A45',
    900: '#07080A', 
    A100: '#FAFAFA',
    A200: '#DCDCDB',
    A400: '#CCCCCC',
    A700: '#263238'
};

export const gray = {
    50: vadsGray[50],   //$color-gray-lightest
    100: vadsGray[100], //$color-gray-warm-light 
    200: vadsGray[200], //$color-gray-lighter
    300: vadsGray[300], //$color-gray-cool-light
    400: vadsGray[400], //$color-gray-light
    500: vadsGray[500], //$color-gray-medium
    600: vadsGray[600], //$color-gray
    700: vadsGray[700], //$color-gray-warm-dark
    800: vadsGray[800], //$color-gray-dark
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
    100: '#FFF1D2',
    200: '#FAD980',
    300: '#F9C642',
    400: '#FDC23E',
    500: '#FDB81E',
    600: '#ECB22F',
    700: '#D5B36F',
    800: '#C99E48',
    900: '#988530',
    A100: '#FFE9B8',
    A200: '#EDD38D',
    A400: '#E0BC5B',
    A700: '#E7A82A'
};

export const gold = {
    50: vadsGold[50],
    100: vadsGold[100], //$color-gold-lightest
    200: vadsGold[200], //$color-gold-lighter 
    300: vadsGold[300], //$color-gold-light
    400: vadsGold[400],
    500: vadsGold[500], //$color-gold
    600: vadsGold[600],
    700: vadsGold[700],
    800: vadsGold[800],
    900: vadsGold[900], //$color-gold-darker
    A100: vadsGold.A100,
    A200: vadsGold.A200,
    A400: vadsGold.A400,
    A700: vadsGold.A700,
};

/**
 * VADS Green
 */
const vadsGreen = {
    50: '#F7FDF8',
    100: '#E7F4E4',
    200: '#C4DCCC',
    300: '#94BFA2',
    400: '#7AA688',
    500: '#4AA564',
    600: '#2E8540',
    700: '#28803B',
    800: '#195C27',
    900: '#22532C',
    A100: '#B0F9D1',
    A200: '#61F290',
    A400: '#1DB954',
    A700: '#076E1D',
};

export const green = {
    50: vadsGreen[50],
    100: vadsGreen[100], //$color-green-lightest
    200: vadsGreen[200],
    300: vadsGreen[300], //$color-green-lighter
    400: vadsGreen[400],
    500: vadsGreen[500], //$color-green-light
    600: vadsGreen[600], //$color-green
    700: vadsGreen[700],
    800: vadsGreen[800], //$color-green-darker
    900: vadsGreen[900],
    A100: vadsGreen.A100,
    A200: vadsGreen.A200,
    A400: vadsGreen.A400,
    A700: vadsGreen.A700,
};