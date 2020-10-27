import React from "react";
// MATERIAL IMPORTS
import {CircularProgress} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SnackBar from "@material-ui/core/Snackbar";

// FIREBASE
import firebase from "../Firebase";
import TriviaCard from "./TriviaCard";
import api from "../api";

const db = firebase.firestore();

class GameView extends React.Component {
    constructor() {
        super();
        this.state = {
            loader: true,
            snackbarMessage: null,
            lastRound: 0,
            helperText: null,
            rightAnswer: null,
            interval: null,
            timer: null,
            params: null,
            selectedAnswer: null,
            triviaObject: null,
            usersData: null,
        }
        this.startGame = this.startGame.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        firebase.database().ref().child("X").on('value', () => {
        });
        const {match: {params}} = this.props;
        this.setState({params: this.props.match.params}, () => {
            this.getGameData();
        });
    }

    componentWillUnmount() {
    }

    async startGame() {
        this.setState({loader: true});
        const gameParams = this.state.params;
        const selectedCategory = this.state.triviaObject.selectedCategory;
        let query = `${api}/play/startGame/`;
        query = `${query}${selectedCategory}/${gameParams.username}/${gameParams.gameId}/${gameParams.gamePassword}`;
        const res = await fetch(query, {method: 'POST'});
        const data = await res.json();
        this.setState({message: data.message});
        if (data.success) {
            this.setState({message: data.message, loader: false});
        } else {
            this.setState({message: data.message, loader: false});
        }
    }

    getGameData() {
        const newGameRef = db.collection('games').doc(this.state.params.gameId);
        newGameRef.onSnapshot(data => {
            if (this.state.triviaObject) { // updating data
                let message = '';
                if (this.state.triviaObject.gameStarted !== data.data().gameStarted) { // game starts
                    message = 'Game starts';
                    this.timer();
                } else if (this.state.triviaObject.gameStarted) { // game alredy started
                    message = 'Next question!';
                    this.timer();
                }
                this.setState({triviaObject: data.data(), message: message});
            } else { // first time data
                this.setState({triviaObject: data.data(), loader: false, message: 'Joined game'})
            }
        });

        newGameRef.collection('players').onSnapshot(res => {
            const usersData = [];
            res.docs.map(doc => usersData.push(doc.data()));
            this.setState({usersData: usersData});
        });
    }

    timer() {
        this.setState({interval: clearInterval(this.state.interval)})
        this.setState({timer: 10});
        this.setState({
            interval:
                setInterval(() => {
                    this.setState({timer: this.state.timer - 1})
                    if (this.state.timer === 0) {
                        if (this.state.triviaObject.gameFinished) return;
                        this.handleSubmit();
                    }
                }, 1000)
        });
    }

    updateGameData() {
        const newGameRef = db.collection('games').doc(this.state.params.gameId);
        const fieldValue = firebase.firestore.FieldValue;
        const triviaObject = this.state.triviaObject;
        const userIsHost = triviaObject.host === this.state.params.username;
        const isLastQuestion = triviaObject.round === triviaObject.questions.length - 1;
        /*
        * Upload to user firebase document true/false if rightAnswer
        * */
        newGameRef.collection('players').doc(this.state.params.username)
            .update({playerAnswers: fieldValue.arrayUnion({[this.state.lastRound]: this.state.rightAnswer})})
            .then(() => this.setState({loader: false}))
            .catch((e) => console.log(e));
        this.setState({lastRound: this.state.lastRound + 1});
        /*
        * If user is host increment game round
        * */
        if (userIsHost) {
            const increment = isLastQuestion ? 0 : 1;
            newGameRef.update({round: fieldValue.increment(increment), gameFinished: isLastQuestion})
                .then(() => this.setState({message: 'Next question', loader: false}))
                .catch((e) => console.log(e));
        }
    }

