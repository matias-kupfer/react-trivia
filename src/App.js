import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Redirect} from 'react-router';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Lobby from "./components/Lobby";
import GameView from "./components/GameView";

const firebase = require('firebase');

// const firestore = firebase.firestore();

function App() {
    return (
        <Router>
            <Header/>
            <Switch>
                <Route path={process.env.PUBLIC_URL + "/"} exact><Redirect to={process.env.PUBLIC_URL + "/lobby"}/></Route>
                <Route path={process.env.PUBLIC_URL + "/lobby"} component={Lobby}/>
                <Route path={process.env.PUBLIC_URL + "/game/:username/:gameId/:gamePassword?"} component={GameView}/>
            </Switch>
            <Footer/>
        </Router>
    );
}

export default App;
