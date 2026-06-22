import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_band'),
    ]

    operations = [
        # EventData にカラオケフラグを追加
        migrations.AddField(
            model_name='eventdata',
            name='is_karaoke',
            field=models.BooleanField(default=False),
        ),
        # KaraokeData にイベント紐付け・順番・アーティスト名を追加
        migrations.AddField(
            model_name='karaokedata',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='karaokes', to='api.eventdata'),
        ),
        migrations.AddField(
            model_name='karaokedata',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='karaokedata',
            name='artist',
            field=models.CharField(blank=True, max_length=100),
        ),
        # KaraokeInspectionData の user を nullable に変更
        migrations.AlterField(
            model_name='karaokeinspectiondata',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='karaoke_inspections', to=settings.AUTH_USER_MODEL),
        ),
    ]
