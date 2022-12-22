import 'dart:io';

import 'package:chat_app/src/utils/utils.dart';
import 'package:mongo_dart/mongo_dart.dart';
// ignore: implementation_imports
import 'package:alfred/src/type_handlers/websocket_type_handler.dart';

import '../ws.dart';

/// A list of admin commands
final List<String> adminCommands = [
  "help", // Shows all the commands
  "tmu", // Total messages from this user
  "tau", // Total users in chat
  "gh", // A link to the github repo
  "up" // Uptime of the server
];

String adminCommandPrefix = 'admin::';
String adminCommandSuffix = '::';

/// Checks if the command is valid before running it.
bool isValidAdminCommand(String command) {
  String adminCommandPrefix = 'admin::';
  String adminCommandSuffix = '::';

  // Check if the message data is a command
  if (command.startsWith(adminCommandPrefix)) {
    // Get the command
    String cmd = command.split(adminCommandSuffix)[1];

    // Check if the command is valid
    if (adminCommands.contains(cmd)) return true;
  }

  return false;
}

/// Gets the command from the string
String getAdminCommand(String command) {
  String cmd = command
      .replaceAll(adminCommandPrefix, '')
      .replaceAll(adminCommandSuffix, '');

  return cmd;
}

/// Get the total number of messages
Future<void> getTotalMessages(
  DbCollection messages,
  String id,
  WebSocket ws,
) async {
  await messages
      .count(where.eq('userHashId', id))
      .then((value) => ws.send('Total messages: $value (uid-$id)'))
      .catchError((error) =>
          print("Error getting total messages from database: $error"));
}

/// Get the total number of active users
Future<void> getTotalActiveUsers(
  WebSocket ws,
) async {
  ws.send("Total active users in session: ${webSocketUsers.length}");
}

void getHelpReply(WebSocket ws) {
  ws.send('Available commands: ${adminCommands.join(', ')}');
}

/// Get the github repo link
void getGithubLink(WebSocket ws) {
  ws.send("");
}

void getUptime(WebSocket ws) {
  Duration elapsed = globalUptimeStopWatch.elapsed;

  int hours = elapsed.inHours;
  int minutes = elapsed.inMinutes % 60;
  int seconds = elapsed.inSeconds % 60;

  String elapsedString = "$hours hours, $minutes minutes, $seconds seconds";

  ws.send("The server has been online for $elapsedString");
}

/// Runs the admin commands
Future<void> runCommand(
  String commandName,
  DbCollection messages,
  String userId,
  WebSocket ws,
) async {
  switch (commandName) {
    case 'help':
      getHelpReply(ws);
      break;
    case 'tmu':
      await getTotalMessages(messages, userId, ws);
      break;
    case 'tau':
      await getTotalActiveUsers(ws);
      break;
    case 'gh':
      getGithubLink(ws);
      break;
    case 'up':
      getUptime(ws);
      break;
    default:
      break;
  }
}
