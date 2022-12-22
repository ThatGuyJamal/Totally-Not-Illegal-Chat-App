import 'dart:async';

import 'package:chat_app/src/config/settings.dart';
import 'package:xid/xid.dart';
import 'package:alfred/alfred.dart';

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

/// Checks if the app is in development mode
bool inDevelopmentMode() {
  LogType config = settings['logLevel'];

  if (config == LogType.debug) {
    return true;
  } else {
    return false;
  }
}

/// Checks if the string is longer than the allowed characters
bool isLongerThanAllowedChars(String str, int length) {
  if (str.length > length) {
    return true;
  } else {
    return false;
  }
}

Stopwatch globalUptimeStopWatch = Stopwatch();

void startUptimeTimer() {
  globalUptimeStopWatch.start();
}
