// This stops the for loop of our websocket users from crashing in runtime if lots of data is trying to be
// accessed at once. Example: Lots of page refreshes, will call the forEach function.
// But this function only reads data over the iterable, and does not modify it.

// ignore_for_file: avoid_function_literals_in_foreach_calls

import 'dart:async';
import 'dart:io';

import 'package:alfred/alfred.dart';
import 'package:mongo_dart/mongo_dart.dart';
// ignore: implementation_imports
import 'package:alfred/src/type_handlers/websocket_type_handler.dart';

import 'admin/admin.dart';
import 'config/settings.dart';
import 'utils/crud.dart';
import 'utils/utils.dart';

// Track connected clients
List<WebSocket> webSocketUsers = [];

/// Manages the websocket server and chat relay's
Future<void> serveWebSocket(Alfred app) async {
  // Database
  final Db db = await Db.create(settings['mongodb_url']!);

  // Connect to the database
  await db
      .open()
      .then((value) => print("Connected to database"))
      .catchError((error) => print("Error connecting to database: $error"));

  // Get the collection
  final messages =
      db.collection(settings['mongodb_db_collection'] ?? 'messages');

  // Create a random string for the userHashId
  String randomUserId = generateId().toString();

  // WebSocket chat relay implementation
  app.get('/ws', (req, res) {
    return WebSocketSession(
      onOpen: (ws) {
        for (var ws in webSocketUsers.where((user) => user != ws)) {
          ws.send('Welcome to the chat!');
        }
        webSocketUsers.add(ws);
      },
      onClose: (ws) async {
        webSocketUsers.forEach((ws) async {
          String userId = mixTwoStrings(ws.hashCode.toString(), randomUserId);

          ws.send('A user has left.');

          await deleteAllMessagesFromUser(messages, userId);
        });
        // We need to do this last so we can still fetch the messages before deleting the user from the ws cache
        webSocketUsers.remove(ws);
      },
      onMessage: (ws, dynamic data) async {
        webSocketUsers.forEach((ws) async {
          // Check if the length of the data is over 1000 characters
          if (isLongerThanAllowedChars(data, 1000)) {
            ws.send('Your message cant be over 1000 characters!');
            return;
          }

          // Send the data to the client
          ws.send(data);

          String id = mixTwoStrings(ws.hashCode.toString(), randomUserId);

          await createMessageForUser(messages, id, data);

          // Handle admin commands

          // Check if the message is a command
          if (isValidAdminCommand(data)) {
            // Get the command from the data string
            String command = getAdminCommand(data);

            // Run the commands if they are valid
            await runCommand(command, messages, id, ws);
          }
        });
      },
    );
  });

  await cleanAllMessageHistory(messages);
}
