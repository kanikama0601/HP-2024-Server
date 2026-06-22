from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import F, Max
from ..models import *
from ..utils.constant import *
from .permission import *
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def eventBand(request, id, event_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BAND]):
        bands = list(BandData.objects.filter(event_id=event_id).order_by('order').values('id', 'name', 'detail', 'image', 'order', 'performance_time', 'user__username', 'updated_at'))
        for band in bands:
            if band['performance_time'] is not None:
                band['performance_time'] = band['performance_time'].strftime('%H:%M')
            band['songs'] = list(BandSongData.objects.filter(band_id=band['id']).order_by('order').values('id', 'name', 'artist', 'spotify', 'image', 'order'))
        return JsonResponse({'band': bands})
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newBand(request, id, event_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BAND]):
        data = json.loads(request.body)
        organization = OrganizationData.objects.get(id=id)
        event = EventData.objects.get(id=event_id)
        
        # 現在の最大値を取得
        max_order = BandData.objects.filter(event=event).aggregate(Max('order'))['order__max'] or 0
        input_order = data.get('order', max_order + 1)

        # 範囲外の入力を補正
        if input_order > max_order + 1:
            new_order = max_order + 1
        elif input_order < 1:
            new_order = 1
        else:
            new_order = input_order

        # 既存の順番を一つ後ろにずらす
        BandData.objects.filter(event=event, order__gte=new_order).update(order=F('order') + 1)

        band = BandData.objects.create(
            name=data['name'],
            detail=data.get('detail', ''),
            image=data.get('image', ''),
            order=new_order,
            performance_time=data.get('performance_time') or None,
            organization=organization,
            user=request.user,
            event=event
        )
        BandInspectionData.objects.create(band=band, inspected=True, ai=False, deleted=False, user=request.user)
        
        return JsonResponse({'message': 'success', 'band_id': band.id})
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteBand(request, id, event_id, band_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BAND]):
        band_query = BandData.objects.filter(id=band_id, event_id=event_id)
        if band_query.exists():
            band = band_query.first()
            deleted_order = band.order
            event = band.event
            band.delete()
            # 削除された順番以降を一つ前に詰める
            BandData.objects.filter(event=event, order__gt=deleted_order).update(order=F('order') - 1)
            return JsonResponse({'message': 'success'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newBandSong(request, id, event_id, band_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BAND]):
        data = json.loads(request.body)
        band = BandData.objects.get(id=band_id, event_id=event_id)
        
        # 現在の最大値を取得
        max_order = BandSongData.objects.filter(band=band).aggregate(Max('order'))['order__max'] or 0
        input_order = data.get('order', max_order + 1)

        # 範囲外の入力を補正
        if input_order > max_order + 1:
            new_order = max_order + 1
        elif input_order < 1:
            new_order = 1
        else:
            new_order = input_order

        # 既存の順番を一つ後ろにずらす
        BandSongData.objects.filter(band=band, order__gte=new_order).update(order=F('order') + 1)

        song = BandSongData.objects.create(
            name=data['name'],
            artist=data.get('artist', ''),
            band=band,
            spotify=data.get('spotify', ''),
            image=data.get('image', ''),
            order=new_order
        )
        BandSongInspectionData.objects.create(song=song, inspected=True, ai=False, deleted=False, user=request.user)
        
        return JsonResponse({'message': 'success'})
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteBandSong(request, id, event_id, band_id, song_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BAND]):
        song_query = BandSongData.objects.filter(id=song_id, band_id=band_id, band__event_id=event_id)
        if song_query.exists():
            song = song_query.first()
            deleted_order = song.order
            band = song.band
            song.delete()
            # 削除された順番以降を一つ前に詰める
            BandSongData.objects.filter(band=band, order__gt=deleted_order).update(order=F('order') - 1)
            return JsonResponse({'message': 'success'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)
