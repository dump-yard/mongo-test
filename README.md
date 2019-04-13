## test
### starting
``` bash
$ npm i && npm start
```

### querying songs by popular artists
``` bash
$ curl "http://localhost:8080/songs"
```

### inserting comments
``` bash
$ curl "http://localhost:8080/comment" \
    -H "content-type: application/json" \
    --data-binary "{\"username\":\"jDoe\",\"song\":\"All we know\",\"comment\":\"Best song ever!\"}"
```

### db schema
[schema/](schema/)