    snackBar() {
        return (
            <SnackBar anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}
                      open={true} autoHideDuration={2000} message={this.state.message}
                      onClose={() => this.setState({message: null})}
                      action={<React.Fragment>
                          <Button color="secondary" size="small">
                              Close
                          </Button>
                      </React.Fragment>}/>
        )
    }

    handleRadioChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    };

    handleSubmit() {
        this.setState({helperText: null, loader: true})
        const triviaObject = this.state.triviaObject;
        if (this.state.selectedAnswer === triviaObject.questions[triviaObject.round].correct_answer) {
            this.setState({
                correctAnswer: triviaObject.questions[triviaObject.round].correct_answer,
                rightAnswer: true
            })
        } else {
            this.setState({
                correctAnswer: triviaObject.questions[triviaObject.round].correct_answer,
                rightAnswer: false
            })
        }
        setTimeout(() => {
            this.updateGameData();
        }, 3000);
    };

    showTriviaCard() {
        const triviaObject = this.state.triviaObject;
        return <TriviaCard key={triviaObject.questions[triviaObject.round].correct_answer}
                           triviaQuestion={triviaObject.questions[triviaObject.round]}
                           handleRadioChange={this.handleRadioChange}
                           handleSubmit={this.handleSubmit}
                           selectedAnswer={this.state.selectedAnswer}
                           errorText={this.state.errorText}
                           helperText={this.state.helperText}
                           disableButton={this.state.loader}
                           round={this.state.triviaObject.round + 1}
                           totalRounds={this.state.triviaObject.questions.length}
                           timer={this.state.timer}/>
    }

    showPlayersInfo() {
        return (
            <div className="users-data">
                {this.state.usersData.map(userData => {
                    let playerCorrectAnswers = 0;
                    userData.playerAnswers.map((playerAnswer, index) => {
                            return playerAnswer.[index] === true ? playerCorrectAnswers++ : null;
                        }
                    )
                    return (
                        <div>
                            <h3>{userData.username}</h3>
                            <span>Points: {playerCorrectAnswers}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    showPlayersName() {
        return (
            <div>
                {this.state.triviaObject.players.map((player, i) => {
                    if (i <= this.state.triviaObject.players.length - 1) {
                        return i === 0 ? (<h3>· {player} ·</h3>) : (<h3>{player}</h3>)
                    }
                })}
            </div>
        )
    }

    showAnswer() {
        return (
            this.state.rightAnswer
                ? <h1 style={{color: 'green'}}>Great! {this.state.correctAnswer} was the correct answer.</h1>
                : <h1 style={{color: 'red'}}>Bad news... {this.state.correctAnswer} was the correct answer.</h1>
        )
    }

    render() {
        return (
            this.state.loader
                ? <div className="loader"><CircularProgress color="secondary"/><br/>
                    {this.state.triviaObject && this.state.triviaObject.gameStarted ?
                        this.showAnswer() : null}
                </div>
                : this.state.triviaObject && this.state.triviaObject.questions && this.state.usersData
                ? this.state.triviaObject.gameFinished ? <div className="game">
                        <h1>Game finished!</h1>{this.showPlayersInfo()}
                        <span className="start-btn" onClick={() => this.props.history.push('/')}>Lobby</span></div>
                    : <div className="game">{this.showPlayersInfo()} {this.showTriviaCard()}</div>
                : <div className="game-preview">
                    <div className="game-info">
                        <h3><span>Game:</span> &nbsp;{this.state.params.gameId}</h3>
                        <h3><span>Password:</span> &nbsp;{this.state.params.gamePassword}</h3>
                    </div>
                    {this.state.usersData ? this.showPlayersName() : null}
                    {this.state.params.username === this.state.triviaObject.host
                        ? <span className="start-btn" onClick={this.startGame}>Start</span>
                        : <h1>Waiting for {this.state.triviaObject.host} to start the game</h1>}
                </div>
        );
    }
}

export default GameView;
