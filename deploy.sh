#!/bin/sh

echo "Kill all the running PM2 actions"
pm2 kill

echo "Jump to app folder"
cd /home/project

# echo "Update app from Git"
# git pull origin main

echo "Install app dependencies"
sudo rm -rf node_modules
yarn install

echo "Build your app"
yarn build

echo "Run new PM2 action"
# sudo cp /home/project/ecosystem.json ecosystem.json
pm2 start ecosystem.json