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
                    <h3>{question.question}</h3>
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
                        {incorrect_answer}<br/></label>
                )}
                {/*<button disabled={this.props.disableButton} type="submit">Check</button>*/}
                {/*<FormControl component="fieldset">
                    <RadioGroup className="radio-group" aria-label="Choose and answer" name="selectedAnswer"
                                onChange={this.props.handleRadioChange}>
                        {answers.map(incorrect_answer =>
                            <FormControlLabel style={{fontSize: '2em'}} key={incorrect_answer} value={incorrect_answer}
                                              control={<Radio/>} label={incorrect_answer}/>
                        )}
                    </RadioGroup>
                    <FormHelperText>{this.props.helperText}</FormHelperText>
                    <Button disabled={this.props.disableButton} variant="contained" color="secondary"
                            type="submit">Check</Button>
                </FormControl>*/}
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
