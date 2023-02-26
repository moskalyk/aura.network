# aura.network (wip name)
something about 1/n shamir key shares on a p2p swarm, bzz

## how to run
Input an ECDSA private key on `line 6` of `hub.ts`

```
$ cd twig

# run the hub
$ ts-node hub.ts

# then pass the hub hypercore key into the validator
$ ts-node validator.ts <core.key>
```

## tests
On `line 31` of `test/test.ts` update the `main(<hub_peer_id>, <validator_peer_id>)`

```
$ yarn test
```

### test suite
TODO