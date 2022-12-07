from django.urls import path, include
from .views import (NewWallet,AddToken,Assets,AssetInfo,
RestoreWalletPhrase,RestoreWalletKey,SendToken,VerifyPool,
Transactions,SwapToken)






urlpatterns = [
    path('new-wallet/', NewWallet.as_view()),
    path('send-token/', SendToken.as_view()),
    path('opt-in-token/', AddToken.as_view()),
    path('verify-pool/', VerifyPool.as_view()),
    path('swap-token/', SwapToken.as_view()),
    path('list-assets/<address>/', Assets.as_view()),
    path('fetch_asset_info/<asset_id>/', AssetInfo.as_view()),
    path('transaction-list/<address>/', Transactions.as_view()),
    path('restore-wallet-from-key/', RestoreWalletKey.as_view()),
    path('restore-wallet-from-phrase/', RestoreWalletPhrase.as_view()),
    
    
]

