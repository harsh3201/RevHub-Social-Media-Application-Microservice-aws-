@echo off
echo Generating all backend services...

cd ..

REM User Service
call :CREATE_SERVICE user-service 8081 mysql
REM Post Service
call :CREATE_SERVICE post-service 8082 mysql
REM Social Service
call :CREATE_SERVICE social-service 8083 mysql
REM Chat Service
call :CREATE_SERVICE chat-service 8084 mongodb
REM Notification Service
call :CREATE_SERVICE notification-service 8085 mongodb
REM Feed Service
call :CREATE_SERVICE feed-service 8086 mongodb
REM Search Service
call :CREATE_SERVICE search-service 8087 mongodb
REM Saga Orchestrator
call :CREATE_SERVICE saga-orchestrator 8088 mysql

echo All backend services generated!
pause
exit /b

:CREATE_SERVICE
set SERVICE_NAME=%1
set PORT=%2
set DB_TYPE=%3

echo Creating %SERVICE_NAME%...

mkdir "backend-services\%SERVICE_NAME%\src\main\java\com\revhub\%SERVICE_NAME%\controller" 2>nul
mkdir "backend-services\%SERVICE_NAME%\src\main\java\com\revhub\%SERVICE_NAME%\service" 2>nul
mkdir "backend-services\%SERVICE_NAME%\src\main\java\com\revhub\%SERVICE_NAME%\repository" 2>nul
mkdir "backend-services\%SERVICE_NAME%\src\main\java\com\revhub\%SERVICE_NAME%\model" 2>nul
mkdir "backend-services\%SERVICE_NAME%\src\main\resources" 2>nul

REM Create pom.xml
(
echo ^<?xml version="1.0" encoding="UTF-8"?^>
echo ^<project xmlns="http://maven.apache.org/POM/4.0.0"
echo          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
echo          xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"^>
echo     ^<modelVersion^>4.0.0^</modelVersion^>
echo     ^<parent^>
echo         ^<groupId^>org.springframework.boot^</groupId^>
echo         ^<artifactId^>spring-boot-starter-parent^</artifactId^>
echo         ^<version^>3.5.8^</version^>
echo     ^</parent^>
echo     ^<groupId^>com.revhub^</groupId^>
echo     ^<artifactId^>%SERVICE_NAME%^</artifactId^>
echo     ^<version^>1.0.0^</version^>
echo     ^<properties^>
echo         ^<java.version^>17^</java.version^>
echo         ^<spring-cloud.version^>2024.0.0^</spring-cloud.version^>
echo     ^</properties^>
echo     ^<dependencies^>
echo         ^<dependency^>^<groupId^>org.springframework.boot^</groupId^>^<artifactId^>spring-boot-starter-web^</artifactId^>^</dependency^>
echo         ^<dependency^>^<groupId^>org.springframework.boot^</groupId^>^<artifactId^>spring-boot-starter-actuator^</artifactId^>^</dependency^>
echo         ^<dependency^>^<groupId^>org.springframework.cloud^</groupId^>^<artifactId^>spring-cloud-starter-consul-discovery^</artifactId^>^</dependency^>
echo         ^<dependency^>^<groupId^>org.springframework.kafka^</groupId^>^<artifactId^>spring-kafka^</artifactId^>^</dependency^>
echo         ^<dependency^>^<groupId^>org.projectlombok^</groupId^>^<artifactId^>lombok^</artifactId^>^</dependency^>
if "%DB_TYPE%"=="mysql" echo         ^<dependency^>^<groupId^>org.springframework.boot^</groupId^>^<artifactId^>spring-boot-starter-data-jpa^</artifactId^>^</dependency^>
if "%DB_TYPE%"=="mysql" echo         ^<dependency^>^<groupId^>com.mysql^</groupId^>^<artifactId^>mysql-connector-j^</artifactId^>^</dependency^>
if "%DB_TYPE%"=="mongodb" echo         ^<dependency^>^<groupId^>org.springframework.boot^</groupId^>^<artifactId^>spring-boot-starter-data-mongodb^</artifactId^>^</dependency^>
echo     ^</dependencies^>
echo     ^<dependencyManagement^>^<dependencies^>^<dependency^>^<groupId^>org.springframework.cloud^</groupId^>^<artifactId^>spring-cloud-dependencies^</artifactId^>^<version^>${spring-cloud.version}^</version^>^<type^>pom^</type^>^<scope^>import^</scope^>^</dependency^>^</dependencies^>^</dependencyManagement^>
echo     ^<build^>^<plugins^>^<plugin^>^<groupId^>org.springframework.boot^</groupId^>^<artifactId^>spring-boot-maven-plugin^</artifactId^>^</plugin^>^</plugins^>^</build^>
echo ^</project^>
) > "backend-services\%SERVICE_NAME%\pom.xml"

