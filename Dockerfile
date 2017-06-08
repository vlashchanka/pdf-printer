# Replace with image from Docker.chrome
FROM gcr.io/callmyapp/chrome-headless:v5

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

# RUN google-chrome-stable --headless --disable-gpu --no-sandbox --remote-debugging-port=9222

CMD cd /pdf-printer/src && node app.js
