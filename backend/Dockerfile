FROM python:3.12

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_DEBUG=True

COPY . .

RUN apt-get update && apt-get install -y postgresql-client
RUN pip install -r requirements.txt

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]

EXPOSE 8000
