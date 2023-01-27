from django.contrib import admin
from django.urls import path, re_path, include
from Site import views
from django.conf import settings
from django.conf.urls.static import static
from .models import *


urlpatterns = [
    path('main/', views.main, name='main'),
    # path('', views.index, name='index'),
    # path('<str:room_name>/', views.room, name='room'),
    path('profile/', views.profile, name='profile'),
    path('', views.home, name='home'),
    path('registration/', views.RegisterUser.as_view(), name='registr'),
    path('accounts/', include('allauth.urls')),
    path('login/', views.LoginUser.as_view(), name='login'),
    re_path('logout', views.logout_user, name='logout'),
    re_path('delete_account', views.deleteuser, name='delete_account'),
    path('<str:room>/', views.room, name='room'),
    re_path('checkview_users', views.checkview_users, name='checkview_users'),
    re_path('checkview', views.checkview, name='checkview'),
    path('send', views.send, name='send'),
    path('getMessages/<str:room>/', views.getMessages, name='getMessages'),
]
handler404 = views.pageNotFound


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)