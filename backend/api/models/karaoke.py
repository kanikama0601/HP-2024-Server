from django.db import models
from .auth import UserData
from .organization import OrganizationData
from .event import EventData

class KaraokeData(models.Model):
    name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, blank=True)
    sing_user = models.CharField(max_length=100)
    spotify = models.URLField(blank=True)
    image = models.URLField(blank=True)
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='karaokes')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='karaokes')
    event = models.ForeignKey(EventData, on_delete=models.CASCADE, related_name='karaokes', null=True, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

