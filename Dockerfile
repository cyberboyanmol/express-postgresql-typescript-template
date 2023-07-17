FROM node:18-bullseye-slim As development

WORKDIR /usr/src/app

COPY [ "package.json", "yarn.lock*", "./" ]


RUN yarn install --only=development

COPY . .


RUN npx prisma generate

RUN yarn build


FROM node:18-bullseye-slim As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY [ "package.json", "yarn.lock*", "./" ]

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist






