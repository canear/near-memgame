#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Building contract file... (This may take a few seconds.)"
echo ---------------------------------------------------------
echo

yarn clean
yarn build:release

echo
echo ---------------------------------------------------------
echo "Deploying the contract... (This may take a few seconds.)"
echo ---------------------------------------------------------
echo

near dev-deploy ./build/release/near-memgame.wasm

echo
echo ---------------------------------------------------------
echo "Your dev account is: "
cat neardev/dev-account
echo
echo ---------------------------------------------------------
echo "Please run the command below."
echo "export CONTRACT=<your-dev-account>"
echo ---------------------------------------------------------
echo

exit 0