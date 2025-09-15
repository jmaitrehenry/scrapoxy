export AUTH_LOCAL_USERNAME=admin
export AUTH_LOCAL_PASSWORD=password
export BACKEND_JWT_SECRET=secret1
export FRONTEND_JWT_SECRET=secret2
export TRACK_SOCKETS=true
export STORAGE_DISTRIBUTED_MONGO_URI=mongodb://root:password@localhost:27017
export STORAGE_DISTRIBUTED_MONGO_DB=scrapoxy
export STORAGE_DISTRIBUTED_RABBITMQ_URI=amqp://scrapoxy:password@localhost:5672
export STORAGE_DISTRIBUTED_RABBITMQ_QUEUE_ORDERS=scrapoxyorders
export STORAGE_DISTRIBUTED_RABBITMQ_QUEUE_EVENTS=scrapoxyevents
export NODE_ENV=production
node dist/scrapoxy/scrapoxy.js --storage distributed --commander --frontend --refresh-all
#node --tls-keylog=file dist/scrapoxy/scrapoxy.js --storage distributed --master


