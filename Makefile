# Scripts
compile_dart:
	@echo Compiling dart files
	# Remove the current ./bin/chat_app.exe file if it exists
	@rm -f ./bin/chat_app.exe
	# Compile the dart file to an executable
	@dart compile exe ./lib/chat_app.dart -o ./bin/chat_app.exe
	@echo Done compiling dart files

# Run the compiled dart file
run_exe:
	@echo Running the compiled dart file
	@./bin/chat_app.exe

# Run the dart file
run_dart:
	@echo Running the dart file
	@dart ./lib/chat_app.dart

# Test the dart project
test:
	@echo Testing the dart file
	@dart test