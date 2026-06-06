from django.db import models
from django.contrib.auth.models import AbstractUser

class UserData(AbstractUser):
    organization = models.ManyToManyField('OrganizationData', related_name='users')
    description = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ImageData(models.Model):
    image = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
