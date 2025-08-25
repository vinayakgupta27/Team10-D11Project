package com.example.starter;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.mysqlclient.MySQLConnectOptions;
import io.vertx.mysqlclient.MySQLPool;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.sqlclient.Row;

public class MainVerticle extends AbstractVerticle {

  private MySQLPool pool;

  @Override
  public void start(Promise<Void> startPromise) throws Exception {
    
    // Database connection
    MySQLConnectOptions connectOptions = new MySQLConnectOptions()
        .setPort(3306)
        .setHost("localhost")
        .setDatabase("Team10Project")
        .setUser("root")
        .setPassword("rootroot");

    PoolOptions poolOptions = new PoolOptions().setMaxSize(5);
    pool = MySQLPool.pool(vertx, connectOptions, poolOptions);

    // Router
    Router router = Router.router(vertx);
    
    // API endpoint
    router.get("/api/contests").handler(this::getAllContests);

    // Start server
    vertx.createHttpServer()
        .requestHandler(router)
        .listen(8080)
        .onComplete(http -> {
          if (http.succeeded()) {
            startPromise.complete();
            System.out.println("Server started on port 8080");
            System.out.println("API: GET /api/contests");
          } else {
            startPromise.fail(http.cause());
          }
        });
  }

  private void getAllContests(RoutingContext ctx) {
    pool.query("SELECT * FROM contests")
        .execute()
        .onSuccess(result -> {
          JsonArray contests = new JsonArray();
          
          for (Row row : result) {
            JsonObject contest = new JsonObject();
            // Add all columns from the row
            for (int i = 0; i < row.size(); i++) {
              String columnName = row.getColumnName(i);
              Object value = row.getValue(i);
              contest.put(columnName, value);
            }
            contests.add(contest);
          }
          
          JsonObject response = new JsonObject()
              .put("contests", contests)
              .put("count", contests.size());
          
          ctx.response()
              .putHeader("Content-Type", "application/json")
              .end(response.encode());
        })
        .onFailure(error -> {
          ctx.response()
              .setStatusCode(500)
              .putHeader("Content-Type", "application/json")
              .end(new JsonObject()
                  .put("error", error.getMessage())
                  .encode());
        });
  }

  @Override
  public void stop(Promise<Void> stopPromise) throws Exception {
    if (pool != null) {
      pool.close();
    }
    stopPromise.complete();
  }
}