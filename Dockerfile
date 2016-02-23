# http://github.com/hbrls/docker-flask-app

FROM hbrls/flask-app:0.2.0


COPY requirements.txt /
RUN pip install -r requirements.txt -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
