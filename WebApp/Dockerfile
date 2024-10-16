FROM amazoncorretto:17 AS build

WORKDIR /WebApp

COPY pom.xml ./
COPY mvnw ./
COPY .mvn ./.mvn/
COPY src ./src

RUN ./mvnw clean package -DskipTests

FROM amazoncorretto:17

WORKDIR /app

COPY --from=build /WebApp/target/*.jar webapp.jar

ENTRYPOINT ["java", "-jar", "webapp.jar"]