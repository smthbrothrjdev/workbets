FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM pierrezemb/gostatic
COPY --from=build /app/dist/ /srv/http/
CMD ["-port","8080","-https-promote", "-enable-logging"]
