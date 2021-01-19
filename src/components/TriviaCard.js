import React from "react";
import LinearProgress from '@material-ui/core/LinearProgress';

class TriviaCard extends React.Component {

    showQuestion() {
        const question = this.props.triviaQuestion;
        return (
            <div className="trivia-card">
                <div className="header" style={{backgroundColor: this.headerColor()}}>
                    <h3>Category: {question.category}</h3>
                    <h3>Round: {this.props.round}/{this.props.totalRounds}</h3>
                </div>
                <div className="padding">
                    <h3>{decodeURI(question.question)}</h3>
                    {this.showAnswers(question.incorrect_answers)}
                    <span className="timer"
                          style={this.props.timer > 4 ? {color: 'green'} : {color: 'red'}}>{this.props.timer}</span>
                </div>
                <LinearProgress variant="determinate" color="secondary" value={100 - (this.props.timer * 10)}/>
            </div>
        )
    }

    headerColor() {
        const difficulty = this.props.triviaQuestion.difficulty;
        return difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'orange' : 'red';
    }

    showAnswers(answers) {
        return (<form onSubmit={this.props.handleSubmit}>
                {answers.map(incorrect_answer =>
                    <label>
                        <input onChange={this.props.handleRadioChange} type="radio" name="selectedAnswer"
                               value={incorrect_answer} key={incorrect_answer}/>
                        {decodeURI(incorrect_answer)}<br/></label>
                )}
            </form>
        )
    }

    render() {
        return (
            this.showQuestion()
        )
    }
}

export default TriviaCard;
