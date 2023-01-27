from .models import *


class DataMixin:
    def get_user_context(self, **kwargs):
        context = kwargs
        users = CustomUser.objects.all()
        context = kwargs
        return context