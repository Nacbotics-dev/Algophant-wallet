from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions,status



class NewWallet(APIView):
    """
        This generates a new Algorand wallet on call
    """

    permission_classes = [permissions.AllowAny]

    def get(self,request,*args,**kwargs):
        result = settings.ALGORAND_WALLET.create_wallet()
        return(Response(result,status=status.HTTP_201_CREATED))

class RestoreWalletPhrase(APIView):
    """
        This restores an Algorand Wallet from it's passphrase 
    """

    permission_classes = [permissions.AllowAny]

    def post(self,request,*args,**kwargs):
        try:
            phrase = request.data['phrase']
            result = settings.ALGORAND_WALLET.account_from_phrase(phrase)
            return(Response(result,status=status.HTTP_201_CREATED))
        except:
            return(Response({"error":"Please Specify a seed phrase"},status=status.HTTP_400_BAD_REQUEST))

class RestoreWalletKey(APIView):
    """
        This restores an Algorand Wallet from it's private key 
    """

    permission_classes = [permissions.AllowAny]

    def post(self,request,*args,**kwargs):
        try:
            private_key = request.data['key']
            result = settings.ALGORAND_WALLET.account_from_private_key(private_key)
            return(Response(result,status=status.HTTP_201_CREATED))
        except:
            return(Response({"error":"Please Specify a private key"},status=status.HTTP_400_BAD_REQUEST))

class SendToken(APIView):
    """
        This transfers a token from one wallet address to another
    """
    permission_classes = [permissions.AllowAny]

    def post(self,request,*args,**kwargs):
        asset_id = request.data.get('asset_id',0)
        network = request.data.get("network","Mainnet")
        request.data.pop("network")
        settings.ALGORAND_WALLET.set_network(network)

        if asset_id == None or asset_id == "" or asset_id == 0:
            result = settings.ALGORAND_WALLET.send_token(request.data)
        else:
            result = settings.ALGORAND_WALLET.transfer_asset(request.data)

        return(Response(result,status=status.HTTP_201_CREATED))
        
class AddToken(APIView):
    """
        This opt-in a token to your Algorand wallet
    """

    permission_classes = [permissions.AllowAny]

    def post(self,request,*args,**kwargs):

        print(request.data)
        network = request.data.get("network","Mainnet")
        request.data.pop("network")
        settings.ALGORAND_WALLET.set_network(network)

        
        result = settings.ALGORAND_WALLET.optin_token(request.data)
        return(Response(result,status=status.HTTP_201_CREATED))

class Transactions(APIView):
    """
        This returns all wallet transactions from a particular address
    """
    permission_classes = [permissions.AllowAny]

    def get(self,request,address,*args,**kwargs):
        network = request.query_params.get('network','Mainnet')
        settings.ALGORAND_WALLET.set_network(network)

        result = settings.ALGORAND_WALLET.transactions(address)
        return(Response(result,status=status.HTTP_201_CREATED))

class Assets(APIView):
    """
        This returns all the tokens in a users wallet with there respective balance
    """

    permission_classes = [permissions.AllowAny]

    def get(self,request,address,*args,**kwargs):
        network = request.query_params.get('network','Mainnet')
        settings.ALGORAND_WALLET.set_network(network)

        result = settings.ALGORAND_WALLET.address_holdings(address)
        return(Response(result,status=status.HTTP_201_CREATED))

class AssetInfo(APIView):
    """
        This returns all the tokens in a users wallet with there respective balance
    """

    permission_classes = [permissions.AllowAny]

    def get(self,request,asset_id,*args,**kwargs):
        network = request.query_params.get('network','Mainnet')
        settings.ALGORAND_WALLET.set_network(network)

        result = settings.ALGORAND_WALLET.fetch_asset_info(int(asset_id))
        return(Response(result,status=status.HTTP_201_CREATED))

class VerifyPool(APIView):
    """
        This checks if there is liquidity for the tokens you want to swap
    """

    permission_classes = [permissions.AllowAny]

    def post(self,request,*args,**kwargs):
        network = request.data.get('network','Mainnet')
        settings.ALGORAND_WALLET.set_network(network)
        

        try:
            from_asset = int(request.data.get('from_asset'))
            to_asset = int(request.data.get('to_asset'))
        except:
            return(Response({"error":"invalid asset id"},status=status.HTTP_406_NOT_ACCEPTABLE))
        
        address = request.data.get("address")
        if address:
            result = settings.ALGORAND_WALLET.verify_pool(from_asset,to_asset,address)
            return(Response(result,status=status.HTTP_201_CREATED))
        
        return(Response({"error":"address cannot be empty"},status=status.HTTP_406_NOT_ACCEPTABLE))
    
class SwapToken(APIView):
    """
        This swaps one asset to another provided it has a liquidity pool
    """

    def post(self,request,*args,**kwargs):
        network = request.data.get('network','Mainnet')
        settings.ALGORAND_WALLET.set_network(network)

        try:
            address = str(request.data.get("address"))
            private_key = str(request.data.get("private_key"))
            amount_in = float(request.data.get("amount_in"))
            from_asset = int(request.data.get("from_asset"))
            to_asset = int(request.data.get("to_asset"))
            result = settings.ALGORAND_WALLET.swap_token(address,private_key,amount_in,from_asset,to_asset)
        except ValueError as e:
            return(Response(request.data,status=status.HTTP_400_BAD_REQUEST))

        return(Response(result,status=status.HTTP_200_OK))

# {
#     "address": "LXIGZHPRNWZLZSX5SGESUH3ZSJMVJMDO2GMYR2IL66JFLF3OMRCJJMR2FU",
#     "private_key": "h9lKUJC9Hqc/ozuzOwuvdCp/jfQfBYa3QHa/QrthQR5d0Gyd8W2yvMr9kYkqH3mSWVSwbtGZiOkL95JVl25kRA==",
#     "pass_phrase": "couch clock choice suit dice truth boring desert island coconut fiscal point wrestle cash zero agree valid actress robot cloud isolate flash velvet abandon trash"
# }



# ALgophant Wallet
# "SAkRy0Yl0I4TFbVOqMBTmPa+s913ckKOSUQmLsHxXIKCSl12Ja1xpZ5y6iysKm+8D94ca7zM0fldfXoHDhCz2w=="