Github PR CircleCI trigger
==========================

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Since CircleCI doesn't trigger a build when a PR is opened I made this, so we
can actually trigger builds when a PR is opened.

**Requirements:**

* `CIRCLE_TOKEN`: Get a CircleCI token here: https://circleci.com/account/api

**Setup:**

* Create a new webook in your repo: `settings` -> `webhooks` -> `add webhook`
* Set the url to `https://{your-heroku-url}.com/hook`
* (No secret needed)
* Choose the `pull_request` event (you can choose all, but nothing will happen when they're triggered)
* Success!
