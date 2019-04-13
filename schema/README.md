## db-structure
```
test-db [db]
 |- artist
 |- songs
 |- comments
 |- users
```

## import
``` bash
$ mongoimport --db test-db \
  --collection artist --file test-db.artist.json

$ mongoimport --db test-db \
  --collection songs --file test-db.songs.json

$ mongoimport --db test-db \
  --collection comments --file test-db.comments.json

$ mongoimport --db test-db \
  --collection users --file test-db.users.json
```
