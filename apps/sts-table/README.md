# STS Sielcon Table Sign

## Instalation

### Installing npm, nvm and nodejs

1. apt update
2. apt upgrade -y
3. apt install npm -y
4. npm -v
5. apt install nodejs -y
6. node -v
7. apt install curl
8. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
9. export NVM_DIR="$HOME/.nvm"
10. [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
11. [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
12. nvm install 22
13. node -v

### Copy of files
First step:
1. ssh [user]@[IP]
2. Enter correct password
3. sudo su
4. Enter correct password
5. mc
6. Check if the directory "/home/cartel/sts" exists (permisos user).

Second step:
1. scp -r .\app_sts\ [user]@[IP]:/home/cartel/
2. cd app_sts
3. npm i

### Install MQTTS-Broker

1. Check file ./apps/mqtts-broker/NotSign/config/config_mqtts-broker.yml
2. Check settings
3. test: npm run mqtts-broker:lnx

### General Config

1. Check file ./apps/sts/NotSign/config/general.yml
2. 

### Install STS-WHEEL

1. Check file ./apps/sts/sts-wheel/NotSign/config/config_sts-wheel.yml
2. Check settings
3. Config COMM>port --> /dev/ttyS0
3. test: npm run sts-wheel:lnx


### Install STS-HARDWARE

1. Check file ./apps/sts/sts-hardware/NotSign/config/config_sts-hardware.yml
2. Check settings
3. Config COMM>port --> /dev/ttyUSB0
3. test: npm run sts-hardware:lnx


### Install STS-API

1. Check file ./apps/sts/sts-api/NotSign/config/config_sts-api.yml
2. npm i prisma -g
3. npx prisma generate
4. test: npm run sts-api:lnx


### Install STS-TABLE

1. Check file ./apps/sts/sts-table/NotSign/config/config_sts-table.yml
2. Config HARDWARE>id --> [mac]
3. Config WHEEL>id --> [mac]
4. Config SIGNBOARD>id --> [name in Signboard - ex: Mesa05]
5. test: npm run sts-table:lnx


### Data Base Settings
1. Use Swagger: http://[ip]:[port]/docs



### Install SIGNBOARD

1. Check file /home/cartel/Cartel/.env
2. Config MQTT in "Conection"
3. Config Cartel in "app" (CLIENT_ID). 



### Install Services
1. npm i node-linux
2. Install services: node ./sts-install-lnx.js
3. Uninstall services: node ./sts-uninstall-lnx.js
4. run: systemctl enable [srv_name]
5. systemctl status [srv_name]



## Extras

### Serial Ports

Show Serial Ports: dmesg | grep tty

### Linux commands

1. systemctl status
2. systemctl status [srv_name]
3. journalctl -u [srv_name]
4. reboot





## Getting started

## Description

## Installation
## Usage
