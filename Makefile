
# Builds the project using yarn and nodejs
commands:
		@echo ---------------------------------------------
		@echo Valid Make commands in this project are:
		@echo - build (builds the project)
		@echo - pre_deploy (cleans the project and preps it for deployment)

		@echo - Use "make <command>" to run a command
		@echo ---------------------------------------------

# Cleans the project before deploying
pre_deploy:
		@echo ---------------------------------------------
		@echo Starting...

		@rmdir dist /s /q
		@yarn format
		@yarn build
		@node ./dist/index.js

		@echo "Done!"
		@echo ---------------------------------------------
