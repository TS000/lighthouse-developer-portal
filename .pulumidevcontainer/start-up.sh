#!/bin/bash
nohup bash -c 'minikube start &' > minikube.log 2>&1
curl -fsSL https://get.pulumi.com | sh

# This is for installing yarn in this devcontainer so you can use the "yarn pulumi" command but Pulumi will work without installing this 
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - 
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install -y yarn 

sudo curl -fsSL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt-get update && sudo apt-get install -y nodejs 

# Install pip3 & go for precommit to work 
#sudo apt update && sudo apt install python3-pip
#curl -O https://dl.google.com/go/go1.12.7.linux-amd64.tar.gz && tar xvf go1.12.7.linux-amd64.tar.gz
#sudo chown -R root:root ./go
#sudo mv go /usr/local

#pip3 install pre-commit
#rm go1.12.7.linux-amd64.tar.gz
