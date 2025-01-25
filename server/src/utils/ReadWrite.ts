import redis from "databases/redis"
import query from "databases/mysql"

export async function read(redisQuery: string, mysqlQuery: string, redisValues?: any[], mysqlValues?: any[]) {
  if (redis.status === 'ready') {
    try {
      const data = (redisValues) ? await redis.call(redisQuery, ...redisValues) : await redis.call(redisQuery)
      if (!data) throw Error()
      return data
    }
    catch (err) {
      
    }
  }
  else {

  }
}

export function write(redisQuery: string, redisValues: any[], mysqlQuery: string, mysqlValues: any[]) {
  if (redis.status === 'ready') {

  }
  else {

  }
}