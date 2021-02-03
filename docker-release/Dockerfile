FROM ubuntu:focal

# install requirements

RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y --no-install-recommends apt-utils systemctl gnupg curl ca-certificates build-essential python

# setup mongodb

RUN MONGO_MAJOR=4.4 \
  && export DEBIAN_FRONTEND=noninteractive \
  && groupadd -r mongodb && useradd -r -g mongodb mongodb \
  && mkdir -p /data/db /data/configdb \
  && chown -R mongodb:mongodb /data/db /data/configdb \
  && curl -sS https://www.mongodb.org/static/pgp/server-${MONGO_MAJOR}.asc | apt-key add - \
  && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/${MONGO_MAJOR} multiverse" | tee /etc/apt/sources.list.d/mongodb-org-${MONGO_MAJOR}.list \
  && apt-get update \
  && apt-get install -y mongodb-org \
  && sed -r -i -e 's/127\.0\.0\.1/0.0.0.0/' /etc/mongod.conf

VOLUME /var/lib/mongodb
VOLUME /var/log/mongodb

EXPOSE 27017

# setup node.js

RUN NODE_VERSION=14.15.4 \
  && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
  && nvm install $NODE_VERSION

# setup yarn

RUN export DEBIAN_FRONTEND=noninteractive \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends yarn

# setup pm2

RUN export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
  && yarn global add pm2

VOLUME /root/.pm2/logs

# setup app

COPY package.json /home-internet-connection/
COPY yarn.lock /home-internet-connection/
COPY pm2.config.json /home-internet-connection/
COPY dist /home-internet-connection/app
COPY src/server/views /home-internet-connection/src/server/views

RUN export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
  && cd /home-internet-connection \
  && yarn install --prod

ENV APP_HOST=0.0.0.0
ENV APP_PORT=3000
ENV APP_SSL=false
ENV MONGODB_HOST=127.0.0.1
ENV MONGODB_PORT=27017
ENV MONGODB_USER=
ENV MONGODB_PASSWORD=
ENV MONGODB_DATABASE=hic
ENV STATUS_SERVERS_REMOTE="[\"1.1.1.1:443\", \"google.com:443\"]"
ENV STATUS_SERVERS_LOCAL="[\"192.168.23.1:80\"]"
ENV STATUS_SERVERS_TIMEOUT=10
ENV SPEEDTEST_HOSTS="[\"my-speed.info\", \"as250.net\"]"
ENV SPEEDTEST_SOURCE_IP=
ENV SPEEDTEST_TIMEOUT=90
ENV SPEEDTEST_VALUE_MULTIPLIER=1000000
ENV SPEEDTEST_EXPECTED_DOWN=150
ENV SPEEDTEST_EXPECTED_UP=10
ENV SPEEDTEST_EXPECTED_PING=16
ENV DATE_FULL=dd.MM.yy
ENV DATE_SHORT=dd.MM.
ENV TIME_FULL=HH:mm:ss
ENV TIME_SHORT=HH:mm

EXPOSE 3000

# cleanup

RUN apt-get autoremove -y \
  && apt-get autoclean -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

# entrypoint and command

COPY docker-release/entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]
CMD ["pm2-docker", "pm2.config.json"]
