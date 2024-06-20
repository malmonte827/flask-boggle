from boggle import Boggle
from flask import Flask, render_template, request, redirect, flash, session
boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'very secret'


@app.route('/')
def homepage():
    """ Displays Board"""
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('index.html', board=board)


