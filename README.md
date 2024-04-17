# Dragonswap V2

[![Lint](https://github.com/dragonswap-app/v2-core/actions/workflows/lint.yml/badge.svg)](https://github.com/dragonswap-app/v2-core/actions/workflows/lint.yml)
[![Tests](https://github.com/dragonswap-app/v2-core/actions/workflows/tests.yml/badge.svg)](https://github.com/dragonswap-app/v2-core/actions/workflows/tests.yml)
[![Fuzz Testing](https://github.com/dragonswap-app/v2-core/actions/workflows/fuzz-testing.yml/badge.svg)](https://github.com/dragonswap-app/v2-core/actions/workflows/fuzz-testing.yml)
[![npm version](https://img.shields.io/npm/v/@dragonswap/v2-core/latest.svg)](https://www.npmjs.com/package/@dragonswap/v2-core/v/latest)

This repository contains the core smart contracts for the Dragonswap V2 Protocol.
For higher level contracts, see the [dragonswap-v2-periphery](https://github.com/dragonswap-app/v2-periphery)
repository.

## Local deployment

In order to deploy this code to a local testnet, you should install the npm package
`@dragonswap/v2-core`
and import the factory bytecode located at
`@dragonswap/v2-core/artifacts/contracts/DragonswapV2Factory.sol/DragonswapV2Factory.json`.
For example:

```typescript
import {
  abi as FACTORY_ABI,
  bytecode as FACTORY_BYTECODE,
} from '@dragonswap/v2-core/artifacts/contracts/DragonswapV2Factory.sol/DragonswapV2Factory.json'

// deploy the bytecode
```

This will ensure that you are testing against the same bytecode that is deployed to
mainnet and public testnets, and all Dragonswap code will correctly interoperate with
your local deployment.

## Using solidity interfaces

The Dragonswap V2 interfaces are available for import into solidity smart contracts
via the npm artifact `@dragonswap/v2-core`, e.g.:

```solidity
import '@dragonswap/v2-core/contracts/interfaces/IDragonswapV2Pool.sol';

contract MyContract {
  IDragonswapV2Pool pool;

  function doSomethingWithPool() {
    // pool.swap(...);
  }
}

```
