.PHONY: dev
dev: start-dev attach ## start dev services and attach to dev container

.PHONY: build
build: check-env check-install ## build client and server
	@docker-compose run --rm node yarn build

.PHONE: build-docker
build-docker: build ## build docker image
	@docker build -f ./docker-release/Dockerfile -t simbo/home-internet-connection .

.PHONY: start-dev
start-dev: stop check-env check-install # (re)start dev services
	@docker-compose up -d --force-recreate web-dev

.PHONY: start
start: stop check-env check-install build ## (re)start prod services
	@docker-compose up -d --force-recreate web

.PHONY: stop
stop: ## stop all services
	@docker-compose stop app db web app-dev web-dev

.PHONY: attach
attach: ## attach to dev container
	@echo "Attaching to dev container…  (press \033[1;37mCTRL-C\033[0m to detach)"
	@docker attach --detach-keys="ctrl-c" hic_app-dev || true

.PHONY: shell
shell: ## open a shell in node container
	@docker-compose run --rm node bash || true

.PHONY: install
install: # install node_modules
	@docker-compose run --rm node yarn

.PHONY: check-install
check-install: # install if node_modules doesn't exist or lockfile changed
	@if [ ! -d "node_modules" ] || ! cmp -s yarn.lock .last-yarn-state; then\
		$(MAKE) install && cp -pf yarn.lock .last-yarn-state;\
	fi

.PHONY: check-env
check-env: # create env file if not existing
	@if [ ! -f ".env" ]; then\
		cp .env-sample .env;\
	fi

.DEFAULT_GOAL :=
.PHONY: help
help: # usage info auto-generated from comments
	@echo "\nUsage: \033[1;37mmake <target>\033[0m\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk \
		'BEGIN {FS = ":.*?## "}; {printf "\033[0;36m%s\033[0m \033[0;37m→\033[0m %s\n", $$1, $$2}'
