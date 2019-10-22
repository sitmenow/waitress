[![CircleCI](https://circleci.com/gh/sitmenow/waitress/tree/master.svg?style=svg)](https://circleci.com/gh/sitmenow/waitress/tree/master)

# Waitress
Sit Me Now backend service.


## Setup

### Requirements
Install nodejs + yarn:
```bash
$ brew install nodeenv
$ brew install yarn --without-node

$ nodeenv /path/to/your/envs/node
$ source /path/to/your/envs/node/bin/activate
$ cd /path/to/waitress/repo/path

$ yarn install
```

Install mongodb:
```
$ brew install mongodb
$ brew services start mongodb
```

### Database

### Config files
There is one configuration file for each expected environment: develop, staging, test and production.


## Tests

### Unit tests
```bash
$ yarn test-unit
$ yarn --silent run test-path path/to/file
```

## Run
```bash
$ yarn run start
```

## Seed
To create objects manually, remember to use the right node environment. Example:
```bash
$ NODE_ENV=develop node <filename>.js
```
