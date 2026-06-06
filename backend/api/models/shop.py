from django.db import models
from .auth import UserData, ImageData
from .organization import OrganizationData

class ShopData(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    detail = models.TextField()
    image = models.ForeignKey('ShopImageData', on_delete=models.CASCADE, related_name='top_image', blank=True, null=True)
    organization = models.ForeignKey(OrganizationData, on_delete=models.CASCADE, related_name='shops')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='shops')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ShopImageData(models.Model):
    image = models.ForeignKey(ImageData, on_delete=models.CASCADE, related_name='shop_images')
    shop = models.ForeignKey(ShopData, on_delete=models.CASCADE, related_name='images')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ShopInspectionData(models.Model):
    shop = models.OneToOneField(ShopData, on_delete=models.CASCADE, related_name='shop_inspection')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='shop_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class MenuData(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    shop = models.ForeignKey(ShopData, on_delete=models.CASCADE, related_name='menus')
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='menus')
    sold_out = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MenuInspectionData(models.Model):
    menu = models.OneToOneField(MenuData, on_delete=models.CASCADE, related_name='menu_inspection')
    inspected = models.BooleanField(default=False)
    ai = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='menu_inspections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
