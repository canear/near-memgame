import subprocess
import os
import json
subprocess.run(["pwd"])

CONTRACT_ID = "canear.testnet"
YOU = "" 

def clear():
    os.system("clear")

def makeMove(index, YOU):
    data = json.dumps({"index": index})
    subprocess.run(["near", "call", CONTRACT_ID, "makeMove", data, "--accountId", YOU])

def game():
    clear()
    while True:
        print("Select a card (1-12): ")
        move = int(input("> "))
        makeMove(move - 1, YOU)


def createGame(YOU):
    clear()
    
    data = json.dumps({"player": YOU})

    print("Trying to create a game.")
    subprocess.run(["near", "call", CONTRACT_ID, "createGame", "--accountId", YOU])  

    print("Start game?")
    input("> ")

    game()  

def joinGame(player, YOU):
    clear()
    print(f"Trying to join ${player}'s game.")
    data = json.dumps({"player": player})

    subprocess.run(["near", "call", CONTRACT_ID,
                   "joinGame", data, "--accountId", YOU])

    print("Start game?")
    input("> ")

    game()

def createJoin():
    clear()

    print("Welcome to NEAR Memory Game!")
    print("Please enter your NEAR Account: ")
    global YOU
    YOU = input("> ")
    print("Create or Join Game?")
    cj = input("> ")

    clear()

    if cj == "create" or cj == "CREATE" or cj =="c": #CREATE BLOCK
        clear()
        createGame(YOU)

    elif cj == "join" or cj == "JOIN" or cj =="j": #JOIN BLOCK
        clear()

        print("Other Player's NEAR Account: ")
        player = input("> ")

        joinGame(player, YOU)

    else:
        print("Invalid input...")

# MAIN
createJoin()