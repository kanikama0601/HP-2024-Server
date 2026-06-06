from django.http import JsonResponse, HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from ..serializers import *
from ..models import *
from ..utils.constant import *
import requests, random, string, os

# Create your views here.

def healthcheck(request):
  
  return JsonResponse({'health': 'ok'})

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]  # 誰でもアクセス可能

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'ユーザーが正常に作成されました。'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # 追加のクレームを含める場合はここで設定
        token['username'] = user.username
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def saveImage(request):
    
    if request.method == 'POST':
        
        image = request.FILES.get('file')
        if not image:
            return JsonResponse({'error': 'No file provided'}, status=HTTP_RESPONSE_CODE_BAD_REQUEST)
        
        try:
            # Send file to Flask storage server
            storage_url = os.environ.get('STORAGE_SERVER_URL', 'http://storage:5000')
            files = {'file': (image.name, image.read(), image.content_type)}
            response = requests.post(f"{storage_url}/upload", files=files)
            
            if response.status_code != 201:
                return JsonResponse({'error': 'Failed to upload to storage server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            filename = response.json()['filename']
            # Store full URL in the database
            image_url = f"{request.build_absolute_uri('/image/')}{filename}"
            ImageData.objects.create(image=image_url)
            
            return JsonResponse({'image': image_url})
        
        except Exception as e:
            print(f"DEBUG: Error in saveImage: {e}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=HTTP_RESPONSE_CODE_BAD_REQUEST)
    
    return JsonResponse({'error': 'Method Not Allowed'}, status=HTTP_RESPONSE_CODE_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([AllowAny])
def getImage(request, filename):
    try:
        storage_url = os.environ.get('STORAGE_SERVER_URL', 'http://storage:5000')
        print(f"DEBUG: Fetching from {storage_url}/uploads/{filename}")
        response = requests.get(f"{storage_url}/uploads/{filename}", stream=True)
        
        if response.status_code != 200:
            print(f"DEBUG: Failed to fetch {filename}. Status: {response.status_code}")
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)
            
        return HttpResponse(response.content, content_type=response.headers['Content-Type'])
    except Exception as e:
        print(f"DEBUG: Error in getImage: {e}")
        return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
