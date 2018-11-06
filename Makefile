# Makefile to carry out basic build and test operation.
# Can also be used to dockerize the application eventually.
# Can also be used to test the kubernetes part of the application.

NODE=node
NPM=npm


start:
	${NPM} start

test-app:
	${NPM} test

install:
	${NPM} install
	