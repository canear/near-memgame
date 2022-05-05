export const TICKERS = [
    "BTC",
    "ETH",
    "ADA",
    "NEAR",
    "AVAX",
    "DOT"
]

@nearBindgen
export class Game {
    id: u64
    active: boolean = false
    player1: string
    player2: string
    p1score: u64 = 0
    p2score: u64 = 0
    turn: string
    flips: u64 = 0
    lastCard: string
    board: Array<string>
    outcome: string
}