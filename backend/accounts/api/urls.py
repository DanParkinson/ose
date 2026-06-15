from django.urls import path
from .views import (
    AccountDeactivateView,
    ReactivationRequestView,
    ReactivationConfirmView,
    EmailChangeRequestView,
    EmailChangeConfirmView,
    EmailChangeCancelView,
)

urlpatterns = [
    path("account/deactivate/", AccountDeactivateView.as_view()),
    path("account/reactivate/request/", ReactivationRequestView.as_view()),
    path("account/reactivate/confirm/", ReactivationConfirmView.as_view()),
    path("account/update-email/", EmailChangeRequestView.as_view()),
    path("account/update-email/confirm/", EmailChangeConfirmView.as_view()),
    path("account/update-email/cancel/", EmailChangeCancelView.as_view()),
]
