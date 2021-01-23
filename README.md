# home-internet-connection

> A tool to log connection status and speed of your home internet connection.

---

## About

I build this for my personal use to track the connection status and speed of my
home internet connection.

It uses...

- hapi as app framework
- mongodb as database and mongoose as db client
- preact for the frontend

It is designed to run on a Raspberry Pi 4 with Ubuntu 20.10 64-bit (but can also
be used on similar systems).

## Setup

Hardware Requirements:

- Raspberry Pi 4 (or similar device)

Software Requirements

- node.js 14.15.4 via nvm
- yarn
- mongodb
- nginx setup as reverse proxy
- pm2

See [this gist](https://gist.github.com/simbo/887559c18f0838bbb1a4dcd761eb6810)
for instructions to setup everything.

### Preparations

```sh
sudo apt-get install build-essential python
```

### Install

```sh
# clone repository
git clone https://github.com/simbo/home-internet-connection.git

# change to project directory
cd home-internet-connection

# copy env file and edit according to your needs
cp .env-sample .env

# run install script
./install
```

### Update

```sh
# change to project directory
cd home-internet-connection

# run update script
./update
```

## Development

Requirements:

- docker with docker-compose

There is a docker composition for local development which can be managed via a
convenient Makefile. Simply run `make` to get a task overview.

## License and Author

[MIT &copy; Simon Lepel](http://simbo.mit-license.org/)
