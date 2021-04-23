#!/bin/sh

echo "Kill all the running PM2 actions"
sudo pm2 kill

echo "Jump to app folder"
cd /home/project

echo "Update app from Git"
git pull origin main

echo "Install app dependencies"
sudo rm -rf node_modules
sudo yarn install

echo "Build your app"
sudo yarn build

echo "Run new PM2 action"
# sudo cp /home/project/ecosystem.json ecosystem.json
sudo pm2 start ecosystem.json