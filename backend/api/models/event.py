from django.db import models
from .auth import UserData, ImageData
from .organization import OrganizationData

class EventData(models.Model):
    title = models.CharField(max_length=100)
    place = models.CharField(max_length=100, null=True)
    detail = models.TextField()
    start = models.DateTimeField()
    end = models.DateTimeField()
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='events')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='events')
    is_karaoke = models.BooleanField(default=False)
    is_band = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class EventImageData(models.Model):
    image = models.ForeignKey(ImageData, on_delete=models.CASCADE, related_name='event_images')
    event = models.ForeignKey(EventData, on_delete=models.CASCADE, related_name='images')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class EventInspectionData(models.Model):
    event = models.OneToOneField(EventData, on_delete=models.CASCADE, related_name='event_inspection')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='event_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
