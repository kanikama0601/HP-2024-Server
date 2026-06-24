import django.db.models.deletion
from django.db import migrations, models
from django.conf import settings

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_karaoke_event'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventdata',
            name='is_brassband',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='BrassBandData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('artist', models.CharField(max_length=100)),
                ('order', models.IntegerField(default=0)),
                ('performance_time', models.TimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='brassbands', to='api.eventdata')),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='brassbands', to='api.organizationdata')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='brassbands', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='organizationpermissiondata',
            name='permission_type',
            field=models.CharField(choices=[('shop', 'shop'), ('news', 'news'), ('menu', 'menu'), ('event', 'event'), ('band', 'band'), ('karaoke', 'karaoke'), ('brassband', 'brassband'), ('inspection', 'inspection')], max_length=20),
        ),
        migrations.AlterField(
            model_name='permissiondata',
            name='permission_type',
            field=models.CharField(choices=[('admin', 'admin'), ('shop', 'shop'), ('news', 'news'), ('menu', 'menu'), ('event', 'event'), ('band', 'band'), ('karaoke', 'karaoke'), ('brassband', 'brassband'), ('invite_user', 'invite_user'), ('inspection', 'inspection')], max_length=20),
        ),
    ]
