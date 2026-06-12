#!/bin/bash
set -e

VPS_HOST="85.239.44.14"
VPS_USER="root"
VPS_DIR="/app/medas-platform"
IMAGE_NAME="medas-frontend"
TAR_FILE="/tmp/medas-frontend.tar.gz"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Сборка Docker образа..."
docker build \
  --platform linux/amd64 \
  -t ${IMAGE_NAME}:latest \
  "${PROJECT_DIR}/frontend"

echo "==> Сохранение образа..."
docker save ${IMAGE_NAME}:latest | gzip > "${TAR_FILE}"
echo "    Размер: $(du -sh "${TAR_FILE}" | cut -f1)"

echo "==> Загрузка на VPS..."
scp -i ~/.ssh/server_key -o StrictHostKeyChecking=no \
  "${TAR_FILE}" "${VPS_USER}@${VPS_HOST}:/tmp/medas-frontend.tar.gz"

echo "==> Деплой на VPS..."
ssh -i ~/.ssh/server_key -o StrictHostKeyChecking=no "${VPS_USER}@${VPS_HOST}" bash << 'REMOTE'
set -e
echo "  Загружаю образ..."
docker load < /tmp/medas-frontend.tar.gz
rm -f /tmp/medas-frontend.tar.gz

echo "  Перезапускаю frontend..."
cd /app/medas-platform
docker compose up -d --force-recreate frontend

echo "  Жду запуска (10 сек)..."
sleep 10

CODE=$(curl -s --max-time 5 -o /dev/null -w '%{http_code}' https://saas.med-as.ru/)
echo "  Проверка HTTPS: HTTP $CODE"
if [ "$CODE" = "200" ]; then
  echo "✅ Деплой успешен!"
else
  echo "❌ Проблема: HTTP $CODE"
  docker compose logs --tail=20 frontend
  exit 1
fi
REMOTE

rm -f "${TAR_FILE}"
echo "==> Готово."
