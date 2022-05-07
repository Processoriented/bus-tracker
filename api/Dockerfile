FROM node

RUN mkdir -p /usr/api

WORKDIR /usr/api

COPY package.json /usr/api/

RUN npm install

COPY . /usr/api/

EXPOSE 8000

CMD ["npm", "start"]
