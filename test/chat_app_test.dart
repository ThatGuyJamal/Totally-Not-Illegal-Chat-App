import 'package:chat_app/src/admin/admin.dart';
import 'package:chat_app/src/utils/utils.dart';
import 'package:test/test.dart';

void main() {
  test('mixing to strings together', () {
    expect(mixTwoStrings('abc', 'abc'), 'aabbcc');
  });

  test('checking if the app is in development mode', () {
    expect(inDevelopmentMode(), true);
  });

  test('checking if the string is longer than the allowed characters', () {
    expect(isLongerThanAllowedChars('abc', 2), true);
  });

  test('checking if the string is longer than the allowed characters', () {
    expect(isLongerThanAllowedChars('abc', 3), false);
  });

  test("check if the string is a valid admin command", () {
    expect(isValidAdminCommand('admin::help'), true);
  });

  test("get the admin command from the string", () {
    expect(getAdminCommand('admin::help'), 'help');
  });
}
