import { z } from 'zod'

const SessionSchema = z.object({
  sessionid: z.number().positive().int(),
  userid: z.number().positive().int(),
  useragent: z.string(),
  expires: z.coerce.date()
})

export default SessionSchema