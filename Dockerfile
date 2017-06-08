FROM gcr.io/callmyapp/chrome-headless:v3

WORKDIR /

RUN apt-get update
RUN apt-get install -y --force-yes nodejs
RUN apt-get install -y --force-yes npm
RUN apt-get install -y --force-yes nodejs-legacy
RUN npm install n -g
RUN n 7.10.0

ADD ./ /pdf-printer/
RUN cd /pdf-printer/ && npm install
EXPOSE 3000

CMD cd /pdf-printer/src && node app.js
