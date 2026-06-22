import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_shopdata_image'),
    ]

    operations = [
        # EventData に軽音楽フラグを追加
        migrations.AddField(
            model_name='eventdata',
            name='is_band',
            field=models.BooleanField(default=False),
        ),
        # BandData にイベント紐付け・順番・演奏開始時刻を追加
        migrations.AddField(
            model_name='banddata',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='bands', to='api.eventdata'),
        ),
        migrations.AddField(
            model_name='banddata',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='banddata',
            name='performance_time',
            field=models.TimeField(blank=True, null=True),
        ),
        # BandSongData に順番・アーティスト名を追加
        migrations.AddField(
            model_name='bandsongdata',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='bandsongdata',
            name='artist',
            field=models.CharField(blank=True, max_length=100),
        ),
        # BandInspectionData・BandSongInspectionData の user を nullable に変更
        migrations.AlterField(
            model_name='bandinspectiondata',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='band_inspections', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='bandsonginspectiondata',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='song_inspections', to=settings.AUTH_USER_MODEL),
        ),
    ]
