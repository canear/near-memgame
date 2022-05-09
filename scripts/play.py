import subprocess
import os
import json

#get environment variable CONTRACT
CONTRACT_ID = os.environ["CONTRACT"]
YOU = "" 

def clear():
    os.system("clear")

def makeMove(index, YOU):
    data = json.dumps({"index": index})
    subprocess.run(["near", "call", CONTRACT_ID, "makeMove", data, "--accountId", YOU])

def game():
    clear()

    print("Welcome to the NEAR Memory Game!")
    print("Please enter your NEAR Account: ")
    global YOU
    YOU = input("> ")

    print("Start game?")
    input("> ")

    while True:
        print("Select a card (1-12): ")
        move = int(input("> "))
        makeMove(move - 1, YOU)

# MAIN
game()