# `Totally Not Illegal Chat App`

A little chat app I made for my friends. It's not illegal, I swear.

Made this using [dart](https://dart.dev).

## How to use

1. Make sure you have the dark SDK installed.

2. Clone the repo.

3. Rename the `settings.dart.example` file to `settings.dart` and fill in the mongodb connection string.

4. Run `dart run ./lib/chat_app.dart` in the root directory.

5. Go to `http://localhost:8080` in your browser.


## Features

- [x] Send messages over web-sockets
- [x] Admin commands
- [x] Message history auto-wiped every 10 minutes
- [x] Random users generated every page refresh
- [x] Stable and secure