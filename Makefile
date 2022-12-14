
# Builds the project using yarn and nodejs
commands:
		@echo ---------------------------------------------
		@echo Valid Make commands in this project are:
		@echo - build_project (builds the project)
		@echo - pre_deploy (cleans the project and preps it for deployment)

		@echo - Use "make <command>" to run a command
		@echo ---------------------------------------------

# Cleans the project before deploying
pre_deploy:
		@echo ---------------------------------------------
		@echo Starting...

		@rmdir dist /s /q
		@echo Deleted dist folder...

		@yarn format
		@echo Formatted project...

		@yarn build
		@echo Built project...

		@node ./dist/index.js
		@echo Ran project...

		@echo "Done!"
		@echo ---------------------------------------------

# updates all project dependencies
update_all_deps:
		@echo ---------------------------------------------
		@echo Starting...

		@echo Removing dependencies...
		@yarn remove discord.js dotenv mongoose 

		@echo Removing Dev-dependencies...
		yarn remove typescript tsc-watch prettier npm-run-all @uwu-codes/tsconfig @types/node @sapphire/prettier-config @types/mongoose

		@echo Installing dependencies...
		@yarn add discord.js dotenv mongoose

		@echo Installing Dev-dependencies...
		@yarn add -D typescript tsc-watch prettier npm-run-all @uwu-codes/tsconfig @types/node @sapphire/prettier-config @types/mongoose

		@echo "Done!"
		@echo ---------------------------------------------

# Builds the project
build_project:
		@echo ---------------------------------------------
		@echo Starting...

		@rmdir dist /s /q
		@echo Deleted dist folder...

		@yarn build
		@echo Built project...

		@echo "Done!"
		@echo ---------------------------------------------