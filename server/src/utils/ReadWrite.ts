import redis from "databases/redis"
import logger from "./logger"

/**
 * Reads data from cache or database.
 * 
 * This function attempts to read data from a cache (e.g., Redis). If the data is not found in the cache,
 * it fetches the data from a database (e.g., MySQL) and optionally caches it for future requests.
 * 
 * @param getFromCache - A function that returns a promise resolving to the data from the cache.
 * @param onCacheMiss - A function that is called when the data is not found in the cache. It takes the data fetched from the database as an argument and returns a promise.
 * @param getFromDatabase - A function that returns a promise resolving to the data from the database.
 * 
 * @returns A promise that resolves to the requested data, either from the cache or the database.
 * 
 * @throws Will throw an error if the cache is not ready or if the data is not found in the cache.
 * 
 * @example
 * ```typescript
 * const data = await readData(
 *   async () => await redis.get('key'),
 *   async (data) => await redis.set('key', data),
 *   async () => await sqlQuery('SELECT * FROM table WHERE id = ?', [id])
 * );
 * ```
 */
export async function readData (
  getFromCache: () => Promise<unknown>,
  onCacheMiss: (data: unknown) => Promise<unknown>,
  getFromDatabase: () => Promise<unknown>
): Promise<unknown> {  // TODO: Handle errors correctly for specific purposes
  try {
    // If Redis is ready, check if data is in cache
    if (redis.status === 'ready') {
      const data = await getFromCache()
      // If data is not found in cache, throw an error
      if (!data) {
        logger.warn('Requested Data not found in cache.')
        throw Error()
      }
      // If data is found in cache, return it
      logger.info('Data found in cache.')
      return data
    }
    // If Redis is not ready, throw an error
    else {
      logger.warn('Redis is not ready yet.')
      throw Error()
    }
  }
  // If data is not found in cache, fetch it from the database
  catch (err) {
    const data = await getFromDatabase()
    logger.info('Data fetched from the database.')
    // If data is found in the database, cache it
    if (redis.status === 'ready') {
      await onCacheMiss(data)
      logger.info('Data cached successfully.')
    }
    else {
      logger.warn('Data could not be cached.')
    }
    // Return the data fetched from the database
    return data
  }
}

/**
 * Writes data to the database and optionally caches it.
 * 
 * This function writes data to a database (e.g., MySQL) and optionally caches it in a cache (e.g., Redis).
 * 
 * @param writeDatabase - A function that writes data to the database and returns a promise.
 * @param writeCache - A function that caches the data and returns a promise.
 * 
 * @returns A promise that resolves to the data written to the database.
 * 
 * @throws Will throw an error if there is an issue writing data to the database.
 * 
 * @example
 * ```typescript
 * const data = await writeData (
 *   async () => await sqlQuery('INSERT INTO table VALUES (?, ?, ?)', [value1, value2, value3]),
 *   async (data) => await redis.set('key', data)
 * );
 * ```
 */
export async function writeData (
  writeDatabase: () => Promise<unknown>,
  writeCache: (data: unknown) => Promise<unknown>
): Promise<unknown> {  // TODO: Handle errors correctly for specific purposes
  try {
    // Write data to the database
    const data = await writeDatabase()
    logger.info('Data written to the database.')
    // If Redis is ready, cache the data
    if (redis.status === 'ready') {
      await writeCache(data)
      logger.info('Data cached successfully.')
    }
    else {
      logger.warn('Data could not be cached.')
    }
    // Return the data written to the database
    return data
  }
  catch (err) {
    logger.error('Error writing data to the database.')
    throw Error()
  }
}