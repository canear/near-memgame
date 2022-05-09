#!/bin/bash
 
echo 
echo -----------------------------------------
echo "Joining player: $1's game..."
echo -----------------------------------------
echo

near call $CONTRACT joinGame '{"player": "'"$1"'"}' --accountId $CONTRACT

