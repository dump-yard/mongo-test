const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost/test-db', {useNewUrlParser: true});

const db = mongoose.connection;

// to get songs from famous artists
app.get('/songs', async (req, res) => {
  const songs = [];

  // get famous artists
  const cur = await db.collection('artist').find({isfamous: true});
  while (await cur.hasNext()) {
    const {firstname, lastname} = await cur.next();

    // get songs based on artist names
    const cur2 = await db.collection('songs')
      .find({artist: `${firstname} ${lastname}`.trim()}, 'title artist album genre');

    while (await cur2.hasNext()) {
      songs.push(await cur2.next());
    }
  }

  res.json(songs);
});

app.post('/comment', bodyParser.json(), async (req, res) => {
  const {username, comment, song} = req.body;
  if (!username || !comment || !song) {
    res.status(400).end(JSON.stringify({error: 'Missing arguments', values: req.body}));
    return;
  }

  try {
    // check if the user actually exists
    const u = await db.collection('users').findOne({username});
    if (!u || !u._id) {
      throw Error('No such user');
    }

    // check if the song actually exists
    const s = await db.collection('songs').findOne({title: song});
    if (!s || !s._id) {
      throw Error('No such song');
    }

    // check if a comment is already given by the user
    const oldComment = await db.collection('comments').findOne({song, username});
    if (oldComment && oldComment._id) {
      throw Error('Comment already exists');
    }

    // everything alright, insert the comment
    try {
      const {result} = await db.collection('comments').insertOne({song, username, comment});
      if (!result.ok) {
        throw Error('Failed to add comment');
      }

      // created
      res.status(201).json({success: true, message: 'Comment added'});
    } catch(e) {
      console.error(e);
      res.status(500).end(JSON.stringify({error: e.message || 'Internal server error', values: req.body}));
    }
  } catch(e) {
    // bad request
    res.status(400).end(JSON.stringify({error: e.message || 'Invalid arguments', values: req.body}));
  }
});

db.on('open', _ => {
  // normally we would open db connection on every request
  app.listen(8080, _ => {
    console.log('Listening on http://localhost:8080');
  });
});
