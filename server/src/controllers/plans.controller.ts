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
          const sqlData = await sqlQuery('CALL get_all_features_or_tiers(0)')
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
        const sqlData = await sqlQuery('CALL get_all_features_or_tiers(0)')
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
          const sqlData = await sqlQuery('CALL get_all_features_or_tiers(1)')
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
        const sqlData = await sqlQuery('CALL get_all_features_or_tiers(1)')
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

export const startTrial = asyncHandler(
  async (req, res, next) => {
    try {
      type RequestData = { __verifiedData: AccessTokenPayload }
      const reqData = req.body
      const { __verifiedData }: RequestData = reqData
      
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
      
      
      sqlQuery('CALL purchase_plan(?, ?, ?)', [subscription, __verifiedData.userid, JSON.stringify(data)])
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
      type SubscriptionHistoryType = {
        [key: string]: ({
          subId: number,
          subStatus: 'Trial',
          startDate: Date,
          endDate: Date,
          userStatus: 'Active' | 'Pending' | 'Cancelled' | 'Expired',
        } | {
          subId: number,
          subStatus: 'Monthly' | 'Yearly',
          tierId: number,
          paymentDate: Date,
          startDate?: Date,
          endDate?: Date,
          userStatus: 'Active' | 'Pending' | 'Cancelled' | 'Expired' | 'Ongoing',
        })[]
      }

      const reqData = req.body
      const { __verifiedData }: RequestData = reqData
      
      const sqlData = await sqlQuery('CALL get_all_user_plans(?)', [__verifiedData.userid])
      if (sqlData instanceof Array) {
        const [result] = sqlData
        const results: {
          id: number,
          module_id: string,
          tier_id: number,
          payment_date: Date | null,
          start_date: Date | null,
          end_date: Date | null,
          sub_status: 'Trial' | 'Monthly' | 'Yearly',
          user_status: 'Active' | 'Pending' | 'Cancelled' | 'Expired' | 'Ongoing'
        }[] = result.map(r => ({
          id: r.id,
          module_id: r.module_id,
          tier_id: r.tier_id,
          payment_date: r.payment_date,
          start_date: r.start_date,
          end_date: r.end_date,
          sub_status: r.sub_status,
          user_status: r.user_status
        }))

        const finalData: SubscriptionHistoryType = {}

        results.forEach(r => {
          const moduleId = r.module_id;

          // Initialize the array for this module_id if it doesn’t exist
          if (!finalData[moduleId]) {
            finalData[moduleId] = [];
          }

          if (r.sub_status === 'Trial') {
            // Trial entry
            finalData[moduleId].push({
              subId: r.id,
              subStatus: 'Trial',
              startDate: r.start_date!,
              endDate: r.end_date!,
              userStatus: r.user_status as 'Active' | 'Pending' | 'Cancelled' | 'Expired',
            });
          } else {
            // Subscription entry (Monthly or Yearly)
            finalData[moduleId].push({
              subId: r.id,
              subStatus: r.sub_status as 'Monthly' | 'Yearly',
              tierId: r.tier_id,
              paymentDate: r.payment_date!,
              startDate: r.start_date!,
              endDate: r.end_date!,
              userStatus: r.user_status as 'Active' | 'Pending' | 'Cancelled' | 'Expired' | 'Ongoing',
            });
          }
        });

        res.status(OK).json(new ApiResponse(OK, [finalData], 'User plans fetched successfully'))
      }
      else {
        logger.error('User plans cannot be fetched')
        throw new ApiError(INTERNAL_SERVER_ERROR, 'User plans cannot be fetched')
      }
    }
    catch(err) {
      next(err)
    }
  }
)