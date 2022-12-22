import 'dart:async';

import 'package:xid/xid.dart';
import 'package:alfred/alfred.dart';

// A list of admin commands
final List<String> adminCommands = ["total-messages-user"];

// Creates a random Id
Xid generateId() {
  return Xid();
}

/// Returns a new string with the characters from both strings mixed together.
String mixTwoStrings(String str1, String str2) {
  String newString = '';
  if (str1.length > str2.length) {
    for (int i = 0; i < str1.length; i++) {
      if (i < str2.length) {
        newString += str1[i] + str2[i];
      } else {
        newString += str1[i];
      }
    }
  } else {
    for (int i = 0; i < str2.length; i++) {
      if (i < str1.length) {
        newString += str1[i] + str2[i];
      } else {
        newString += str2[i];
      }
    }
  }
  return newString;
}

// Error handler
FutureOr errorHandler(HttpRequest req, HttpResponse res) {
  res.statusCode = 500;
  return "Internal Server Error!";
}

// Missing Route handler
FutureOr missingHandler(HttpRequest req, HttpResponse res) {
  res.statusCode = 404;
  return "This route doesn't exist!";
}
