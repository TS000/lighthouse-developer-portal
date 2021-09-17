import { yellow } from "@material-ui/core/colors";

// can export alias for colors from material-ui
export const myYellow = yellow;

// This is where we can define our own color's hue[shades]
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
    A100: '#000',
    A200: '#000',
    A400: '#000',
    A700: '#000'
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


const vadsGold = {
    50: '#FFF1D2',  //$color-gold-lightest
    100: '#FAD980', 
    200: '#FAD980', //$color-gold-lighter 
    300: '#F9C642', //$color-gold-light
    400: '#FCB02F',
    500: '#FDB81E', //$color-gold
    600: '#F5AE31',
    700: '#E8A937',
    800: '#C99E48',
    900: '#988530', //$color-gold-darker
    A100: '#FFF1D2',
    A200: '#FAD980',
    A400: '#F9C642',
    A700: '#FDB81E'
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

const vadsGray = {
    50: '#f1f1f1',  
    100: '#f1f1f1', //$color-gray-lightest
    200: '#d6d7d9', //$color-gray-lighter 
    300: '#e4e2e0', //$color-gray-warm-light
    400: '#dce4ef', //$color-gray-cool-light
    500: '#aeb0b5', //$color-gray-light
    600: '#757575', //$color-gray-medium
    700: '#E8A937', //$color-gray
    800: '#494440', //$color-gray-warm-dark
    900: '#323a45', //$color-gray-dark
    A100: '#323a45',
    A200: '#323a45',
    A400: '#323a45',
    A700: '#323a45'
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
 * Variable for common colors like white/black
 */
export const common = {
    white: "#FFFFFF",
    black: "#212121"
}