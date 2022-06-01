# Lottery Contracts

## Contract Address

Erc20 0xd7DF306D557001f6b1e92C173FfCC5EC417E810B
Factory 0x7FffF4f92E1dB6B32f337affE2Ae6a7c244699C3
Lottery 0x639Fde7E77468b25d6D674A04168926f13c407AE

## Demo Application

<http://tiki-lottery-dapp.s3-website-ap-southeast-1.amazonaws.com/>

- Application is running on Ropsten testnet
- Factory contract: 0x7FffF4f92E1dB6B32f337affE2Ae6a7c244699C3

## How to use

![Demo Application](demo-app.png)

You can `Create new` lottery or `Use existing` lottery.

With existing lottery contract, you can `enter address` (e.g. 0x0f12f75Af1702E958061d73B511EE475e0cF64aF) or a lottery, or `pick` from the list (left side) of lotteries you created before.

To interact with a lottery (right side):

- If you are creator, you can stop the lottery
- If you are not creator, you can bet
  1. Approve lottery contract to use token (you must own enough token)
  2. Enter the number you guess, click Bet
