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
                <Route path="/" exact><Redirect to="/lobby"/></Route>
                <Route path="/lobby" component={Lobby}/>
                <Route path="/game/:username/:gameId/:gamePassword?" component={GameView}/>
            </Switch>
            <Footer/>
        </Router>
    );
}

export default App;
