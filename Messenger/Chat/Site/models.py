from django.db import models
from django.utils.translation import gettext_lazy as _
from django import forms
from django.contrib.auth.models import AbstractUser
# from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from datetime import datetime
from .managers import CustomUserManager
import hashlib
from binascii import hexlify


class Room(models.Model):
    name = models.CharField(max_length=1000)
    users = models.ManyToManyField("CustomUser")
    unread_cnt = models.CharField(max_length=1000, null=True)


class CustomUser(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=100, unique=False, null=True)
    image = models.ImageField(null=True, upload_to='images/', default='default_avatar.jpg')
    rooms = models.ManyToManyField(Room)

    def clean_password2(self):
        password1 = self.cleaned_data['password1']
        password2 = self.cleaned_data['password2']

        if password1 and password2 and password1 != password2:
            raise ValidationError("Password don't match")
        return password2

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()


    def __str__(self):
        return self.email


class File(models.Model):
    file = models.FileField(null=True, blank=True, upload_to='images/')
    mes_id = models.CharField(max_length=1000000, null=True)
    room = models.CharField(max_length=1000000, null=True)


# def _createHash():
#     hash = hashlib.sha1()
#     hash.update(str(time.time()))
#     return hash.hexdigest()[:-10]


class Message(models.Model):
    value = models.CharField(max_length=1000000, null=True)
    date = models.DateTimeField(default=datetime.now, blank=True)
    user = models.CharField(max_length=1000000, null=True)
    room = models.CharField(max_length=1000000, null=True)
    file = models.ManyToManyField(File, blank=True)
    viewed = models.BooleanField(default=False)


# class RegisterForm(UserCreationForm):
#     first_name = forms.CharField(max_length=30, label='', required=True, widget=forms.TextInput(attrs={'placeholder': 'Your Name'}), error_messages={'required': 'Please enter your name'})
#     username = forms.CharField(max_length=100, label='', required=True, widget=forms.TextInput(attrs={'placeholder': 'Username'}), error_messages={'required': 'Please enter your name'})
#     email = forms.EmailField(label='', max_length=254, help_text='', widget=forms.EmailInput(attrs={'placeholder': 'Email-address'}))
#     password1 = forms.CharField(label='', required=True,
#                                 widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'}))
#     password2 = forms.CharField(label='', required=True,
#                                 widget=forms.PasswordInput(attrs={'placeholder': 'Enter the same password'}))
#
#     def clean_password2(self):
#         password1 = self.cleaned_data['password1']
#         password2 = self.cleaned_data['password2']
#
#         if password1 and password2 and password1 != password2:
#             raise ValidationError("Password don't match")
#         return password2
#
#     class Meta:
#         model = CustomUser
#         fields = ('first_name', 'username', 'email', 'password1', 'password2')


# class Profile(models.Model):
#     user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='images/', default='default_avatar.jpg', null=True, blank=True)


class RemoveUser(forms.Form):
    username = forms.CharField()


class UserDeleteForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = []