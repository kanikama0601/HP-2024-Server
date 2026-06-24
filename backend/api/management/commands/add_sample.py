from django.core.management.base import BaseCommand
import datetime
import os
import requests

JST = datetime.timezone(datetime.timedelta(hours=9), 'JST')

SAMPLE_IMAGES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'sampledata')


def jst(year, month, day, hour=0, minute=0):
    return datetime.datetime(year, month, day, hour, minute, tzinfo=JST)


def upload_image(filename):
    path = os.path.join(SAMPLE_IMAGES_DIR, filename)
    if not os.path.exists(path):
        return None
    storage_url = os.environ.get('STORAGE_SERVER_URL', 'http://storage:5000')
    with open(path, 'rb') as f:
        resp = requests.post(f'{storage_url}/upload', files={'file': (filename, f, 'image/png')})
    if resp.status_code != 201:
        return None
    uuid_filename = resp.json()['filename']
    backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')
    return f'{backend_url}/image/{uuid_filename}'


SAMPLE_USERS = [
    {'username': 'sample_tin',      'email': 'sample_tin@sample.com',      'password': 'sample_tin'},
    {'username': 'sample_keizo',    'email': 'sample_keizo@sample.com',    'password': 'sample_keizo'},
    {'username': 'sample_denpasai', 'email': 'sample_denpasai@sample.com', 'password': 'sample_denpasai'},
    {'username': 'sample_karaoke',  'email': 'sample_karaoke@sample.com',  'password': 'sample_karaoke'},
    {'username': 'sample_band',     'email': 'sample_band@sample.com',     'password': 'sample_band'},
    {'username': 'sample_brass',    'email': 'sample_brass@sample.com',    'password': 'sample_brass'},
]

SAMPLE_ORGS = [
    {
        'name': 'ティン研究室',
        'owner': 'sample_tin',
        'org_permissions': ['shop', 'event'],
        'members': [
            {'username': 'sample_tin', 'permissions': ['shop', 'event', 'invite_user']},
        ],
    },
    {
        'name': '金澤研究室',
        'owner': 'sample_keizo',
        'org_permissions': ['shop', 'event'],
        'members': [
            {'username': 'sample_keizo', 'permissions': ['shop', 'event', 'invite_user']},
        ],
    },
    {
        'name': '電波祭実行委員会',
        'owner': 'sample_denpasai',
        'org_permissions': ['news', 'shop', 'event', 'karaoke'],
        'members': [
            {'username': 'sample_denpasai', 'permissions': ['news', 'shop', 'event', 'invite_user']},
            {'username': 'sample_karaoke',  'permissions': ['news', 'shop', 'event', 'karaoke']},
        ],
    },
    {
        'name': '軽音楽',
        'owner': 'sample_band',
        'org_permissions': ['shop', 'event', 'band'],
        'members': [
            {'username': 'sample_band', 'permissions': ['shop', 'event', 'band', 'invite_user']},
        ],
    },
    {
        'name': '吹奏楽',
        'owner': 'sample_brass',
        'org_permissions': ['shop', 'event', 'brassband'],
        'members': [
            {'username': 'sample_brass', 'permissions': ['shop', 'event', 'invite_user']},
        ],
    },
]

SAMPLE_SHOPS = [
    {
        'org': 'ティン研究室',
        'user': 'sample_tin',
        'photo': 'yaesan.png',
        'name': '八重バーガー III 〜そして伝説へ〜',
        'address': '大通り10番テント',
        'detail': (
            '八重シェフが送る、八重バーガー。\n'
            '数々な困難を乗り越え、数多の人々を虜としてきた一品が待望の復活を遂げる。\n'
            '今年は八重SAMURAIを追加し、更に味に磨きをかけてきた。\n'
            '食の覇者 八重は、電波祭の伝説となるのか。今、その物語が再び幕を開ける。'
        ),
        'menus': [
            {'name': '八重バーガー',          'price': 300},
            {'name': '八重チーズバーガー',    'price': 400},
            {'name': 'スパイシー八重',        'price': 500},
            {'name': 'スパイシーチーズ八重',  'price': 600},
            {'name': '八重SAMURAI',           'price': 500},
            {'name': '八重チーズSAMURAI',     'price': 600},
        ],
    },
    {
        'org': '金澤研究室',
        'user': 'sample_keizo',
        'photo': 'keizo.png',
        'name': 'KE1Z0 Presents - Let\'s study C language!',
        'address': 'A204',
        'detail': (
            '主婦必見！金澤啓三のスペシャル講座！\n'
            'なかなか手を出しにくいC言語、最初の一歩は啓三におまかせ！\n'
            'まずはDirectXを題材に楽しく学びましょう！'
        ),
        'menus': [],
    },
    {
        'org': '電波祭実行委員会',
        'user': 'sample_denpasai',
        'name': '飲料販売',
        'address': 'マルチメディア棟前',
        'detail': (
            '喉、乾きますよね。自販機、売り切れますよね。\n'
            '私達、電波祭実行委員会におまかせください！\n'
            '水漏れ・ガス漏れ何でもお任せ！'
        ),
        'menus': [
            {'name': '水',        'price': 150},
            {'name': 'その他飲料', 'price': 200},
        ],
    },
]

SAMPLE_EVENTS = [
    {
        'org': '軽音楽',
        'user': 'sample_band',
        'title': '軽音ライブ',
        'place': '第2体育館',
        'detail': (
            '今年も軽音楽部がやってきた！様々な曲を演奏します！\n'
            '演奏曲は下をチェック\n'
            '今年も見逃すな！'
        ),
        'start': jst(2026, 10, 31, 10, 0),
        'end':   jst(2026, 10, 31, 12, 0),
        'is_band': True,
        'is_karaoke': False,
        'is_brassband': False,
        'bands': [
            {
                'name': 'sample1',
                'detail': '',
                'performance_time': datetime.time(10, 0),
                'songs': [
                    {'name': 'インフェルノ',    'artist': 'Mrs. GREEN APPLE'},
                    {'name': 'HANABI',          'artist': 'Mr. Children'},
                ],
            },
            {
                'name': 'sample2',
                'detail': '',
                'performance_time': datetime.time(10, 30),
                'songs': [
                    {'name': 'Burning',         'artist': '羊文学'},
                    {'name': 'more than words', 'artist': '羊文学'},
                ],
            },
            {
                'name': 'sample3',
                'detail': '',
                'performance_time': datetime.time(11, 0),
                'songs': [
                    {'name': '本能',                    'artist': '椎名林檎'},
                    {'name': '幕ノ内サディスティック',  'artist': '椎名林檎'},
                ],
            },
        ],
    },
    {
        'org': '電波祭実行委員会',
        'user': 'sample_karaoke',
        'title': 'カラオケ大会',
        'place': '第2体育館',
        'detail': (
            '今年もカラオケ大会がやってきた！\n'
            '演奏曲は下をチェック\n'
            '今年も見逃すな！'
        ),
        'start': jst(2026, 10, 31, 18, 0),
        'end':   jst(2026, 10, 31, 20, 0),
        'is_band': False,
        'is_karaoke': True,
        'is_brassband': False,
        'karaokes': [
            {'name': 'ばかみたい',   'artist': '桐生一馬',   'sing_user': '金澤啓三'},
            {'name': 'Shape Of You', 'artist': 'Ed Sheeran', 'sing_user': '宮﨑貴大'},
            {'name': 'Payphone',     'artist': 'Maroon 5',   'sing_user': '奥山真吾'},
            {'name': '新時代',       'artist': 'Ado',         'sing_user': '河田純'},
        ],
    },
    {
        'org': '吹奏楽',
        'user': 'sample_brass',
        'title': '吹奏楽ライブ',
        'place': '第1体育館',
        'detail': (
            '今年も吹奏楽部がやってきた！\n'
            '演奏曲は下をチェック\n'
            '今年も見逃すな！'
        ),
        'start': jst(2026, 11, 1, 10, 0),
        'end':   jst(2026, 11, 1, 12, 0),
        'is_band': False,
        'is_karaoke': False,
        'is_brassband': True,
        'brassbands': [
            {'name': '好きすぎて滅！',  'artist': 'M!LK',     'performance_time': datetime.time(10, 0)},
            {'name': '群青',            'artist': 'YOASOBI',  'performance_time': datetime.time(10, 30)},
            {'name': '銀河鉄道999',     'artist': 'ゴダイゴ',  'performance_time': datetime.time(11, 0)},
            {'name': 'OMENS OF LOVE',   'artist': 'T-SQUARE', 'performance_time': datetime.time(11, 30)},
        ],
    },
]


class Command(BaseCommand):
    help = 'Insert sample data based on sampledata/sample_user.md'

    def handle(self, *args, **options):
        from api.models import (
            UserData, OrganizationData, OrganizationPermissionData,
            OrganizationPermissionInspectionData, PermissionData,
            ShopData, ShopInspectionData, MenuData, MenuInspectionData,
            EventData, EventInspectionData,
            BandData, BandSongData, KaraokeData, BrassBandData,
            ImageData, ShopImageData,
        )

        self.stdout.write('=== サンプルデータ挿入開始 ===')

        # ── ユーザー作成 ──────────────────────────────────────
        users = {}
        for u in SAMPLE_USERS:
            obj, created = UserData.objects.get_or_create(
                username=u['username'],
                defaults={'email': u['email']},
            )
            if created:
                obj.set_password(u['password'])
                obj.save()
                self.stdout.write(f'  [作成] ユーザー: {u["username"]}')
            else:
                self.stdout.write(f'  [スキップ] ユーザー既存: {u["username"]}')
            users[u['username']] = obj

        # ── 組織・権限作成 ────────────────────────────────────
        orgs = {}
        for org_data in SAMPLE_ORGS:
            owner = users[org_data['owner']]
            org, created = OrganizationData.objects.get_or_create(
                name=org_data['name'],
                defaults={'owner': owner},
            )
            if created:
                self.stdout.write(f'  [作成] 組織: {org_data["name"]}')
            else:
                self.stdout.write(f'  [スキップ] 組織既存: {org_data["name"]}')
            orgs[org_data['name']] = org

            # 組織権限
            for perm_type in org_data['org_permissions']:
                op, op_created = OrganizationPermissionData.objects.get_or_create(
                    organization=org,
                    permission_type=perm_type,
                )
                opi, opi_created = OrganizationPermissionInspectionData.objects.get_or_create(
                    organization=op,
                    defaults={'inspected': True, 'deleted': False},
                )
                if not opi_created and not opi.inspected:
                    opi.inspected = True
                    opi.deleted = False
                    opi.save()

            # メンバーとユーザー権限
            for member_data in org_data['members']:
                member = users[member_data['username']]
                if not member.organization.filter(id=org.id).exists():
                    member.organization.add(org)
                for perm_type in member_data['permissions']:
                    PermissionData.objects.get_or_create(
                        user=member,
                        organization=org,
                        permission_type=perm_type,
                    )


        # ── 模擬店作成 ────────────────────────────────────────
        for shop_data in SAMPLE_SHOPS:
            org  = orgs[shop_data['org']]
            user = users[shop_data['user']]

            if ShopData.objects.filter(name=shop_data['name'], organization=org).exists():
                self.stdout.write(f'  [スキップ] 模擬店既存: {shop_data["name"]}')
                continue

            shop = ShopData.objects.create(
                name=shop_data['name'],
                address=shop_data['address'],
                detail=shop_data['detail'],
                organization=org,
                user=user,
            )
            # frontendと同様: inspection作成 → ai=True(審査待ち) → 承認
            ShopInspectionData.objects.create(shop=shop, ai=True, inspected=True, deleted=False)

            photo_filename = shop_data.get('photo')
            if photo_filename:
                image_url = upload_image(photo_filename)
                if image_url:
                    image_data = ImageData.objects.create(image=image_url)
                    shop_image = ShopImageData.objects.create(shop=shop, image=image_data)
                    shop.image = shop_image
                    shop.save()

            for menu_data in shop_data['menus']:
                menu = MenuData.objects.create(
                    name=menu_data['name'],
                    price=menu_data['price'],
                    shop=shop,
                    user=user,
                )
                MenuInspectionData.objects.create(menu=menu, ai=True, inspected=True, deleted=False)

            self.stdout.write(f'  [作成] 模擬店: {shop_data["name"]}')

        # ── イベント作成 ──────────────────────────────────────
        for event_data in SAMPLE_EVENTS:
            org  = orgs[event_data['org']]
            user = users[event_data['user']]

            if EventData.objects.filter(title=event_data['title'], organization=org).exists():
                self.stdout.write(f'  [スキップ] イベント既存: {event_data["title"]}')
                continue

            event = EventData.objects.create(
                title=event_data['title'],
                place=event_data['place'],
                detail=event_data['detail'],
                start=event_data['start'],
                end=event_data['end'],
                is_band=event_data['is_band'],
                is_karaoke=event_data['is_karaoke'],
                is_brassband=event_data['is_brassband'],
                organization=org,
                user=user,
            )
            # frontendと同様: inspection作成 → ai=True(審査待ち) → 承認
            EventInspectionData.objects.create(event=event, ai=True, inspected=True, deleted=False)

            # バンド
            for i, band_data in enumerate(event_data.get('bands', []), start=1):
                band = BandData.objects.create(
                    name=band_data['name'],
                    detail=band_data['detail'],
                    performance_time=band_data['performance_time'],
                    order=i,
                    organization=org,
                    user=user,
                    event=event,
                )
                for j, song_data in enumerate(band_data['songs'], start=1):
                    BandSongData.objects.create(
                        name=song_data['name'],
                        artist=song_data['artist'],
                        band=band,
                        order=j,
                    )

            # カラオケ
            for i, karaoke_data in enumerate(event_data.get('karaokes', []), start=1):
                KaraokeData.objects.create(
                    name=karaoke_data['name'],
                    artist=karaoke_data['artist'],
                    sing_user=karaoke_data['sing_user'],
                    order=i,
                    organization=org,
                    user=user,
                    event=event,
                )

            # 吹奏楽
            for i, bb_data in enumerate(event_data.get('brassbands', []), start=1):
                BrassBandData.objects.create(
                    name=bb_data['name'],
                    artist=bb_data['artist'],
                    performance_time=bb_data['performance_time'],
                    order=i,
                    organization=org,
                    user=user,
                    event=event,
                )

            self.stdout.write(f'  [作成] イベント: {event_data["title"]}')

        self.stdout.write('=== サンプルデータ挿入完了 ===')
