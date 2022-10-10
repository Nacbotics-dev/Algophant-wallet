from django.urls import path, include
from .views import (NewWallet,AddToken,Assets,
RestoreWalletPhrase,RestoreWalletKey,SendToken,Transactions)






urlpatterns = [
    path('new-wallet/', NewWallet.as_view()),
    path('send-token/', SendToken.as_view()),
    path('opt-in-token/', AddToken.as_view()),
    path('list-assets/<address>/', Assets.as_view()),
    path('transaction-list/<address>/', Transactions.as_view()),
    path('restore-wallet-from-key/', RestoreWalletKey.as_view()),
    path('restore-wallet-from-phrase/', RestoreWalletPhrase.as_view()),
    
    
]
