FROM node:18

# Create app directory
WORKDIR $HOME/MindoFutures/MedicalMission/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . ./

EXPOSE 3005
CMD [ "npm", "start" ]
