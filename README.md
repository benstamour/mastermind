Mastermind
==========

This repository contains a project featuring a game of Mastermind, made with React.

In this game, the computer generates a 4-digit code (with no duplicate digits), and the player can enter a guess by clicking the numbered buttons at the bottom of the page. Each time the player submits a guess, the computer gives feedback by telling them the number of digits in their guess that are in the code in the *correct* place (in red) along with the number of digits in their guess that appear in the code but in a *different* place (in grey). The goal is to solve the computer's code in the fewest number of guesses possible.

For example, here is a sample game where the computer generated a code of 9625:

![Sample Guesses](https://github.com/benstamour/mastermind/blob/main/example.png?raw=true "Sample Guesses")

You can play the game at [bensta.epizy.com/mastermind](https://bensta.epizy.com/mastermind) or you can download the game with the files given in this repository. Both the build folder containing the production build and the src folder containing the source JavaScript and CSS files are given.
