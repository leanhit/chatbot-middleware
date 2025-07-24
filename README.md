chạy develop: npm run dev
chạy trong tực tế: pm2 start ecosystem.config.js
tắt: pm2 stop all
restart: pm2 restart all



//for chatwoot UI
build & deploy: NODE_OPTIONS=--openssl-legacy-provider yarn build:deploy


docker-compose down --volumes --remove-orphans
 docker-compose build --no-cache
 docker-compose up -d

sudo nginx -t && sudo systemctl reload nginx
