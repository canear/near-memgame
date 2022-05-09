#!/bin/bash
 
echo 
echo -----------------------------------------
echo "Creating a game..."
echo -----------------------------------------
echo

near call $CONTRACT createGame --accountId $CONTRACT

