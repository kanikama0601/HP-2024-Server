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
def eventBrassBand(request, id, event_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BRASSBAND]):
        brassbands = list(BrassBandData.objects.filter(event_id=event_id).order_by('order').values('id', 'name', 'artist', 'order', 'performance_time', 'user__username', 'updated_at'))
        return JsonResponse({'brassband': brassbands})
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newBrassBand(request, id, event_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BRASSBAND]):
        data = json.loads(request.body)
        organization = OrganizationData.objects.get(id=id)
        event = EventData.objects.get(id=event_id)
        
        # 現在の最大値を取得
        max_order = BrassBandData.objects.filter(event=event).aggregate(Max('order'))['order__max'] or 0
        
        input_order = data.get('order', max_order + 1)
        
        # 範囲外の入力を補正
        if input_order > max_order + 1:
            new_order = max_order + 1
        elif input_order < 1:
            new_order = 1
        else:
            new_order = input_order

        # 既存の順番を一つ後ろにずらす
        BrassBandData.objects.filter(event=event, order__gte=new_order).update(order=F('order') + 1)

        brassband = BrassBandData.objects.create(
            name=data['name'],
            artist=data['artist'],
            order=new_order,
            performance_time=data.get('performance_time') or None,
            event=event,
            organization=organization,
            user=request.user
        )
        # 楽曲情報の編集に関しては管理者への申請は不要
        BrassBandInspectionData.objects.create(brassband=brassband, inspected=True, ai=False, deleted=False, user=request.user)
        
        return JsonResponse({'message': 'success'})
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteBrassBand(request, id, event_id, brassband_id):
    if checkPermission(request.user, id, [PERMISSION_EVENT, PERMISSION_BRASSBAND]):
        brassband_query = BrassBandData.objects.filter(id=brassband_id, event_id=event_id)
        if brassband_query.exists():
            brassband = brassband_query.first()
            deleted_order = brassband.order
            event = brassband.event
            brassband.delete()
            # 削除された順番以降を一つ前に詰める
            BrassBandData.objects.filter(event=event, order__gt=deleted_order).update(order=F('order') - 1)
            return JsonResponse({'message': 'success'})
        return HttpResponse(status=HTTP_RESPONSE_CODE_NOT_FOUND)
    return HttpResponse(status=HTTP_RESPONSE_CODE_FORBIDDEN)
