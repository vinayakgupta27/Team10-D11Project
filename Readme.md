= Starter

image:https://img.shields.io/badge/vert.x-4.5.17-purple.svg[link="https://vertx.io"]

This application was generated using http://start.vertx.io

== Building

To launch your tests:
```
./mvnw clean test
```

To package your application:
```
./mvnw clean package
```

To run your application:
```
./mvnw clean compile exec:java
```

== Help

* https://vertx.io/docs/[Vert.x Documentation]
* https://stackoverflow.com/questions/tagged/vert.x?sort=newest&pageSize=15[Vert.x Stack Overflow]
* https://groups.google.com/forum/?fromgroups#!forum/vertx[Vert.x User Group]
* https://discord.gg/6ry7aqPWXy[Vert.x Discord]


Backend:

Build: mvnw -DskipTests package
Run(foreground): java -jar target/starter-1.0.0-SNAPSHOT-fat.jar
Run(Background with logs): nohup java -jar target/starter-1.0.0-SNAPSHOT-fat.jar > backend.log 2>&1 & tail -f backend.log
Verify: curl -i http://localhost:8080/api/contests

