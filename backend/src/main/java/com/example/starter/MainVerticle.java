package com.example.starter;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.mysqlclient.MySQLConnectOptions;
import io.vertx.mysqlclient.MySQLPool;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.sqlclient.Row;

public class MainVerticle extends AbstractVerticle {

  @SuppressWarnings("deprecation")
  private MySQLPool pool;

  @SuppressWarnings("deprecation")
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
    // CORS + body handlers
    router.route().handler(CorsHandler.create("*")
        .allowedMethod(HttpMethod.GET)
        .allowedMethod(HttpMethod.POST)
        .allowedMethod(HttpMethod.OPTIONS)
        .allowedHeader("Content-Type")
        .allowedHeader("userid"));
    router.route().handler(BodyHandler.create());
    // Simple request logger
    router.route().handler(ctx -> {
      System.out.println(ctx.request().method() + " " + ctx.request().uri());
      ctx.next();
    });
    
    // API endpoint
    router.get("/api/contests").handler(this::getAllContests);
    router.get("/api/contests/:contestId").handler(this::getContestById);
    router.post("/api/contests/:contestId/join").handler(this::joinContest);


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
              .put("contests", contests);
          
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


  private void getContestById(RoutingContext ctx) {
    String contestIdStr = ctx.pathParam("contestId");
    Long contestId;
    try {
      contestId = Long.parseLong(contestIdStr);
    } catch (NumberFormatException e) {
      ctx.response()
          .setStatusCode(400)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject().put("error", "Invalid contest ID format").encode());
      return;
    }
    pool.preparedQuery("SELECT * FROM contests WHERE contestId = ?")
        .execute(io.vertx.sqlclient.Tuple.of(contestId))
        .onSuccess(result -> {
          if (result.size() == 0) {
            ctx.response()
                .setStatusCode(404)
                .putHeader("Content-Type", "application/json")
                .end(new JsonObject().put("error", "Contest not found").encode());
          } else {
            Row row = result.iterator().next();
            JsonObject contest = new JsonObject();
            for (int i = 0; i < row.size(); i++) {
              contest.put(row.getColumnName(i), row.getValue(i));
            }
            ctx.response()
                .putHeader("Content-Type", "application/json")
                .end(contest.encode());
          }
        })
        .onFailure(error -> {
          ctx.response()
              .setStatusCode(500)
              .putHeader("Content-Type", "application/json")
              .end(new JsonObject().put("error", error.getMessage()).encode());
        });
  }


  private void joinContest(RoutingContext ctx) {
    String contestIdStr = ctx.pathParam("contestId");
    Long contestId;
    try {
      contestId = Long.parseLong(contestIdStr);
    } catch (NumberFormatException e) {
      ctx.response()
          .setStatusCode(400)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject().put("error", "Invalid contest ID format").encode());
      return;
    }

    String updateSql = "UPDATE contests SET currentSize = currentSize + 1 WHERE contestId = ? AND currentSize < contestSize";
    pool.preparedQuery(updateSql)
        .execute(io.vertx.sqlclient.Tuple.of(contestId))
        .onSuccess(updateResult -> {
          if (updateResult.rowCount() == 0) {
            ctx.response()
                .setStatusCode(409)
                .putHeader("Content-Type", "application/json")
                .end(new JsonObject().put("error", "Contest full or not found").encode());
            return;
          }

          pool.preparedQuery("SELECT * FROM contests WHERE contestId = ?")
              .execute(io.vertx.sqlclient.Tuple.of(contestId))
              .onSuccess(selectResult -> {
                if (selectResult.size() == 0) {
                  ctx.response()
                      .setStatusCode(404)
                      .putHeader("Content-Type", "application/json")
                      .end(new JsonObject().put("error", "Contest not found").encode());
                } else {
                  Row row = selectResult.iterator().next();
                  JsonObject contest = new JsonObject();
                  for (int i = 0; i < row.size(); i++) {
                    contest.put(row.getColumnName(i), row.getValue(i));
                  }
                  ctx.response()
                      .putHeader("Content-Type", "application/json")
                      .end(contest.encode());
                }
              })
              .onFailure(err -> {
                ctx.response()
                    .setStatusCode(500)
                    .putHeader("Content-Type", "application/json")
                    .end(new JsonObject().put("error", err.getMessage()).encode());
              });
        })
        .onFailure(err -> {
          ctx.response()
              .setStatusCode(500)
              .putHeader("Content-Type", "application/json")
              .end(new JsonObject().put("error", err.getMessage()).encode());
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

