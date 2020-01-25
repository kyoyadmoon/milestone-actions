FROM node:10.11.0-alpine

COPY ./src ./action

ENTRYPOINT ["/action/entrypoint.sh"]