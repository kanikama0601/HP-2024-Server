import boto3, os
from .constant import *

def subject_template(text):
  if text == '':
    return f'電波祭実行委員会'
  return f'{text}【電波祭実行委員会】'

def body_template(user, text):
  return f'''
{user.username} 様

{text}

※このメールはシステムからの自動送信です。返信はお受けできませんのでご注意ください。

---------------------------------
電波祭実行委員会
香川高等専門学校 詫間キャンパス
〒769-1192 香川県三豊市詫間町香田551
takumadenpasai@gmail.com
https://denpafest.com
---------------------------------
'''

def send_mail(request, subject, message):
  # AWS環境ではないため送信機能を無効化
  return None
