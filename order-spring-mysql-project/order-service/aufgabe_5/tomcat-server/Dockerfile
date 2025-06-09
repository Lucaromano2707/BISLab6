# syntax=docker/dockerfile:1
FROM tomcat:10.1-jre17

COPY order-service.war /usr/local/tomcat/webapps/order-service.war

EXPOSE 8080

CMD ["catalina.sh", "run"]