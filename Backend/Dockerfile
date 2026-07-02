# ---- Stage 1: build the jar with Maven -----------------------------------
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy only the POM first so dependency resolution is cached in its own
# Docker layer and isn't repeated on every source code change.
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests -B

# ---- Stage 2: run the jar on a minimal JRE image ---------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a non-root user instead of the image default (root).
RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring app.jar
USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-Duser.timezone=America/Fortaleza", "-jar", "app.jar"]