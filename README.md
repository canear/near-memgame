# Simple Memory Matching Game on NEAR Protocol

This simple game makes use of the NEAR Blockchain to allow players to partake in a memory/card matching game.

## Instructions
First, log-in to your NEAR Testnet account:
```
near login
```

Clone this repository:
```
git clone https://github.com/canear/near-memgame.git
```

Install dependencies:
```
cd near-memgame
yarn
```

Run the dev-deploy script:
```
bash ./scripts/dev-deploy.sh
```

Your dev account will be shown on the console.
Set environment variable CONTRACT to your dev account (works on Linux):
```
export CONTRACT=<your-dev-account>

```

Create a game:
```
bash ./scripts/create-game.sh
```

Join another player's game:
```
bash ./scripts/join-game.sh <other-player-account>
```

Start playing after the player joins a created game:
```
python3 ./scripts/play.py
```

The player who created the game starts as Player 1. Each player gets to flip two cards in a turn, unless they match a pair of cards. If they do so, they will be allowed to play for another turn (two more flips). When a player fails to match two cards in a turn, they lose their turn to their opponent. The player has to choose a number which must be in the range of 1 to 12 (inclusive). 

As of now, this project uses a simple python script to handle player events. I will soon be developing a proper frontend for this game. Thanks for checking out my project!