FROM node:14
WORKDIR /index
COPY package.json /index /bundle
RUN npm install
COPY . /index
CMD node index
EXPOSE 7000