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
        asset_id = request.data.get('asset_id',None)
        network = request.data.get("network","Mainnet")
        request.data.pop("network")
        settings.ALGORAND_WALLET.set_network(network)

        if asset_id == None or asset_id == "":
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



# {
#     "address": "LXIGZHPRNWZLZSX5SGESUH3ZSJMVJMDO2GMYR2IL66JFLF3OMRCJJMR2FU",
#     "private_key": "h9lKUJC9Hqc/ozuzOwuvdCp/jfQfBYa3QHa/QrthQR5d0Gyd8W2yvMr9kYkqH3mSWVSwbtGZiOkL95JVl25kRA==",
#     "pass_phrase": "couch clock choice suit dice truth boring desert island coconut fiscal point wrestle cash zero agree valid actress robot cloud isolate flash velvet abandon trash"
# }



# ALgophant Wallet
# "SAkRy0Yl0I4TFbVOqMBTmPa+s913ckKOSUQmLsHxXIKCSl12Ja1xpZ5y6iysKm+8D94ca7zM0fldfXoHDhCz2w=="