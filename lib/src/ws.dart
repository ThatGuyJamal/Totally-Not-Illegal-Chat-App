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
        webSocketUsers.add(ws);
        for (var user in webSocketUsers.where((user) => user != ws)) {
          user.send('A new user joined the chat.');
        }
      },
      onClose: (ws) async {
        webSocketUsers.forEach((user) async {
          String userId = mixTwoStrings(user.hashCode.toString(), randomUserId);

          user.send('A user has left.');

          await deleteAllMessagesFromUser(messages, userId);
        });
        // We need to do this last so we can still fetch the messages before deleting the user from the ws cache
        webSocketUsers.remove(ws);
      },
      onMessage: (ws, dynamic data) async {
        webSocketUsers.forEach((user) async {
          // Check if the length of the data is over 1000 characters
          if (isLongerThanAllowedChars(data, 1000)) {
            user.send('Your message cant be over 1000 characters!');
            return;
          }

          // Send the data to the client
          user.send(data);

          String id = mixTwoStrings(user.hashCode.toString(), randomUserId);

          await createMessageForUser(messages, id, data);

          // Handle admin commands

          // Check if the message is a command
          if (isValidAdminCommand(data)) {
            // Get the command from the data string
            String command = getAdminCommand(data);

            // Run the commands if they are valid
            await runCommand(command, messages, id, user);
          }
        });
      },
    );
  });

  await cleanAllMessageHistory(messages);
}
