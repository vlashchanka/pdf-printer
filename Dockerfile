FROM gcr.io/callmyapp/chrome-headless:v3

ADD ./ /pdf-printer/
RUN cd /pdf-printer/ && npm install
EXPOSE 3000

CMD cd /pdf-printer/src && node app.js
