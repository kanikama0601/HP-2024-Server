from django.db import models
from .auth import UserData
from .organization import OrganizationData
from .event import EventData

class BrassBandData(models.Model):
    name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='brassbands')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='brassbands')
    event = models.ForeignKey(EventData, on_delete=models.CASCADE, related_name='brassbands', null=True, blank=True)
    order = models.IntegerField(default=0)
    performance_time = models.TimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class BrassBandInspectionData(models.Model):
    brassband = models.OneToOneField(BrassBandData, on_delete=models.CASCADE, related_name='brassband_inspection')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='brassband_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
