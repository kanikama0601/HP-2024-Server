from django.db import models
from .auth import UserData
from .organization import OrganizationData
from .event import EventData

class BandData(models.Model):
    name = models.CharField(max_length=100)
    detail = models.TextField()
    image = models.URLField(blank=True)
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='bands')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='bands')
    event = models.ForeignKey(EventData, on_delete=models.CASCADE, related_name='bands', null=True, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class BandInspectionData(models.Model):
    band = models.OneToOneField(BandData, on_delete=models.CASCADE, related_name='band_inspection')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='band_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class BandSongData(models.Model):
    name = models.CharField(max_length=100)
    band = models.ForeignKey(BandData, on_delete=models.CASCADE, related_name='songs')
    spotify = models.URLField(blank=True)
    image = models.URLField(blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class BandSongInspectionData(models.Model):
    song = models.OneToOneField(BandSongData, on_delete=models.CASCADE, related_name='song_inspection')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='song_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
