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
def eventKaraoke(request, id, event_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_KARAOKE]):
        karaokes = list(KaraokeData.objects.filter(event_id=event_id).order_by('order').values('id', 'name', 'artist', 'sing_user', 'spotify', 'image', 'order', 'user__username', 'updated_at'))
        return JsonResponse({'karaoke': karaokes})
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newKaraoke(request, id, event_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_KARAOKE]):
        data = json.loads(request.body)
        organization = OrganizationData.objects.get(id=id)
        event = EventData.objects.get(id=event_id)
        
        # 現在の最大値を取得
        max_order = KaraokeData.objects.filter(event=event).aggregate(Max('order'))['order__max'] or 0
        
        input_order = data.get('order', max_order + 1)
        
        # 範囲外の入力を補正
        if input_order > max_order + 1:
            new_order = max_order + 1
        elif input_order < 1:
            new_order = 1
        else:
            new_order = input_order

        # 既存の順番を一つ後ろにずらす
        KaraokeData.objects.filter(event=event, order__gte=new_order).update(order=F('order') + 1)

        karaoke = KaraokeData.objects.create(
            name=data['name'],
            artist=data.get('artist', ''),
            sing_user=data['sing_user'],
            spotify=data.get('spotify', ''),
            image=data.get('image', ''),
            order=new_order,
            organization=organization,
            user=request.user,
            event=event
        )
        # 楽曲情報の編集に関しては管理者への申請は不要
        KaraokeInspectionData.objects.create(karaoke=karaoke, inspected=True, ai=False, deleted=False, user=request.user)
        
        return JsonResponse({'message': 'success'})
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteKaraoke(request, id, event_id, karaoke_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_KARAOKE]):
        karaoke_query = KaraokeData.objects.filter(id=karaoke_id, event_id=event_id)
        if karaoke_query.exists():
            karaoke = karaoke_query.first()
            deleted_order = karaoke.order
            event = karaoke.event
            karaoke.delete()
            # 削除された順番以降を一つ前に詰める
            KaraokeData.objects.filter(event=event, order__gt=deleted_order).update(order=F('order') - 1)
            return JsonResponse({'message': 'success'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)
