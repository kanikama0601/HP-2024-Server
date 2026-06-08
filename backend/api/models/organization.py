from django.db import models
from .auth import UserData

class OrganizationData(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='organizations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrganizationPermissionData(models.Model):
    PERMISSION_TYPE = (
        ('shop', 'shop'),
        ('news', 'news'),
        ('menu', 'menu'),
        ('event', 'event'),
        ('band', 'band'),
        ('karaoke', 'karaoke'),
        ('brassband', 'brassband'),
        ('inspection', 'inspection'),
    )
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='organization_permissions')
    permission_type = models.CharField(max_length=20, choices=PERMISSION_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrganizationPermissionInspectionData(models.Model):
    organization = models.OneToOneField(OrganizationPermissionData, on_delete=models.CASCADE, related_name='organization_permission_inspection')
    inspected = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class PermissionData(models.Model):
    PERMISSION_TYPE = (
        ('admin', 'admin'),
        ('shop', 'shop'),
        ('news', 'news'),
        ('menu', 'menu'),
        ('event', 'event'),
        ('band', 'band'),
        ('karaoke', 'karaoke'),
        ('brassband', 'brassband'),
        ('invite_user', 'invite_user'),
        ('inspection', 'inspection'),
    )
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='permissions')
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='permissions')
    permission_type = models.CharField(max_length=20, choices=PERMISSION_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
