'use strict';

const Hapi = require('hapi');
const request = require('request');

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 8000
});

server.route({
  method: 'GET',
  path: '/ping',
  handler: (req, reply) => reply('PONG')
});

server.route({
  method: 'POST',
  path: '/hook',
  handler: (req, reply) => {
    const data = req.payload;

    if (!data.pull_request) {
      console.error('[/hook][error] unsupported_event');
      return reply({
        ok: false,
        error: 'unsupported_event',
        message: 'only `pull_request` is supported'
      });
    }

    if (data.action !== 'opened') {
      console.error('[/hook][error] unsupported_action');
      return reply({
        ok: false,
        error: 'unsupported_action',
        message: 'only `opened` is supported'
      });
    }

    const branch = data.pull_request.head.ref;
    const owner = data.repository.owner.login;
    const project = data.repository.name;
    const body = { CI_PULL_REQUEST: data.pull_request.html_url };
    const qs = { 'circle-token': process.env.CIRCLE_TOKEN };

    const url = `https://circleci.com/api/v1/project/${owner}/${project}/tree/${branch}`;

    request.post({ url, qs, body, json: true }, (err, res, payload) => {
      if (err) {
        console.error('[/hook][error][request] request_error', err);
        return reply({
          ok: false,
          error: 'request_error',
          message: err
        });
      }

      return reply(payload, res.statusCode);
    });
  }
});

server.start(function () {
  console.info(`Server started at ${server.info.uri}`);
});

process.on('SIGINT', function () {
  console.log('sigint');
  process.exit(0);
});

process.on('SIGTERM', function () {
  console.log('sigterm');
  process.exit(0);
});
