# Makefile to carry out basic build and test operation.
# Can also be used to dockerize the application eventually.
# Can also be used to test the kubernetes part of the application.

NODE=node
NPM=npm


start:
	${NPM} start

coverage:
	${NPM} run report-coverage
	
install:
	${NPM} install

codecov:
	${NPM} install -g codecov

.PHONY: test
test:
	${NPM} test
	