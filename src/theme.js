import {createMuiTheme} from "@material-ui/core";
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: blue,
        secondary: red,
    },
    status: {
        danger: 'red'
    },

    typography: {
        fontFamily: [
            'font-family: \'Indie Flower\', cursive'
        ]
    }
})
export default darkTheme;
