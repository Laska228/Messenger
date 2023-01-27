import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-ins-xhv4h8)%5yt*fscw-tgx%ndh5bbxjo%cu&7a^b%a%@umj53ae5'

DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'CHAT',
        'USER': 'postgres',
        'PASSWORD': '123456',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

STATIC_DIR = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [STATIC_DIR]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

