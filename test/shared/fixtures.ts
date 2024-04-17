import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeDragonswapV2Pool } from '../../typechain/MockTimeDragonswapV2Pool'
import { TestERC20 } from '../../typechain/TestERC20'
import { DragonswapV2Factory } from '../../typechain/DragonswapV2Factory'
import { TestDragonswapV2Callee } from '../../typechain/TestDragonswapV2Callee'
import { TestDragonswapV2Router } from '../../typechain/TestDragonswapV2Router'
import { MockTimeDragonswapV2PoolDeployer } from '../../typechain/MockTimeDragonswapV2PoolDeployer'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: DragonswapV2Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory('DragonswapV2Factory')
  const factory = (await factoryFactory.deploy()) as DragonswapV2Factory
  return { factory }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestDragonswapV2Callee
  swapTargetRouter: TestDragonswapV2Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeDragonswapV2Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeDragonswapV2PoolDeployerFactory = await ethers.getContractFactory('MockTimeDragonswapV2PoolDeployer')
  const MockTimeDragonswapV2PoolFactory = await ethers.getContractFactory('MockTimeDragonswapV2Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestDragonswapV2Callee')
  const routerContractFactory = await ethers.getContractFactory('TestDragonswapV2Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestDragonswapV2Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestDragonswapV2Router

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer = (await MockTimeDragonswapV2PoolDeployerFactory.deploy()) as MockTimeDragonswapV2PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string
      return MockTimeDragonswapV2PoolFactory.attach(poolAddress) as MockTimeDragonswapV2Pool
    },
  }
}
