from django.db import models
from .auth import UserData, ImageData
from .organization import OrganizationData

class NewsData(models.Model):
    title = models.CharField(max_length=100)
    detail = models.TextField()
    show_top = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='news')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='news', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class NewsImageData(models.Model):
    image = models.ForeignKey(ImageData, on_delete=models.CASCADE, related_name='news_images')
    news = models.ForeignKey(NewsData, on_delete=models.CASCADE, related_name='images')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class NewsInspectionData(models.Model):
    news = models.OneToOneField(NewsData, on_delete=models.CASCADE, related_name='news_inspections')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='news_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
