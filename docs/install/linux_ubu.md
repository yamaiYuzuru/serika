# Install Serika on Ubuntu

<p>You need node.js v16.x or higher to install the packages from serika and jdk/jre 13 or higher for a lavalink server</p>

If you had allready installed node.js v16 or higher you can skip this step.
To install node.js v16.x (Current LTS - Long term support) use the following commands:
```
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt-get install -y nodejs
```

Then run the following command to install all dependencies:
`npm i`

Ways to host serika:

1. Using screen <br>
(Install screen using `(sudo add it if you need it) apt install screen`)<br>
Run the command: `screen -S serika node main.js`
2. Using systemctl<br>
   `(sudo, add it if you need it) nano /etc/systemd/system/serika.service`<br>
   In the file you write: 
   ```
   [Unit]
   Description=Rage Gaming Discord Bot
   After=multi-user.target
   [Service]
   WorkingDirectory=/home/<user>/serika
   User=<your user. example: yuzuru>
   Group=<the group is the same as your user>
   ExecStart=/usr/bin/node /home/<user>/serika/main.js --no-prompt
   Type=idle
   Restart=always
   RestartSec=15
   [Install]
   WantedBy=multi-user.target
   ```
   then `ctrl + 0` to write out the service file. Use following commands to start the bot: 
   ```
   (sudo use if you need this) systemctl daemon-reload // To load the service file.
   (sudo use if you need this) systemctl start serika.service // To start the bot.
   (sudo use if you need this) systemctl enable serika.service // This allows the bot to start on system reboot.
   ```
