FROM node:20-alpine

WORKDIR /usr/src/app

# Copy yarn files
COPY package.json yarn.lock ./

# Install dependencies using the 'frozen' equivalent
# If using Yarn 1.x:
RUN yarn install --frozen-lockfile --production

# If using Yarn 2+:
# RUN yarn install --immutable

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "start" ]