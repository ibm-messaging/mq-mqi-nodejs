# ibmmq unit tests

This directory contains the automated test suite for the `ibmmq` Node.js library,
using the built-in `node:test` runner (Node.js ≥ 20). By default the tests connect
to a local queue manager **QM1** and also exercise client and TLS connections.

## Files

| File | Contents |
|------|----------|
| `common.js` | Shared configuration constants and MQ promise helpers (required by all test files) |
| `tc_basic.js` | TC1–TC5 — local-bindings connectivity and messaging |
| `tc_client.js` | TC6a–TC6c — client-mode connections (MQCNO_CLIENT_BINDING + MQCD + MQCSP) |
| `tc_tls.js` | TC7a–TC7c — TLS client connections (MQCD.SSLCipherSpec + MQSCO.KeyRepository) |

## Running the tests

Run all test files together:

```sh
node --test unittests/tc_basic.js unittests/tc_client.js unittests/tc_tls.js
```

Or use a glob (Node.js ≥ 21 supports glob patterns natively):

```sh
node --test 'unittests/tc_*.js'
```

Run a single file in isolation:

```sh
node --test unittests/tc_basic.js
node --test unittests/tc_client.js
node --test unittests/tc_tls.js
```

Exit code is `0` if all tests pass, `1` otherwise.

## Passing custom parameters

### Option A — JSON config file (recommended)

Copy the example file, edit the values you need, and pass it with `--config`:

```sh
cp unittests/config.example.json unittests/config.json
# edit config.json …
node --test unittests/tc_basic.js -- --config unittests/config.json
```

All keys are optional — omit any key to use the built-in default.

### Option B — positional arguments

Positional arguments follow a `--` separator (`node:test` passes its own
flags before `--`) and **override** any value set in the config file:

```
node --test unittests/tc_basic.js -- \
  <qmgr> <queue> <topic> \
  <clientHost> <clientChannel> <clientUser> <clientPass> \
  <tlsHost> <tlsChannel> <tlsCipher> <tlsKeyRepo>
```

### Priority

`positional args` > `--config file` > `built-in defaults`

### All parameters (optional)

| # | Parameter | Default |
|---|-----------|---------|
| 1 | `qmgr` | `QM1` |
| 2 | `queue` | `DEV.QUEUE.1` |
| 3 | `topic` | `dev/JSTopic` |
| 4 | `clientHost` | `localhost(1414)` |
| 5 | `clientChannel` | `DEV.APP.SVRCONN` |
| 6 | `clientUser` | `app` |
| 7 | `clientPass` | `passw0rd` |
| 8 | `tlsHost` | `localhost(1414)` |
| 9 | `tlsChannel` | `SYSTEM.SSL.SVRCONN` |
| 10 | `tlsCipher` | `ANY_TLS12_OR_HIGHER` |
| 11 | `tlsKeyRepo` | `/var/mqm/ssl/key` |

## Prerequisites

- **TC1–TC5** require a locally accessible queue manager (bindings mode). The
  user running the tests must have `+connect` and `+put`/`+get` authority on
  `DEV.QUEUE.1` and `dev/JSTopic`.
- **TC6** requires a client-accessible SVRCONN channel (`DEV.APP.SVRCONN` by
  default) and a user `app` with password `passw0rd`.
- **TC7** requires a TLS-enabled SVRCONN channel (`SYSTEM.SSL.SVRCONN` by
  default) and a key repository that trusts the queue manager's certificate.
  The sample keystore at `samples/mykey` (no extension) can be used for a
  local developer queue manager:

  ```sh
  node --test unittests/tc_tls.js -- QM1 DEV.QUEUE.1 dev/JSTopic \
    localhost(1414) DEV.APP.SVRCONN app passw0rd \
    localhost(1414) SYSTEM.SSL.SVRCONN ANY_TLS12_OR_HIGHER ./samples/mykey
  ```
