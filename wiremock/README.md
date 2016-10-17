Docker Image
==

    $ docker build -t hbrls/wiremock:latest .
    
Run
==

    $ docker run -p 8080:8080 -v /path/to/mappings:/wiremock/mappings
