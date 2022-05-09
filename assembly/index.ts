import { context, storage, logging, RNG } from 'near-sdk-as'
import { TICKERS, Game } from './model'

//SINGLETON-SERIALIZABLE
@nearBindgen
export class Contract {

    //VIEW METHODS
    getGameInfo(player: string): Game {
        let gameId = this.getGameIdOfPlayer(player)
        let game = this.getGame(gameId)
        return game
    }
    

    //CHANGE METHODS
    makeMove(index: i32): void {
        //FIND GAME AND BOARD
        let gameId = this.getGameIdOfPlayer(context.sender)
        let game = this.getGame(gameId)
        let board = game.board

        //DETERMINE P1/P2
        let playerIs: string = ""
        if (context.sender == game.player1) playerIs = "player1"
        if (context.sender == game.player2) playerIs = "player2"

        //LOGGING
        logging.log("Player is: " + playerIs)
        logging.log("It's " + game.turn + "'s turn.")

        //ASSERTIONS
        assert(context.sender == game.player1 || context.sender == game.player2, "You are not a player in this game.")
        assert(game.active, "This game did not start yet, you cannot make a move!")
        assert(playerIs == game.turn, "You cannot make a move, wait your turn!")
        assert(index < board.length, "Invalid move.")

        //FLIP LOGIC
        game.flips = game.flips + 1

        //LOGGING
        logging.log("Flip #" + game.flips.toString())
        logging.log("Card is:" + board[index].toString())

        if (game.flips == 1) {
            game.lastCard = board[index]
        }
        if (game.flips == 2) {
            if (game.turn == "player1") {
                logging.log("Your first flip: " + game.lastCard)
                if (board[index] == game.lastCard) {
                    game.p1score = game.p1score + 1
                    logging.log("You get a score! " + game.p1score.toString())
                    game.flips = 0
                    game.lastCard = ""
                    this.setGame(game.id, game)
                    return
                }
                game.turn = "player2"
                game.flips = 0
                game.lastCard = ""
                this.setGame(game.id, game)
            } else if (game.turn == "player2") {
                logging.log("Your first flip: " + game.lastCard)
                if (board[index] == game.lastCard) {
                    game.p2score = game.p2score + 1
                    logging.log("You get a score! " + game.p2score.toString())
                    game.flips = 0
                    game.lastCard = ""
                    this.setGame(game.id, game)
                    return
                }
                game.turn = "player1"
                game.flips = 0
                game.lastCard = ""
                this.setGame(game.id, game)
            }
        }

        this.setGame(gameId, game)
    }

    createGame(): void {
        //CONCEDE ASSIGNED GAME
        this.concedeGame()

        //CONFIGURE GAME
        let lastId: u64 = this.getLastId()
        let game = new Game()
        game.id = lastId
        game.player1 = context.sender
        game.board = this.makeBoard()

        //LOGGING
        logging.log("Creating game with gameId: " + game.id.toString())
        logging.log("Setting player1 as: " + game.player1)

        //CONFIUGURE STATE
        this.setGameIdOfPlayer(context.sender, lastId)
        this.setGame(game.id, game)
        this.setLastId(lastId + 1)

        //LOGGING
        logging.log("Player: " + context.sender + " assigned to gameId: " + lastId.toString())
        logging.log("Game with gameId: " + game.id.toString() + " saved.")
        logging.log("Updated lastId to: " + this.getLastId().toString())
        logging.log("Game is active: " + game.active.toString())
    }

    joinGame(player: string): void {
        //FIND GAME OF PLAYER1
        let gameId = this.getGameIdOfPlayer(player)
        let game = this.getGame(gameId)

        //CHECK PLAYER1 TRYING TO JOIN SELF
        assert(context.sender != game.player1, "You cannot play against yourself. Find a friend!")

        //CONCEDE ASSIGNED GAME
        this.concedeGame()

        //CONFIGURE STATE & START GAME
        game.player2 = context.sender
        game.active = true
        game.turn = "player1"
        this.setGame(gameId, game)
        this.setGameIdOfPlayer(context.sender, gameId)

        //LOGGING
        logging.log("Game with gameId: " + gameId.toString() + " found for " + game.player1)
        logging.log("Setting player2 as: " + game.player2)
        logging.log("Player: " + context.sender + " assigned to gameId: " + game.id.toString())
        logging.log("Game is active: " + game.active.toString())

    }

    concedeGame(): void {
        let gameId = this.getGameIdOfPlayer(context.sender)
        if (gameId === 0) return
        let game = this.getGame(gameId)
        game.active = false
        this.setGame(gameId, game)
        this.setGameIdOfPlayer(context.sender, 0)
        logging.log("You conceded your game with Id: " + gameId.toString())
    }


    //PRIVATE METHODS
    private setGame(gameId: u64, game: Game): void {
        storage.set(this.stringifyGameId(gameId), game)
    }

    private getGame(gameId: u64): Game {
        return storage.getSome<Game>(this.stringifyGameId(gameId))
    }

    private getGameIdOfPlayer(player: string): u64 {
        return storage.getPrimitive<u64>("gameIdOf_" + player, 0)
    }

    private setGameIdOfPlayer(player: string, gameId: u64): void {
        storage.set<u64>("gameIdOf_" + player, gameId)
    }

    private getLastId(): u64 {
        //default to 1000 for readability
        return storage.getPrimitive<u64>("lastId", 1000)
    }

    private setLastId(gameId: u64): void {
        storage.set<u64>("lastId", gameId)
    }

    private stringifyGameId(gameId: u64): string {
        return "game_" + gameId.toString()
    }

    private makeBoard(): Array<string> {
        let cards = TICKERS.concat(TICKERS)
        let board = new Array<string>()

        while (cards.length > 0) {
            let randomIndex = new RNG<u8>(1, cards.length).next()
            board.push(cards[randomIndex])
            cards.splice(randomIndex, 1)
        }
        return board
    }
}