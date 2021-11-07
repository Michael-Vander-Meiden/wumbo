from brownie import SolidityStorage, DAI, USDC, Trader, UniswapRouter, accounts, network


def main():
    # requires brownie account to have been created
    if network.show_active()=='development':
        # add these accounts to metamask by importing private key
        owner = accounts[0]

        dai = DAI.deploy("DAI", "DAI", 18, 200, {'from': accounts[0]})
        usdc = USDC.deploy("USDC", "USDC", 18, 200, {'from': accounts[0]})

        router = UniswapRouter.deploy({'from': accounts[0]})

        dai.transfer(router, 100)
        usdc.transfer(router, 100)

        Trader.deploy(dai, usdc, router, {'from':accounts[0]})

        SolidityStorage.deploy({'from':accounts[0]})

    elif network.show_active() == 'kovan':
        # add these accounts to metamask by importing private key
        owner = accounts.load("main")
        SolidityStorage.deploy({'from':owner})
