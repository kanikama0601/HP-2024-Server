from django.db import models
from .auth import UserData, ImageData
from .organization import OrganizationData

class PostData(models.Model):
    title = models.CharField(max_length=100)
    detail = models.TextField()
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='posts', blank=True, null=True)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='posts')
    show = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PostImageData(models.Model):
    image = models.ForeignKey(ImageData, on_delete=models.CASCADE, related_name='post_images')
    post = models.ForeignKey(PostData, on_delete=models.CASCADE, related_name='images')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PostInspectionData(models.Model):
    post = models.OneToOneField(PostData, on_delete=models.CASCADE, related_name='post_inspection')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='post_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
