import 'package:chat_app/src/http.dart';
import 'package:chat_app/src/utils/utils.dart';

void main() async {
  startUptimeTimer();

  print("=====================================");
  print("============= App Online ============");
  print("=====================================");

  // Start the http server
  serveHttpServer();
}
