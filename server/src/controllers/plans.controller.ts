import { INTERNAL_SERVER_ERROR, OK } from "constants/http";
import sqlQuery from "databases/mysql";
import redis from "databases/redis";
import ApiError from "utils/ApiError";
import ApiResponse from "utils/ApiResponse";
import asyncHandler from "utils/asyncHandler";
import { AccessTokenPayload } from "utils/jwt";
import logger from "utils/logger";

/**
 * Represents the details of a feature in the shopping website.
 */
type FeatureDetail = {
  /**
   * Unique identifier for the feature.
   * @example "feature023"
   */
  featureID: string;

  /**
   * The name of the feature.
   * @example "Premium Support"
   */
  title: string;

  /**
   * A brief description of what the feature offers.
   * @example "Provides 24/7 premium customer support."
   */
  description: string;

  /**
   * Monthly price for the feature used by 1 user, in INR.
   * @example 9.99
   */
  price_per_user_per_month: number;
}

type TierDetail = {
  /** The tier number */
  tier: number,
  /** The name of the tier */
  tierName: string,
  /** A brief description of the tier */
  tierDescription: string,
  /** The maximum number of users that can use the tier */
  maxUsers: number,
  /** The discount percentage for the tier */
  discount: number
}

export const getFeatures = asyncHandler(
  async (req, res, next) => {
    try {
      if (redis.status === 'ready') {
        /* Implement Redis Logic */
        const features = JSON.parse(await redis.call('JSON.GET', 'features') as string) as FeatureDetail[]
        
        /* If redis contains the data then send it to client */
        if (features) {
          res
            .status(OK)
            .json(new ApiResponse(OK, [features], 'Features retrieved successfully'))
        }

        /* If redis doesn't contain the data, fetch it from MySQL and store it in Redis */
        else {
          logger.warn('Redis does not have the data')
          /* Implement MySQL Logic */
          const sqlData = await sqlQuery('CALL getAllFeaturesOrTiers(0)')
          if (sqlData instanceof Array) {
            if (sqlData[0] instanceof Array) {
              const sqlFeatures = sqlData[0]
              const finalData: FeatureDetail[] = sqlFeatures.map(feature => {
                return {
                  featureID: feature.featureid as string,
                  title: feature.title as string,
                  description: feature.description as string,
                  price_per_user_per_month: parseFloat(feature.price_inr_pupm) as number
                }
              })
              await redis
                .pipeline()
                .call('JSON.SET', 'features', '.', JSON.stringify(finalData))
                .expire('features', 3600)  // Cache set to 1 hour intentionally to prevent stale data
                .exec()
              res
                .status(OK)
                .json(new ApiResponse(OK, [finalData], 'Features retrieved successfully'))
            }
            else {
              logger.error('Features data cannot be fetched from MySQL')
              throw new ApiError(INTERNAL_SERVER_ERROR, 'Features data cannot be fetched from MySQL')
            }
          }
          else {
            logger.error('Features data cannot be fetched from MySQL')
            throw new ApiError(INTERNAL_SERVER_ERROR, 'Features data cannot be fetched from MySQL')
          }
        }
      }
      else {
        logger.warn('Redis is not ready yet')
        const sqlData = await sqlQuery('CALL getAllFeaturesOrTiers(0)')
        if (sqlData instanceof Array) {
          if (sqlData[0] instanceof Array) {
            const features = sqlData[0]
            const finalData: FeatureDetail[] = features.map(feature => {
              return {
                featureID: feature.featureid as string,
                title: feature.title as string,
                description: feature.description as string,
                price_per_user_per_month: parseFloat(feature.price_inr_pupm) as number
              }
            })
            res
              .status(OK)
              .json(new ApiResponse(OK, [finalData], 'Features retrieved successfully'))
          }
          else {
            logger.error('Features data cannot be fetched from MySQL')
            throw new ApiError(INTERNAL_SERVER_ERROR, 'Features data cannot be fetched from MySQL')
          }
        }
        else {
          logger.error('Features data cannot be fetched from MySQL')
          throw new ApiError(INTERNAL_SERVER_ERROR, 'Features data cannot be fetched from MySQL')
        }
      }
    }
    catch(err) {
      next(err)
    }
  }
)

