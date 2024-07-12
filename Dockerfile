FROM node:20.11.1-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && yarn install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh
RUN chmod +x /opt/startup.relational.ci.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.ci.sh

WORKDIR /usr/src/app
#RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
RUN yarn run build

CMD ["/opt/startup.relational.ci.sh"]