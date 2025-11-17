.PHONY: start smoke

start:
	npx serve . -l 5000

smoke:
	nohup npx serve . -l 5000 > /dev/null 2>&1 &
	sleep 2
	curl -f http://localhost:5000