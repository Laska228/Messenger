from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.core.exceptions import ValidationError
from django import forms
from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    # first_name = forms.CharField(max_length=30, label='', required=True, widget=forms.TextInput(attrs={'placeholder': 'Your Name'}), error_messages={'required': 'Please enter your name'})
    username = forms.CharField(max_length=100, label='', required=True, widget=forms.TextInput(attrs={'placeholder': 'Username'}), error_messages={'required': 'Please enter your name'})
    email = forms.EmailField(label='', max_length=254, help_text='', widget=forms.EmailInput(attrs={'placeholder': 'Email-address'}))
    password1 = forms.CharField(label='', required=True,
                                widget=forms.PasswordInput(attrs={'placeholder': 'Enter password'}))
    password2 = forms.CharField(label='', required=True,
                                widget=forms.PasswordInput(attrs={'placeholder': 'Enter the same password'}))

    def clean_password2(self):
        password1 = self.cleaned_data['password1']
        password2 = self.cleaned_data['password2']

        if password1 and password2 and password1 != password2:
            raise ValidationError("Password don't match")
        return password2

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2')


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('email',)