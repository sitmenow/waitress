# Waitress
Sit Me Now application service.


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

#### Database

### Config files


## Test
```bash
$ npm test
$ npm --silent run test-path path/to/file
```

NOTE: Tests for stores need to be executed all at the same time. Otherwise,
the command will fail.

```bash
$ npm --silent run test-pah test/scheduler/stores/mongoose/
```

## Run
```bash
$ npm run start
```
