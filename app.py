from boggle import Boggle
from flask import Flask, render_template, request, redirect, flash, session, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = 'very secret'

boggle_game = Boggle()

@app.route('/')
def homepage():
    """ Displays Game Board """

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    plays = session.get('plays', 0)
    
    return render_template('index.html', board=board, highscore=highscore, plays=plays)

@app.route('/valid-word')
def check_word():
    """ Check if word is in dictionary """

    word = request.args['word']
    board = session['board']
    res = boggle_game.check_valid_word(board, word)

    return jsonify({'result': res})

@app.route('/final-score', methods=['POST'])
def final_score():
    """ Get score and update times played and if new highscore """

    score = request.json['score']
    highscore = session.get('highscore', 0)
    plays = session.get('plays', 0)

    session['highscore'] = max(score, highscore)
    session['plays'] = plays + 1

    return jsonify(brokeRecord=score > highscore)
