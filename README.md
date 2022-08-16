# fast-mvp
Quickly test your ideas on market

## Run:
```
docker-compose up -d --build
```

* `localhost:8080/` - vue app.
* `localhost:9229/api/welcome` - nodejs api.

### Lint:
**back**
```
docker-compose exec -it api bash -c "npm run lint"
```

Fix:
```
docker-compose exec -it api bash -c "npm run lint:fix"
```

**front**

Lint process is automatically running if you want use the fix script you can use:
```
docker-compose exec -it app bash -c "./node_modules/.bin/vue-cli-service lint --fix"
```

## Clear docker data:
Docker use a lot of cache to optimize his software and can sometime takes a lot of spaces, it can be good to refresh this cache by deleting all datas docker store in your computer to do this run this two commands:

* `docker  system prune -a` 
* `docker volume rm $(docker volume ls -qf dangling=true)`
