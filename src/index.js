import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {ThemeProvider} from '@material-ui/core';
import {CssBaseline} from '@material-ui/core';
import darkTheme from "./theme";

/*import firebase from "firebase";
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD0ZkQeYXgJo-qWMrZDbGW_ouDPuGK7qhY",
    authDomain: "trivia-e9cfe.firebaseapp.com",
    databaseURL: "https://trivia-e9cfe.firebaseio.com",
    appId: "1:514972671228:web:d3d351e33cbefeadf68b79",
    projectId: "trivia-e9cfe",
};
firebase.initializeApp(firebaseConfig);*/

ReactDOM.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline>
            <App/>
        </CssBaseline>
    </ThemeProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
