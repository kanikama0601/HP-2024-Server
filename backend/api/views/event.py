from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models import *
from ..utils.constant import *
from .permission import *
from .inspection import perform_inspection
import datetime, json

# Create your views here.
JST = datetime.timezone(datetime.timedelta(hours=+9), 'JST')

# GET /event
def allEvent(request):
  
  if request.method == 'GET':
    
    now = datetime.datetime.now(JST)
    
    if 'top' in request.GET:

      one_hour_later = now + datetime.timedelta(hours=1)

      # 終了済みを除いた全イベント（開始順）
      not_ended = EventData.objects.filter(
        event_inspection__inspected=True,
        event_inspection__deleted=False,
        end__gt=now,
      ).order_by('start')

      # 開催中 + 1時間以内に開始するイベント
      featured = list(not_ended.filter(start__lte=one_hour_later).values('id', 'title', 'place', 'start', 'end', 'organization__name', 'user__username'))

      # 3件に満たない場合、次に開始するイベントで補う
      if len(featured) < 3:
        featured_ids = [e['id'] for e in featured]
        remaining = list(
          not_ended.exclude(id__in=featured_ids)
          .values('id', 'title', 'place', 'start', 'end', 'organization__name', 'user__username')
          [:3 - len(featured)]
        )
        featured = featured + remaining

      event = featured

    else:

      event = list(EventData.objects.filter(event_inspection__inspected=True, event_inspection__deleted=False).order_by('start').values('id', 'title', 'place', 'start', 'end', 'organization__name', 'user__username'))
    
    return JsonResponse({'event': event, 'now': now})
  
  return HttpResponse(status=HTTP_RESPONSE_CODE_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def oneEvent(request, id):
  
  now = datetime.datetime.now(JST)
  
  if request.method == 'GET':
    
    event_obj = EventData.objects.filter(event_inspection__inspected=True, event_inspection__deleted=False, id=id).first()
    if not event_obj:
      return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
    
    event = list(EventData.objects.filter(id=id).values('id', 'title', 'place', 'detail', 'start', 'end', 'is_karaoke', 'is_band', 'is_brassband', 'organization__name', 'user__username'))
    image = list(EventImageData.objects.filter(event__id=id).values_list('image__image', flat=True))
    
    karaoke = []
    if event_obj.is_karaoke:
      karaoke = list(KaraokeData.objects.filter(event=event_obj, karaoke_inspection__inspected=True).order_by('order').values('id', 'name', 'artist', 'sing_user', 'spotify', 'image', 'order'))
    
    brassband = []
    if event_obj.is_brassband:
      brassband = list(BrassBandData.objects.filter(event=event_obj, brassband_inspection__inspected=True).order_by('order').values('id', 'name', 'artist', 'order', 'performance_time'))
    
    band = []
    if event_obj.is_band:
      bands = BandData.objects.filter(event=event_obj, band_inspection__inspected=True).order_by('order')
      for b in bands:
        b_data = {
          'id': b.id,
          'name': b.name,
          'detail': b.detail,
          'image': b.image,
          'order': b.order,
          'performance_time': b.performance_time.strftime('%H:%M') if b.performance_time else None,
          'songs': list(BandSongData.objects.filter(band=b, song_inspection__inspected=True).order_by('order').values('id', 'name', 'artist', 'spotify', 'image', 'order'))
        }
        band.append(b_data)

    return JsonResponse({'event': event, 'now': now, 'image': image, 'karaoke': karaoke, 'band': band, 'brassband': brassband})
  
  return HttpResponse(status=HTTP_RESPONSE_CODE_METHOD_NOT_ALLOWED)

# GET /organization/[id]/event
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def organizationEvent(request, id):
  
  if request.method == 'GET':
    
    if checkPermission(request.user, id, [PERMISSION_EVENT]):
      
      organization = request.user.organization.filter(id=id)
      
      event = list(EventData.objects.filter(organization=organization.first()).order_by('-updated_at').values('id', 'title', 'user__username', 'event_inspection__ai', 'event_inspection__inspected', 'event_inspection__deleted', 'created_at', 'updated_at'))
    
    return JsonResponse({'event': event})
  
  return HttpResponse(status=HTTP_RESPONSE_CODE_METHOD_NOT_ALLOWED)

# POST /organization/[id]/event/new
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newEvent(request, id):
  
  if request.method == 'POST':
    
    data = json.loads(request.body)
    image_urls = data.get('imageUrls', [])
    print(data)
    
    if checkPermission(request.user, id, [PERMISSION_EVENT]):
      
      if 'title' in data and 'detail' in data and 'place' in data and 'start' in data and 'end' in data:
        
        organization = request.user.organization.filter(id=id)
        
        event = EventData.objects.create(organization=organization.first(), user=request.user, title=data['title'], detail=data['detail'], place=data['place'], start=datetime.datetime.strptime(data['start'] + ':00', '%Y-%m-%dT%H:%M:%S').replace(tzinfo=JST), end=datetime.datetime.strptime(data['end'] + ':00', '%Y-%m-%dT%H:%M:%S').replace(tzinfo=JST), is_karaoke=data.get('is_karaoke', False), is_band=data.get('is_band', False), is_brassband=data.get('is_brassband', False))
        
        EventInspectionData.objects.create(event=event)
        
        for image in image_urls:
          if image != '':
            if EventImageData.objects.filter(event=event, image__image=image).exists() == False:
              image_data = ImageData.objects.filter(image=image)
              EventImageData.objects.create(event=event, image=image_data.first())
        
        perform_inspection('event', event.id)
        
        return JsonResponse({'event': 'event'})
    
    return HttpResponse(status=HTTP_RESPONSE_CODE_BAD_REQUEST)

# GET/POST /organization/[id]/event/[id]
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def oneOrganizationEvent(request, id, event_id):
  
  if request.method == 'GET':
    
    if checkPermission(request.user, id, [PERMISSION_EVENT]):
      
      organization = request.user.organization.filter(id=id)
      
      event = list(EventData.objects.filter(organization=organization.first(), id=event_id).values('id', 'title', 'place', 'detail', 'start', 'end', 'is_karaoke', 'is_band', 'is_brassband', 'organization__name', 'user__username', 'created_at', 'updated_at'))
      image = list(EventImageData.objects.filter(event__id=event_id).values_list('image__image', flat=True))
      
      if len(event) == 0:
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      return JsonResponse({'event': event, 'image': image})
    
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)
  
  elif request.method == 'POST':
    
    data = json.loads(request.body)
    image_urls = data.get('imageUrls', [])
    
    if checkPermission(request.user, id, [PERMISSION_EVENT]):
      
      organization = request.user.organization.filter(id=id)
      
      event = EventData.objects.filter(organization=organization.first(), id=event_id)
      
      if event.exists() == False:
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      else:
        event = event.first()
        
        event.title=data['title']
        event.detail=data['detail']
        event.place=data['place']
        event.start=datetime.datetime.strptime(data['start'] + ':00', '%Y-%m-%dT%H:%M:%S').replace(tzinfo=JST)
        event.end=datetime.datetime.strptime(data['end'] + ':00', '%Y-%m-%dT%H:%M:%S').replace(tzinfo=JST)
        event.is_karaoke=data.get('is_karaoke', False)
        event.is_band=data.get('is_band', False)
        event.is_brassband=data.get('is_brassband', False)
        
        if event.start > event.end:
          return HttpResponse(status=HTTP_RESPONSE_CODE_BAD_REQUEST)
        else:
          event.save()
        
        EventInspectionData.objects.filter(event=event).update(inspected=False, deleted=False, ai=False)
        
        before_images = list(EventImageData.objects.filter(event=event).values_list('image__image', flat=True))
        for image in image_urls:
          if image != '':
            if image in before_images:
              before_images.remove(image)
            if EventImageData.objects.filter(event=event, image__image=image).exists() == False:
              image_data = ImageData.objects.filter(image=image)
              EventImageData.objects.create(event=event, image=image_data.first())
        
        for before_image in before_images:
          EventImageData.objects.filter(event=event, image__image=before_image).delete()
        
        perform_inspection('event', event_id)
      
      return JsonResponse({'event': 'success'})
    
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

# POST /organization/[id]/event/[id]/delete
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteOrganizationEvent(request, id, event_id):
  
  if request.method == 'POST':
    
    if checkPermission(request.user, id, [PERMISSION_EVENT]):
      
      organization = request.user.organization.filter(id=id)
      
      event = EventData.objects.filter(organization=organization.first(), id=event_id)
      
      if event.exists() == False:
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
      
      else:
        event = event.first()
        
        event.delete()
      
      return JsonResponse({'event': 'success'})
    
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)
