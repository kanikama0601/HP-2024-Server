from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models import *
from ..utils.constant import *
from .permission import *
from ..utils.mail import *
import json

# Create your views here.

def perform_inspection(category, item_id):
    # inspectionロジックを共通化
    if category == 'menu':
        menu = MenuInspectionData.objects.filter(menu__id=item_id)
        if menu.exists():
            menu.update(inspected=False, ai=True) # 承認待ち状態に設定
            return True
    elif category == 'shop':
        shop = ShopInspectionData.objects.filter(shop__id=item_id)
        if shop.exists():
            shop.update(inspected=False, ai=True) # 承認待ち状態に設定
            return True
    elif category == 'news':
        news = NewsInspectionData.objects.filter(news__id=item_id)
        if news.exists():
            news.update(inspected=False, ai=True)
            return True
    elif category == 'event':
        event = EventInspectionData.objects.filter(event__id=item_id)
        if event.exists():
            event.update(inspected=False, ai=True)
            return True
    return False

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inspection(request):
  
  if checkPermission(request.user, None, [PERMISSION_ADMIN, PERMISSION_INSPECTION]):
    
    if request.method == 'GET':
      
      news = list(NewsInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('news__title', 'news__detail', 'news__user__username', 'news__organization__name', 'news__id', 'news__updated_at'))
      post = list(PostInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('post__title', 'post__detail', 'post__user__username', 'post__organization__name', 'post__id', 'post__updated_at'))
      shop = list(ShopInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('shop__name', 'shop__detail', 'shop__user__username', 'shop__organization__name', 'shop__id', 'shop__updated_at'))
      menu = list(MenuInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('menu__name', 'menu__shop__name', 'menu__id', 'menu__updated_at'))
      event = list(EventInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('event__title', 'event__detail', 'event__user__username', 'event__organization__name', 'event__id', 'event__updated_at'))
      karaoke = list(KaraokeInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('karaoke__name', 'karaoke__user__username', 'karaoke__organization__name', 'karaoke__id', 'karaoke__updated_at'))
      band = list(BandInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('band__name', 'band__user__username', 'band__organization__name', 'band__id', 'band__updated_at'))
      band_song = list(BandSongInspectionData.objects.filter(ai=True, inspected=False, deleted=False).values('song__name', 'song__band__name', 'song__id'))
      organization_permission = list(OrganizationPermissionInspectionData.objects.filter(inspected=False, deleted=False).values('organization__permission_type', 'organization__organization__name', 'organization__id', 'organization__updated_at'))
      
      count = len(news) + len(post) + len(shop) + len(menu) + len(event) + len(karaoke) + len(band) + len(band_song) + len(organization_permission)
      
      return JsonResponse({'count': count, 'news': news, 'post': post, 'shop': shop, 'menu': menu, 'event': event, 'karaoke': karaoke, 'band': band, 'band_song': band_song, 'organization_permission': organization_permission})
    
    return HttpResponse(status=HTTP_RESPONSE_CODE_METHOD_NOT_ALLOWED)
  else:
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allInspection(request):
    # すべての組織の検査データを取得
    # 注意: ここではPERMISSION_ADMIN権限を持つユーザーのみアクセス可能とする
    if not request.user.is_superuser:
        return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

    news = list(NewsInspectionData.objects.filter(inspected=False, deleted=False).values('news__title', 'news__organization__name', 'news__id', 'news__updated_at', 'ai', 'user__username'))
    post = list(PostInspectionData.objects.filter(inspected=False, deleted=False).values('post__title', 'post__organization__name', 'post__id', 'post__updated_at', 'ai', 'user__username'))
    # Shopを取得し、それぞれのShopに紐づくMenuを結合する
    shops = list(ShopInspectionData.objects.filter(inspected=False, deleted=False).values('shop__name', 'shop__detail', 'shop__organization__name', 'shop__id', 'shop__updated_at', 'ai', 'shop__user__username'))
    for shop in shops:
        shop_id = shop['shop__id']
        menus = list(MenuInspectionData.objects.filter(menu__shop__id=shop_id, inspected=False, deleted=False).values('menu__name', 'menu__id', 'ai'))
        shop['menus'] = menus
    
    # メニュー単体のリストは削除または別の形にする必要があるが、一旦allInspectionの構造を保つためmenusはショップの一部とする
    # そのため、allInspectionの戻り値を変更する必要がある。
    # APIの変更を最小限にするため、今回は既存のショップリストを拡張する形をとる。
    event = list(EventInspectionData.objects.filter(inspected=False, deleted=False).values('event__title', 'event__organization__name', 'event__id', 'event__updated_at', 'ai', 'user__username'))
    karaoke = list(KaraokeInspectionData.objects.filter(inspected=False, deleted=False).values('karaoke__name', 'karaoke__organization__name', 'karaoke__id', 'karaoke__updated_at', 'ai', 'user__username'))
    band = list(BandInspectionData.objects.filter(inspected=False, deleted=False).values('band__name', 'band__organization__name', 'band__id', 'band__updated_at', 'ai', 'user__username'))
    band_song = list(BandSongInspectionData.objects.filter(inspected=False, deleted=False).values('song__name', 'song__band__name', 'song__id', 'ai', 'user__username'))
    
    return JsonResponse({
        'news': news,
        'post': post,
        'shop': shops, # menusを含んだショップリスト
        'event': event,
        'karaoke': karaoke,
        'band': band,
        'band_song': band_song
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def inspect(request, category, item_id):

    if not (request.user.is_superuser or request.user.groups.filter(name=PERMISSION_ADMIN).exists() or request.user.groups.filter(name=PERMISSION_INSPECTION).exists()):
        return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

    if request.method == 'GET':
      if not category in ['news', 'post', 'shop', 'menu', 'event', 'karaoke', 'band', 'band_song', 'organization_permission']:
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      news = list(NewsInspectionData.objects.filter(news__id=item_id).values('news__title', 'news__detail', 'news__user__username', 'news__organization__name', 'news__id', 'news__updated_at')) if category == 'news' else []
      post = list(PostInspectionData.objects.filter(post__id=item_id).values('post__title', 'post__detail', 'post__user__username', 'post__organization__name', 'post__id', 'post__updated_at')) if category == 'post' else []
      shop = list(ShopInspectionData.objects.filter(shop__id=item_id).values('shop__name', 'shop__detail', 'shop__user__username', 'shop__organization__name', 'shop__id', 'shop__updated_at')) if category == 'shop' else []
      menu = list(MenuInspectionData.objects.filter(menu__id=item_id).values('menu__name', 'menu__shop__name', 'menu__id', 'menu__updated_at')) if category == 'menu' else []
      event = list(EventInspectionData.objects.filter(event__id=item_id).values('event__title', 'event__detail', 'event__user__username', 'event__organization__name', 'event__id', 'event__updated_at')) if category == 'event' else []
      karaoke = list(KaraokeInspectionData.objects.filter(karaoke__id=item_id).values('karaoke__name', 'karaoke__user__username', 'karaoke__organization__name', 'karaoke__id', 'karaoke__updated_at')) if category == 'karaoke' else []
      band = list(BandInspectionData.objects.filter(band__id=item_id).values('band__name', 'band__user__username', 'band__organization__name', 'band__id', 'band__updated_at')) if category == 'band' else []
      band_song = list(BandSongInspectionData.objects.filter(song__id=item_id).values('song__name', 'song__band__name', 'song__id')) if category == 'band_song' else []
      organization_permission = list(OrganizationPermissionInspectionData.objects.filter(organization__id=item_id).values('organization__permission_type', 'organization__organization__name', 'organization__id', 'organization__updated_at')) if category == 'organization_permission' else []
      
      count = len(news) + len(post) + len(shop) + len(menu) + len(event) + len(karaoke) + len(band) + len(band_song) + len(organization_permission)
      
      if len(news) != 0:
        image = list(NewsImageData.objects.filter(news__id=item_id).values_list('image__image', flat=True))
      elif len(shop) != 0:
        image = list(ShopImageData.objects.filter(shop__id=item_id).values_list('image__image', flat=True))
      elif len(event) != 0:
        image = list(EventImageData.objects.filter(event__id=item_id).values_list('image__image', flat=True))
      else:
        image = []
      
      return JsonResponse({'count': count, 'news': news, 'post': post, 'shop': shop, 'menu': menu, 'event': event, 'karaoke': karaoke, 'band': band, 'band_song': band_song, 'organization_permission': organization_permission, 'image': image})
    
    elif request.method == 'POST':
      
      data = json.loads(request.body)
      
      inspect_result = data['approve']
      
      if inspect_result:
        send_mail(request.user, '検証結果についてのお知らせ', INSPECTION_APPROVE_MAIL(category, item_id))
      else:
        send_mail(request.user, '検証結果についてのお知らせ', INSPECTION_REJECT_MAIL(category, item_id))
      
      if category == 'news':
        news = NewsInspectionData.objects.filter(news__id=item_id)
        if news.exists():
          if inspect_result:
            send_mail(news.first().news.user, '検証結果についてのお知らせ', INSPECTION_APPROVE_MAIL(category, item_id))
          else:
            send_mail(news.first().news.user, '検証結果についてのお知らせ', INSPECTION_REJECT_MAIL(category, item_id))
          news.update(inspected=inspect_result, user=request.user, deleted=not inspect_result, ai=False)
          return JsonResponse({'message': 'ニュースが検査されました。'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      elif category == 'post':
        post = PostInspectionData.objects.filter(post__id=item_id)
        if post.exists():
          if inspect_result:
            send_mail(post.first().post.user, '検証結果についてのお知らせ', INSPECTION_APPROVE_MAIL(category, item_id))
          else:
            send_mail(post.first().post.user, '検証結果についてのお知らせ', INSPECTION_REJECT_MAIL(category, item_id))
          post.update(inspected=inspect_result, user=request.user, deleted=not inspect_result, ai=False)
          return JsonResponse({'message': '投稿が検査されました。'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      elif category == 'shop':
        shop = ShopInspectionData.objects.filter(shop__id=item_id)
        if shop.exists():
          if inspect_result:
            send_mail(shop.first().shop.user, '検証結果についてのお知らせ', INSPECTION_APPROVE_MAIL(category, item_id))
          else:
            send_mail(shop.first().shop.user, '検証結果についてのお知らせ', INSPECTION_REJECT_MAIL(category, item_id))
          shop.update(inspected=inspect_result, user=request.user, deleted=not inspect_result, ai=False)
          menus = MenuInspectionData.objects.filter(menu__shop__id=item_id, inspected=False, deleted=False)
          menus.update(inspected=inspect_result, user=request.user, deleted=not inspect_result, ai=False)
          return JsonResponse({'message': '店舗と関連メニューが検査されました。'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      elif category == 'menu':
        menu = MenuInspectionData.objects.filter(menu__id=item_id)
        if menu.exists():
          if inspect_result:
            send_mail(menu.first().menu.user, '検証結果についてのお知らせ', INSPECTION_APPROVE_MAIL(category, item_id))
          else:
            send_mail(menu.first().menu.user, '検証結果についてのお知らせ', INSPECTION_REJECT_MAIL(category, item_id))
          menu.update(inspected=inspect_result, user=request.user, deleted=not inspect_result, ai=False)
          return JsonResponse({'message': 'メニューが検査されました。'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      elif category == 'event':
        event = EventInspectionData.objects.filter(event__id=item_id)
        if event.exists():
          if inspect_result:
            send_mail(event.first().event.user, '検証結果についてのお知らせ', INSPECTION_APPROVE_MAIL(category, item_id))
          else:
            send_mail(event.first().event.user, '検証結果についてのお知らせ', INSPECTION_REJECT_MAIL(category, item_id))
          event.update(inspected=inspect_result, user=request.user, deleted=not inspect_result, ai=False)
          return JsonResponse({'message': 'イベントが検査されました。'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      elif category == 'organization_permission':
        organization_permission = OrganizationPermissionInspectionData.objects.filter(organization__id=item_id)
        if organization_permission.exists():
          instance = organization_permission.first()
          try:
              owner = instance.organization.organization.owner
              if inspect_result:
                send_mail(owner, '検証結果についてのお知らせ', INSPECTION_APPROVE_MAIL(category, item_id))
              else:
                send_mail(owner, '検証結果についてのお知らせ', INSPECTION_REJECT_MAIL(category, item_id))
          except Exception as e:
              print(f"Failed to send mail: {e}")
          
          organization_permission.update(inspected=inspect_result, deleted=not inspect_result)
          return JsonResponse({'message': '組織権限が検査されました。'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
    
    return HttpResponse(status=HTTP_RESPONSE_CODE_BAD_REQUEST)
