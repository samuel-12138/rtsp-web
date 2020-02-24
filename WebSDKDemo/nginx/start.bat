@echo off
set nginx_home=./
 
echo Starting nginx...
RunHiddenConsole %nginx_home%/nginx.exe -p %nginx_home%
