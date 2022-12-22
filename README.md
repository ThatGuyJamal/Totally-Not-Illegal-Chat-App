# `Totally Not Illegal Chat App`

A little chat app I made for my friends. It's not illegal, I swear.

Made this using [dart](https://dart.dev).

## Features

- [x] Send messages over web-sockets
- [x] Admin commands
- [x] Message history auto-wiped every 10 minutes
- [x] Random users generated every page refresh
- [x] Stable and secure

![ExampleOne](./assets/images/tnica_1.png)

![ExampleTwo](./assets/images/tnica_2.png)

## How to build locally

1. Make sure you have the dark SDK installed.

2. Clone the repo.

3. Rename the `settings.dart.example` file to `settings.dart` and fill in the mongodb connection string.
*./lib/config/settings.dart.example*

4. Run `dart run ./lib/chat_app.dart` in the root directory.

5. Go to `http://localhost:8080` in your browser.

## Disclaimer

This application is not meant for production use. It is a proof of concept and should not be used in any way, shape, or form. I am not responsible for any damages caused by this application. Use at your own risk.

I created this application to help me learn the dart programming language and explore different aspects of the language and its ecosystem. If you see any improvements that can be made, please feel free to open a pull request as I created this whole app in my `3rd day` of learning dart.

In the future I would like to make a more robust chat application using the same concepts and ideas. I would most likely use a framework to help handle web-sockets, http requests, and other things. I would also like to add more features such as user accounts, private messages, and more. 

Thanks for checking this project out! Feel free to message me on discord `ThatGuyJamal#2695`.

### TODO

- [ ] Make system reply messages a different color than user messages
- [ ] admin commands locked by a password/token
- [ ] Inject html file into the request and not a html file, this way we can compile the dart code into a binary and not have to worry about having the native html file.
- [ ] User messages will be sent with a userId before the message allowing us to keep track of who sent what message.
    - Because ws can only send strings we would have to encode the userId and message into a string. Example: 
    ```dart
    final id = "some-id-from-the-database";
    final dataFromWs = "some message from the user";
    final encodedData = "$id:$dataFromWs";
    ```

    Then on the client side we would parse this information into a javascript object and use it to display the message inside the html. We could also use this same format to send a timestamp (when the message was created in the db) back to the client.
- [ ] Message timestamps