REM Create application.yml
(
echo server:
echo   port: %PORT%
echo spring:
echo   application:
echo     name: %SERVICE_NAME%
echo   cloud:
echo     consul:
echo       host: ${CONSUL_HOST:localhost}
echo       port: 8500
if "%DB_TYPE%"=="mysql" echo   datasource:
if "%DB_TYPE%"=="mysql" echo     url: jdbc:mysql://${DB_HOST:localhost}:3306/${DB_NAME:revhub_db}
if "%DB_TYPE%"=="mysql" echo     username: root
if "%DB_TYPE%"=="mysql" echo     password: root
if "%DB_TYPE%"=="mysql" echo   jpa:
if "%DB_TYPE%"=="mysql" echo     hibernate:
if "%DB_TYPE%"=="mysql" echo       ddl-auto: update
if "%DB_TYPE%"=="mongodb" echo   data:
if "%DB_TYPE%"=="mongodb" echo     mongodb:
if "%DB_TYPE%"=="mongodb" echo       uri: mongodb://${MONGO_HOST:localhost}:27017/${DB_NAME:revhub_db}
echo   kafka:
echo     bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
) > "backend-services\%SERVICE_NAME%\src\main\resources\application.yml"

REM Create Main Class
set CLASS_NAME=%SERVICE_NAME:user-service=UserService%
set CLASS_NAME=%CLASS_NAME:post-service=PostService%
set CLASS_NAME=%CLASS_NAME:social-service=SocialService%
set CLASS_NAME=%CLASS_NAME:chat-service=ChatService%
set CLASS_NAME=%CLASS_NAME:notification-service=NotificationService%
set CLASS_NAME=%CLASS_NAME:feed-service=FeedService%
set CLASS_NAME=%CLASS_NAME:search-service=SearchService%
set CLASS_NAME=%CLASS_NAME:saga-orchestrator=SagaOrchestrator%

(
echo package com.revhub.%SERVICE_NAME:.=-%;
echo import org.springframework.boot.SpringApplication;
echo import org.springframework.boot.autoconfigure.SpringBootApplication;
echo import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
echo @SpringBootApplication
echo @EnableDiscoveryClient
echo public class %CLASS_NAME%Application {
echo     public static void main^(String[] args^) {
echo         SpringApplication.run^(%CLASS_NAME%Application.class, args^);
echo     }
echo }
) > "backend-services\%SERVICE_NAME%\src\main\java\com\revhub\%SERVICE_NAME:.=-%\%CLASS_NAME%Application.java"

REM Create Dockerfile
(
echo FROM eclipse-temurin:17-jre-alpine
echo WORKDIR /app
echo COPY target/%SERVICE_NAME%-1.0.0.jar app.jar
echo EXPOSE %PORT%
echo ENTRYPOINT ["java", "-jar", "app.jar"]
) > "backend-services\%SERVICE_NAME%\Dockerfile"

echo %SERVICE_NAME% created!
exit /b
