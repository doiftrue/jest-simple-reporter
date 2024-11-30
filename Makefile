-include Makefile-extend.mk


define node_run
	docker run --rm -it \
	  --name JEST_REPORTER_node \
	  --hostname jestreporter \
	  --user node \
	  -e HISTFILE=/app/tmp/.bash_history \
	  -e PROMPT_COMMAND="history -a; ${PROMPT_COMMAND:-}" \
      -e HISTCONTROL=ignoredups \
      -e NODE_OPTIONS=--disable-warning=ExperimentalWarning \
	  -v .:/app \
	  node:23.1-slim \
	  sh -c "cd /app ; $1"
endef


node.connect: ## Connect to NODE container
	$(call node_run, bash)

node.run: ## Run a command in NODE container. Eg: make node.command "ls -la"
	$(call node_run, $(filter-out $@,$(MAKECMDGOALS)))

jest: ## Run Jest tests. Eg: make jest
	docker compose exec node bash -c "npx jest"

npm.install:
	$(call node_run, npm install)
npm.update:
	$(call node_run, npm update)