export const getTiers = asyncHandler(
  async (req, res, next) => {
    try {
      if (redis.status === 'ready') {
        /* Implement Redis Logic */
        const tiers = JSON.parse(await redis.call('JSON.GET', 'tiers') as string) as TierDetail[]
        
        /* If redis contains the data then send it to client */
        if (tiers) {
          res
            .status(OK)
            .json(new ApiResponse(OK, [tiers], 'Tiers retrieved successfully'))
        }

        /* If redis doesn't contain the data, fetch it from MySQL and store it in Redis */
        else {
          logger.warn('Redis does not have the data')
          /* Implement MySQL Logic */
          const sqlData = await sqlQuery('CALL getAllFeaturesOrTiers(1)')
          if (sqlData instanceof Array) {
            if (sqlData[0] instanceof Array) {
              const sqlTiers = sqlData[0]
              const finalData: TierDetail[] = sqlTiers.map(tier => {
                return {
                  tier: parseInt(tier.tierid),
                  tierName: tier.tiername as string,
                  tierDescription: tier.tier_description as string,
                  maxUsers: parseInt(tier.max_users),
                  discount: parseFloat(tier.discount)
                }
              })
              await redis
                .pipeline()
                .call('JSON.SET', 'tiers', '.', JSON.stringify(finalData))
                .expire('tiers', 3600)  // Cache set to 1 hour intentionally to prevent stale data
                .exec()
              res
                .status(OK)
                .json(new ApiResponse(OK, [finalData], 'Tiers retrieved successfully'))
            }
            else {
              logger.error('Tiers data cannot be fetched from MySQL')
              throw new ApiError(INTERNAL_SERVER_ERROR, 'Tiers data cannot be fetched from MySQL')
            }
          }
          else {
            logger.error('Tiers data cannot be fetched from MySQL')
            throw new ApiError(INTERNAL_SERVER_ERROR, 'Tiers data cannot be fetched from MySQL')
          }
        }
      }
      else {
        logger.warn('Redis is not ready yet')
        const sqlData = await sqlQuery('CALL getAllFeaturesOrTiers(1)')
        if (sqlData instanceof Array) {
          if (sqlData[0] instanceof Array) {
            const tiers = sqlData[0]
            const finalData: TierDetail[] = tiers.map(tier => {
              return {
                tier: parseInt(tier.tierid),
                tierName: tier.tiername as string,
                tierDescription: tier.tier_description as string,
                maxUsers: parseInt(tier.max_users),
                discount: parseFloat(tier.discount)
              }
            })
            res
              .status(OK)
              .json(new ApiResponse(OK, [finalData], 'Tiers retrieved successfully'))
          }
          else {
            logger.error('Tiers data cannot be fetched from MySQL')
            throw new ApiError(INTERNAL_SERVER_ERROR, 'Tiers data cannot be fetched from MySQL')
          }
        }
        else {
          logger.error('Tiers data cannot be fetched from MySQL')
          throw new ApiError(INTERNAL_SERVER_ERROR, 'Tiers data cannot be fetched from MySQL')
        }
      }
    }
    catch(err) {
      next(err)
    }
  }
)

export const purchasePlan = asyncHandler(
  async (req, res, next) => {
    try {
      type RequestData = {
        subscription: 0 | 1,  // Monthly -> 0, Yearly -> 1
        data: {feature: string, tier: number}[]
      } & { __verifiedData: AccessTokenPayload }

      const reqData = req.body
      const { __verifiedData, ...rest }: RequestData = reqData
      const { subscription, data } = rest
      
      
      sqlQuery('CALL purchasePlan(?, ?, ?)', [subscription, __verifiedData.userid, JSON.stringify(data)])
      .then(() => {
        res
          .status(OK)
          .json(new ApiResponse(OK, [], 'Plan purchased successfully'))
      })
      .catch(err => {
        logger.error('Plan cannot be purchased for user', __verifiedData.userid)
        throw new ApiError(INTERNAL_SERVER_ERROR, 'Plan cannot be purchased')
      })
    }
    catch(err) {
      next(err)
    }
  }
)

export const getUserPlans = asyncHandler(
  async (req, res, next) => {
    try {
      type RequestData = { __verifiedData: AccessTokenPayload }

      const reqData = req.body
      const { __verifiedData }: RequestData = reqData
      
      const sqlData = await sqlQuery('CALL getUserPlans(?)', [__verifiedData.userid])
      console.log(sqlData)
      throw new ApiError(INTERNAL_SERVER_ERROR, 'User plans cannot be fetched')
      // if (sqlData instanceof Array) {
      //   if (sqlData[0] instanceof Array) {
      //     res
      //       .status(OK)
      //       .json(new ApiResponse(OK, [], 'User plans fetched successfully'))
      //   }
      //   else {
      //     logger.error('User plans cannot be fetched')
      //     throw new ApiError(INTERNAL_SERVER_ERROR, 'User plans cannot be fetched')
      //   }
      // }
      // else {
      //   logger.error('User plans cannot be fetched')
      //   throw new ApiError(INTERNAL_SERVER_ERROR, 'User plans cannot be fetched')
      // }
    }
    catch(err) {
      next(err)
    }
  }
)