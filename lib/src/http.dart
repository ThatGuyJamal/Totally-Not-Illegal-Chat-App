import 'dart:async';
import 'dart:io';

import 'package:alfred/alfred.dart';
import 'package:chat_app/src/config/settings.dart';
import 'package:chat_app/src/utils/utils.dart';
import 'package:chat_app/src/ws.dart';

// Create the Alfred instance
final app = Alfred(
    onInternalError: errorHandler,
    onNotFound: missingHandler,
    logLevel: settings['logLevel'] ?? LogType.info);

/// Runs our http server, handles requests and responses, and the websocket backend.
Future<void> serveHttpServer() async {
  // Path to the html code file
  // https://api.dart.dev/stable/2.18.6/dart-io/Platform/script.html
  String chatClientHtmlFile =
      Platform.script.resolve('./static/chat-client.html').toFilePath();

  String indexHtmlFile =
      Platform.script.resolve('./static/index.html').toFilePath();

  app.get('/', (req, res) => File(indexHtmlFile));

  app.get('/chat', (req, res) => File(chatClientHtmlFile));

  // Start websocket server

  await serveWebSocket(app);

  final server = await app.listen(
      settings['port'] ?? 8080, settings['http_ip'] ?? 'localhost');

  print('Listening at http://${server.address.host}:${server.port}');
}
