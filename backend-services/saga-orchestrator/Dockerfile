FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/saga-orchestrator-1.0.0.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]
