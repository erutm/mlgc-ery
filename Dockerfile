FROM node:18.19.1

WORKDIR /app
ENV PORT 8080sudo snap remove docker
ENV HOST 0.0.0.0

COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start"]