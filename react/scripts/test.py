from brownie import Token, accounts

def main():
    A=Token.deploy("Token A", "TOKA", 18, 1e21, {'from': accounts[0]})
