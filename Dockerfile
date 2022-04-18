FROM node:16.13.0
RUN mkdir /src
WORKDIR /src
ADD . /src
RUN npm install 
EXPOSE 3000
CMD npm start
