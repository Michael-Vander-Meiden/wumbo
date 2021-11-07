from brownie import SolidityStorage, DAI, USDC, Trader, accounts, network


def main():
    # requires brownie account to have been created
    if network.show_active()=='development':
        # add these accounts to metamask by importing private key
        owner = accounts[0]

        dai = DAI.deploy("DAI", "DAI", 18, 100, {'from': accounts[0]})
        usdc = USDC.deploy("USDC", "USDC", 18, 100, {'from': accounts[0]})

        Trader.deploy(dai, usdc, {'from':accounts[0]})

        SolidityStorage.deploy({'from':accounts[0]})

    elif network.show_active() == 'kovan':
        # add these accounts to metamask by importing private key
        owner = accounts.load("main")
        SolidityStorage.deploy({'from':owner})
