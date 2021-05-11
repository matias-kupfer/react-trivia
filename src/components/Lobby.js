import React from 'react';
import SnackBar from '@material-ui/core/Snackbar';
import {Button} from "@material-ui/core";
import categories from "../categories";
import api from "../api";


class Lobby extends React.Component {
    constructor() {
        super();
        this.state = {
            loader: false,
            snackbarMessage: null,
            username: '',
            gameId: '',
            gamePassword: '',
            selectedCategory: 9,
            categories: categories,
        };
        this.createGame = this.createGame.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async createGame(event, value) {
        event.preventDefault();
        const category = this.state.selectedCategory;
        this.setState({loader: true});
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        let query = `${api}/play/`;
        query = value
            ? `${query}createGame/${category}/${this.state.username}/${this.state.gameId}/${this.state.gamePassword}`
            : `${query}joinGame/${this.state.username}/${this.state.gameId}/${this.state.gamePassword}`;
        const res = await fetch(query, {method: 'POST'});
        const data = await res.json();
        if (data.success) {
            const route = `${process.env.PUBLIC_URL}/game/${this.state.username}/${this.state.gameId}/${this.state.gamePassword}`;
            this.props.history.push(route);
        } else {
            this.setState({message: data.message});
        }
    }

    joinGame(event) {
        event.preventDefault();
        this.createGame(event, false);
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
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

    render() {
        return (
            <div className="lobby">
                <h3>Lobby</h3>
                <input type="text" name="username" value={this.state.username} placeholder="Username"
                       onChange={this.handleChange}/>
                <input type="text" name="gameId" value={this.state.gameId} placeholder="Game name"
                       onChange={this.handleChange}/>
                <input type="text" name="gamePassword" value={this.state.gamePassword}
                       placeholder="potato?" onChange={this.handleChange}/>
                <div className="select">
                    <select name="selectedCategory" onChange={this.handleChange} value={this.state.selectedCategory}>
                        {this.state.categories.map(category => {
                            return (<option value={category.num}>{category.name}</option>)
                        })}
                    </select>
                </div>
                <br/>
                <div className="buttons-container">
                    <span className="start-btn" onClick={event => this.createGame(event, true)}>Create game</span>
                    <span className="start-btn" onClick={event => this.createGame(event, false)}>Join game</span>
                </div>
                {this.state.message ? this.snackBar() : null}
            </div>
        )
    }
}

export default Lobby;
