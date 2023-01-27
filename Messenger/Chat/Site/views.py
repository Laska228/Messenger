from django.http import HttpResponse, HttpResponseNotFound, JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, reverse
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy
from .utils import *
from .forms import *
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm
import hashlib
from django.views.generic import ListView, CreateView
from django.core.files.storage import FileSystemStorage
from django.utils.safestring import mark_safe
import json


@login_required(login_url='login')
def room(request, room):
    mes = Message.objects.all()
    for item in mes:
        for fl in item.file.all():
            print(fl.file)
    User = get_user_model()
    all_chats = Room.objects.filter(users=request.user)
    all_users = User.objects.all()
    username = request.user
    opponent = User.objects.get(id=username.id)
    room_details = Room.objects.get(id=room)
    return render(request, 'room.html', {
        'username': username.username,
        'room': room,
        'room_details': room_details,
        'users': str(opponent),
        "all_chats": all_chats,
        "all_users": all_users,
    })


@login_required(login_url='login')
def checkview(request, username = ''):
    opponent = "User.objects.get(email=request.POST['users'][8:])"
    room = request.POST['chats']

    if Room.objects.filter(id=room).exists():
        return redirect('/'+room+'/?with='+str(opponent))
    else:
        new_room = Room.objects.create(name=room)
        new_room.save()
        return redirect('/'+room+'/?with='+str(opponent))


@login_required(login_url='login')
def checkview_users(request, username = ''):
    User = get_user_model()
    opponent = User.objects.get(email=request.POST['users'][8:])
    username = request.user.username
    # username_id = request.user.id

    if Room.objects.filter(users=request.user).filter(users=opponent).exists():
        room = str(Room.objects.filter(users=request.user).filter(users=opponent)[0].id)
        return redirect('/'+room+'/?with=')
    else:
        last_room = Room.objects.all().count() + 1
        new_room = Room.objects.create(name=last_room)
        new_room.save()
        return redirect('/'+str(new_room.id)+'/?with=')


@login_required(login_url='login')
def send(request):
    url = False
    files = request.FILES.getlist('file', False)
    message = request.POST.get('message', False)
    username = request.POST.get('username', False)
    room_id = request.POST.get('room_id', False)
    if(message != "" or files != False):
        new_message = Message.objects.create(value=message, user=username, room=room_id)
        new_message.save()
    if (files != False):
        for file in files:
            fss = FileSystemStorage()
            filename = fss.save(file.name, file)
            url = fss.url(filename)
            new_file = File.objects.create(file=url, mes_id=new_message.id, room=room_id)
            new_file.save()


        return HttpResponse('Message sent successfully')



@login_required(login_url='login')
def getMessages(request, room):
    room_details = Room.objects.get(name=room)
    files = File.objects.filter(room=room_details.id)
    messages = Message.objects.filter(room=room_details.id)
    User = get_user_model()
    all_chats = Room.objects.filter(users=request.user)
    all_users = User.objects.all()
    return JsonResponse({"messages": list(messages.values()), "files": list(files.values()), "all_chats": list(all_chats.values()), "all_users": list(all_users.values())})


@login_required(login_url='login')
def home(request):
    User = get_user_model()
    all_users = User.objects.all()
    username = request.user.rooms
    all_chats = username.all()
    opponent = ""
    for each in all_chats:
        opponent = each.users.filter(email=request.user)

    return render(request, 'home.html', {"all_users": all_users, "all_chats": all_chats, "opponent": opponent})


@login_required(login_url='login')
def deleteuser(request):
    if request.method == 'POST':
        delete_form = UserDeleteForm(request.POST, instance=request.user)
        user = request.user
        user.delete()
        return redirect('login')
    else:
        delete_form = UserDeleteForm(instance=request.user)

    context = {
        'delete_form': delete_form
    }

    return redirect('login')


def main(request):
    return render(request, 'pages/main.html')


def pageNotFound(request, exception):
    return HttpResponseNotFound('<h1>Buy my courses</h1>')


class RegisterUser(DataMixin, CreateView):
    form_class = CustomUserCreationForm
    # fields = ('username', 'email', 'password', 'first_name')
    template_name = 'pages/registr.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, *, object_list = None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Registration")
        return dict(list(context.items()) + list(c_def.items()))


    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('home')


class LoginUser(DataMixin, LoginView):
    form_class = AuthenticationForm
    template_name = 'pages/login.html'
    success_url = reverse_lazy('home')

    def get_context_data(self, *, object_list = None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Login")
        return dict(list(context.items()) + list(c_def.items()))


def logout_user(request):
    logout(request)
    return redirect('login')


def profile(request):
    return render(request, 'pages/profile.html')


    def get_context_data(self, *, object_list = None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = self.get_user_context(title="Registration")
        return dict(list(context.items()) + list(c_def.items()))


    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('home')


# def index(request):
#     return render(request, 'chat/index.html', {})
#
#
# def room(request, room_name):
#
#     return render(request, 'chat/room.html', {
#         'room_name_json': mark_safe(json.dumps(room_name))
#     })