import base64,datetime
from algosdk.v2client import algod,indexer
from tinyman.v1.client import TinymanClient
from algosdk import mnemonic,transaction,account,util
from algosdk.error import WrongChecksumError,AlgodHTTPError
from algosdk.future.transaction import AssetTransferTxn,wait_for_confirmation
from .Config import ALGO_INDEX_TESTNET,ALGO_INDEX_MAINNET,ALGO_MAINNET,ALGO_TESTNET


class Algorand():
    """
        My Personal wrapper for the algorand sdk
    """

    def __init__(self,token,network:str) -> None:
        self.headers = {
        "X-API-Key": token,
        }

        self.token = token
        self.network = network.lower()

        if self.network == 'mainnet':
            self.indexURL = ALGO_INDEX_MAINNET
            self.sdkURL = ALGO_MAINNET
        else:
            self.indexURL = ALGO_INDEX_TESTNET
            self.sdkURL = ALGO_TESTNET
        

        self.indexer = indexer.IndexerClient(self.token,self.indexURL,self.headers)
        self.algorand_client = algod.AlgodClient(self.token,self.sdkURL,self.headers)

        if self.network == "mainnet":
            self.tinyman = TinymanClient(self.algorand_client,validator_app_id=552635992)
        else:
            self.tinyman = TinymanClient(self.algorand_client,validator_app_id=62368684)
    

    def set_network(self,network:str):
        """This changes the users network preferance"""
        self.network = network.lower()
        if self.network == 'mainnet':
            self.indexURL = ALGO_INDEX_MAINNET
            self.sdkURL = ALGO_MAINNET
        
        else:
            self.indexURL = ALGO_INDEX_TESTNET
            self.sdkURL = ALGO_TESTNET
        
        self.indexer = indexer.IndexerClient(self.token,self.indexURL,self.headers)
        self.algorand_client = algod.AlgodClient(self.token,self.sdkURL,self.headers)

        if self.network == "mainnet":
            self.tinyman = TinymanClient(self.algorand_client,validator_app_id=552635992)
        else:
            self.tinyman = TinymanClient(self.algorand_client,validator_app_id=62368684)
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

    def check_balance(self,address) -> float:
        balance = self.algorand_client.account_info(address).get('amount')
        balance  = float(util.microalgos_to_algos(balance))
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
            return({'error':'Checksum failed'})

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
            if txn.get("tx-type") == "appl":
                data["status"] = "Contract call"
            elif address == txn.get("sender"):
                data["status"] = "Sent"
            else:
                data["status"] = "Received"


            token = txn.get("asset-transfer-transaction",{}).get("asset-id","Algo")
            amount = int(txn.get("payment-transaction",txn.get("asset-transfer-transaction",{})).get("amount",0))

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
        data['formatted_amount'] = round(amount/10**decimals,2)

        data['asset_id'] = asset_info.get("index")
        
        return(data)
    
    def address_holdings(self,address):
        """
        Returns all the holdings in an address
        """

        result = {}
        result['Assets'] = []

        account_info = self.algorand_client.account_info(address)
        result['algorand_balance'] = round(util.microalgos_to_algos(account_info.get('amount')),2)
        assets = account_info.get("assets")

        algorandData = {
            "asset_id":0,
            "symbol":"ALGO",
            "asset_name":"Algorand",
            "formatted_amount":result['algorand_balance']
        }

        result['Assets'].append(algorandData)


        
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
    
    def __optin_tinyman(self,address:str,private_key:str):
        """This opts a user address into the tinyman AMM contract"""

        if not self.tinyman.is_opted_in(address):
            transaction_group = self.tinyman.prepare_app_optin_transactions(address)
            for i, txn in enumerate(transaction_group.transactions):
                if txn.sender == address:
                    transaction_group.signed_transactions[i] = txn.sign(private_key)
            txid = self.tinyman.algod.send_transactions(transaction_group.signed_transactions)
            wait_for_confirmation(self.algorand_client, txid)

    def fetch_asset_info(self,asset_id:int)->dict:
        """ This checks if an asset exists and returns the asset details"""

        try:
            asset = self.tinyman.fetch_asset(asset_id)
            return({"asset_id":asset.id,"symbol":asset.unit_name,"asset_name":asset.name,"formatted_amount":0.0})
        except AlgodHTTPError as e:
            return({"error":f"transaction failed :{str(e).split(':')[-1]}","code":e.code})
    
    def verify_pool(self,from_asset:int,to_asset:int,address:str)->dict:
        """This checks if there is a liquidity pool for both assets"""

        try:
            fromAsset = self.tinyman.fetch_asset(from_asset)
            toAsset = self.tinyman.fetch_asset(to_asset)
        except AlgodHTTPError as e:
            return({"error":f"transaction failed :{str(e).split(':')[-1]}","code":e.code})
        pool = self.tinyman.fetch_pool(toAsset,fromAsset)

        self.tinyman.user_address = address

        if pool.exists:
            quote = pool.fetch_fixed_input_swap_quote(fromAsset(1*10**fromAsset.decimals), slippage=0.01)
            return({"pool_exist":pool.exists,"price":quote.price})
        

        return({"pool_exist":False})
    
    def swap_token(self,address:str,private_key:str,amount_in:float,from_asset:int,to_asset:int)->dict:
        """ This swaps a token from one to another"""
        self.__optin_tinyman(address,private_key)

        try:
            fromAsset = self.tinyman.fetch_asset(from_asset)
            toAsset = self.tinyman.fetch_asset(to_asset)
        except AlgodHTTPError as e:
            return({"error":f"transaction failed :{str(e).split(':')[-1]}","code":e.code})
        

        self.tinyman.user_address = address
        pool = self.tinyman.fetch_pool(toAsset,fromAsset)
        asset_opted_in = self.tinyman.asset_is_opted_in(toAsset)

        if not asset_opted_in and toAsset.id != 0:
            txn_info = {"asset_id":to_asset,"address":address,"private_key":private_key}
            optinAsset = self.optin_token(txn_info)
            if optinAsset.get("error"):
                return(optinAsset)
            
        if pool.exists:
            quote = pool.fetch_fixed_input_swap_quote(fromAsset(amount_in*10**fromAsset.decimals), slippage=0.01)

            # Prepare a transaction group
            transaction_group = pool.prepare_swap_transactions(
                amount_in=quote.amount_in,
                amount_out=quote.amount_out_with_slippage,
                swap_type='fixed-input',
                swapper_address=address,
            )

            try:
                # Sign the group with our key
                for i, txn in enumerate(transaction_group.transactions):
                    if txn.sender == address:
                        transaction_group.signed_transactions[i] = txn.sign(private_key)
                swap_txid = self.algorand_client.send_transactions(transaction_group.signed_transactions)
                wait_for_confirmation(self.algorand_client, swap_txid)
                
            except AlgodHTTPError as e:
                return({"error":f"transaction failed :{str(e).split(':')[-1]}","code":e.code})

            # Check if any excess remaining after the swap
            excess = pool.fetch_excess_amounts(address)
            if toAsset.id in excess:
                amount = excess[toAsset.id]
                # We might just let the excess accumulate rather than redeeming if its < 1 TinyUSDC
                if amount > 1_000_000:
                    transaction_group = pool.prepare_redeem_transactions(amount, address)
                    # Sign the group with our key
                    for i, txn in enumerate(transaction_group.transactions):
                        if txn.sender == address:
                            transaction_group.signed_transactions[i] = txn.sign(private_key)
                    excess_txid = self.algorand_client.send_transactions(transaction_group.signed_transactions)
                    wait_for_confirmation(self.algorand_client, excess_txid)

            return({'txn_id':swap_txid})
        
        return({"error":"Transaction failed"})



    
