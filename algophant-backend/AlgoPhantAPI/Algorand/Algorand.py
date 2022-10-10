import base64,datetime
from algosdk.v2client import algod,indexer
from algosdk.error import WrongChecksumError,AlgodHTTPError
from algosdk import mnemonic,transaction,account,encoding,util
from algosdk.future.transaction import AssetConfigTxn,AssetTransferTxn
from .Config import ALGO_INDEX_TESTNET,ALGO_INDEX_MAINNET,ALGO_MAINNET,ALGO_TESTNET


class Algorand():
    """
        My Personal wrapper for the algorand sdk
    """

    def __init__(self,token,network) -> None:
        self.headers = {
        "X-API-Key": token,
        }

        self.token = token
        self.network = network

        if self.network == 'Mainnet':
            self.indexURL = ALGO_INDEX_MAINNET
            self.sdkURL = ALGO_MAINNET
        
        else:
            self.indexURL = ALGO_INDEX_TESTNET
            self.sdkURL = ALGO_TESTNET
        

        self.indexer = indexer.IndexerClient(self.token,self.indexURL,self.headers)
        self.algorand_client = algod.AlgodClient(self.token,self.sdkURL,self.headers)
    

    def set_network(self,network):
        """This changes the users network preferance"""
        self.network = network
        if self.network == 'Mainnet':
            self.indexURL = ALGO_INDEX_MAINNET
            self.sdkURL = ALGO_MAINNET
        
        else:
            self.indexURL = ALGO_INDEX_TESTNET
            self.sdkURL = ALGO_TESTNET
        
        self.indexer = indexer.IndexerClient(self.token,self.indexURL,self.headers)
        self.algorand_client = algod.AlgodClient(self.token,self.sdkURL,self.headers)
        return

    def create_wallet(self):
        """ This generates the algorand wallet"""
        data = {}
        private_key, address = account.generate_account()
        data['address'] = address
        data['private_key'] = private_key
        data['pass_phrase'] = mnemonic.from_private_key(private_key)

        return(data)
    
    def account_from_phrase(self,phrase):
        """ This returns the algorand wallet given the phrase"""
        data = {}

        private_key = mnemonic.to_private_key(phrase)
        address = account.address_from_private_key(private_key)

        data['address'] = address
        data['private_key'] = private_key
        data['pass_phrase'] = phrase

        return(data)

    def account_from_private_key(self,private_key):
        """ This returns the algorand wallet given the private key"""
        data = {}

        phrase = mnemonic.from_private_key(private_key)
        address = account.address_from_private_key(private_key)

        data['address'] = address
        data['private_key'] = private_key
        data['pass_phrase'] = phrase

        return(data)

    def check_balance(self,address) -> int:
        balance = self.algorand_client.account_info(address).get('amount')
        balance  = util.microalgos_to_algos(balance)
        return(balance)
    
    def send_token(self,txn_info) -> dict:

        holder_address = txn_info.get('from_address')
        holder_private_key = txn_info.get('private_key')
        receiver_address = txn_info.get('to_address')
        amount = float(txn_info.get('amount'))
        
        # get suggested parameters from Algod
        params = self.algorand_client.suggested_params()
        gh = params.gh
        amount = util.algos_to_microalgos(amount)
        first_valid_round = params.first
        last_valid_round = params.last
        fee = params.min_fee

        tx = transaction.PaymentTxn(holder_address, fee, first_valid_round, last_valid_round,gh,receiver_address,amount, flat_fee=True)
        
        try:
            signed_tx = tx.sign(holder_private_key)
        except WrongChecksumError:
            return('Checksum failed')

        try:
            tx_confirm = self.algorand_client.send_transaction(signed_tx)
            return({'txn_id':signed_tx.transaction.get_txid()})
        except AlgodHTTPError as e:
            return({"error":f"transaction failed :{str(e).split(':')[-1]}","code":e.code})
    
    def transfer_asset(self,txn_info):
        """
        Creates a signed transfer from holder address to receiver address
        """

        holder_address = txn_info.get('from_address')
        holder_private_key = txn_info.get('private_key')
        receiver_address = txn_info.get('to_address')
        amount = float(txn_info.get('amount'))
        asset_id = int(txn_info.get('asset_id'))


        try:
            params = self.algorand_client.suggested_params()
            asset_info = self.algorand_client.asset_info(asset_id)
            decimals = asset_info['params'].get("decimals")
            amount = int(amount*10**decimals)

            txn = AssetTransferTxn(sender=holder_address, sp=params, receiver=receiver_address, amt=amount, index=asset_id)
            txnID = txn.sign(holder_private_key)
            txid = txnID.transaction.get_txid()
            self.algorand_client.send_transaction(txnID)
            return({'txn_id':txid})
        except AlgodHTTPError as e:
            return({"error":f"transaction failed :{str(e).split(':')[-1]}","code":e.code})


    def optin_token(self,txn_info):
        """
        Creates an opt-in transaction for the specified asset id and 
        address. Uses current network params.
        """
        
        asset_id = int(txn_info.get('asset_id'))
        address = txn_info.get('address')
        private_key = txn_info.get('private_key')


        params = self.algorand_client.suggested_params()
        txn = AssetTransferTxn(sender=address,sp=params, receiver=address, amt=0, index=asset_id)
        try:
            txnID = txn.sign(private_key)
            txid = txnID.transaction.get_txid()
            self.algorand_client.send_transaction(txnID)
            return({'txn_id':txid})
        
        except AlgodHTTPError as e:
            return({"error":f"transaction failed :{str(e).split(':')[-1]}","code":e.code})

    def transactions(self,address) ->list:
        """Return all transactions involving provided address."""
        transaction_list = []
        transactions = self.indexer.search_transactions_by_address(address).get("transactions", [])
        
        for txn in transactions:

            data = {'id':txn.get('id'),
                "round":txn.get("confirmed-round"),
                "type": txn.get("tx-type"),
                "sender": txn.get("sender"),
                "date": datetime.datetime.fromtimestamp(txn.get("round-time")).strftime("%d %b %y"),
                "receiver": txn.get("payment-transaction", txn.get("asset-transfer-transaction",{})).get("receiver"),
                "note": base64.b64decode(txn.get("note", "")).decode("utf-8",errors='ignore'),
                }
            
            if address == txn.get("sender"):
                data["status"] = "Sent"
            else:
                data["status"] = "Received"


            token = txn.get("asset-transfer-transaction",{}).get("asset-id","Algo")
            amount = int(txn.get("payment-transaction",txn.get("asset-transfer-transaction",{})).get("amount"))

            try:
                token = int(token)
                asset_info = self.algorand_client.asset_info(token)
                
                decimals = asset_info['params'].get("decimals")
                amount = amount/10**decimals

                data.update({"token_name":asset_info['params'].get("unit-name"),"amount":amount})
            except Exception as e:
                data.update({"token_name":"Algo","amount":util.microalgos_to_algos(amount)})
            
            transaction_list.append(data)

        return(transaction_list)
    

    def balance_formatter(self,amount, asset_id):
        """
        Returns the formatted units for a given asset and amount. 
        """

        data = {}
        asset_info = self.algorand_client.asset_info(asset_id)
        decimals = asset_info['params'].get("decimals")
        data['asset_name'] = asset_info['params'].get("name")
        data['symbol'] = asset_info['params'].get("unit-name")
        data['formatted_amount'] = amount/10**decimals

        data['asset_id'] = asset_info.get("index")
        
        return(data)
    
    def address_holdings(self,address):
        """
        Returns all the holdings in an address
        """

        result = {}
        result['Assets'] = []

        account_info = self.algorand_client.account_info(address)
        result['algorand_balance'] = util.microalgos_to_algos(account_info.get('amount'))
        assets = account_info.get("assets")
        
        for asset in assets:
            amount = asset.get("amount")
            result['Assets'].append(self.balance_formatter(amount,asset['asset-id']))
        
        return(result)
               
    def asset_balance(self,asset_id:int,address:str):
        """
        Checks the asset balance for the specific address and asset id.
        """

        account_info = self.algorand_client.account_info(address)
        assets = account_info.get("assets")

        for asset in assets:
            if asset['asset-id'] == asset_id:
                amount = asset.get("amount")
                return(self.balance_formatter(amount,asset_id))
        
        return
