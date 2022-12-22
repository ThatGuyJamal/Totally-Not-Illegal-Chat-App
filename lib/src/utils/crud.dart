import 'dart:async';

import 'package:mongo_dart/mongo_dart.dart';

import 'utils.dart';

/// Delete all messages from a user
Future<void> deleteAllMessagesFromUser(DbCollection messages, String id) async {
  await messages
      .deleteMany({'userHashId': id}, writeConcern: WriteConcern.acknowledged)
      .then((value) => inDevelopmentMode()
          ? value.document != null
              ? print(value.document)
              : null
          : null)
      .catchError(
          (error) => print("Error deleting messages from database: $error"));
}

/// Creates and saves a message to the database
Future<void> createMessageForUser(
    DbCollection messages, String id, String data) async {
  // Save the message to the database
  await messages
      .insertOne({
        'userHashId': id,
        // 'randomUserId':
        //     randomizeString(user.hashCode.toString(), randomUserId),
        'message': data,
      }, writeConcern: WriteConcern.acknowledged)
      .then((value) => inDevelopmentMode()
          ? value.document != null
              ? print(value.document)
              : null
          : null)
      .catchError(
          (error) => print("Error inserting message to database: $error"));
}

/// Cleans the database from old all messages every 10 minutes.
/// This is used to prevent the database from getting too big even if a user does not refresh the page
/// (which would deletes the messages they send on that websocket)
Future<void> cleanAllMessageHistory(DbCollection messages) async {
  Timer.periodic(Duration(minutes: 10), (timer) async {
    await messages
        .deleteMany({}, writeConcern: WriteConcern.acknowledged)
        .then((value) => inDevelopmentMode()
            ? print("Did clean database: ${value.isAcknowledged}")
            : null)
        .catchError(
            (error) => print("Error deleting messages from database: $error"));
  });
}
