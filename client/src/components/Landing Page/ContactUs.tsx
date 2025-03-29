import { forwardRef } from "react"
import { emptyProps } from "../../types"
// import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6"
import { motion } from "framer-motion"
import { formatPhoneNumberIntl, isValidPhoneNumber } from "react-phone-number-input"
import * as EmailValidator from 'email-validator'

export default forwardRef<HTMLDivElement, emptyProps>(function ContactUs(props, ref) {
  const env = import.meta.env
  const defaultph = '+XX XXXXX XXXXX'
  return (
    <section id='contact' className="min-h-screen text-text flex items-center justify-center flex-col text-center" ref={ref}>
      <h1 className="section-header">Contact Us</h1>
      <div className="section-body">
        <div className="*:font-source-serif mb-8">
          <p>Need any help or support? Don't worry</p>
          <p>We are always there for you 24x7</p>
        </div>
        <div className="*:flex *:justify-between *:mb-1">
          <motion.a
            className={isValidPhoneNumber(env.VITE_PHONE_NUMBER ?? '') ? '' : "pointer-events-none"}
            href={isValidPhoneNumber(env.VITE_PHONE_NUMBER ?? '') ? `tel:${env.VITE_PHONE_NUMBER}` : '/'}
            target='_blank'
            whileHover={{
              scale: isValidPhoneNumber(env.VITE_PHONE_NUMBER ?? '') ? 1.05 : 1
            }}
          >
            <div>Mobile No.</div><div>{isValidPhoneNumber(env.VITE_PHONE_NUMBER ?? '') ? formatPhoneNumberIntl(env.VITE_PHONE_NUMBER ?? '') : defaultph}</div>
          </motion.a>
          <motion.a
            className={EmailValidator.validate(env.VITE_EMAIL_ADDRESS) ? '' : "pointer-events-none"}
            href={EmailValidator.validate(env.VITE_EMAIL_ADDRESS) ? `mailto:${env.VITE_EMAIL_ADDRESS}` : '/'}
            target="_blank"
            whileHover={{
              scale: EmailValidator.validate(env.VITE_EMAIL_ADDRESS) ? 1.05 : 1
            }}
          >
            <div>Email</div><div>{EmailValidator.validate(env.VITE_EMAIL_ADDRESS) ? env.VITE_EMAIL_ADDRESS : 'example@gmail.com'}</div>
          </motion.a>
          {
            env.VITE_WHATSAPP_NUMBER &&
            <motion.a
              className={isValidPhoneNumber(env.VITE_WHATSAPP_NUMBER ?? '') ? '' : "pointer-events-none"}
              href={isValidPhoneNumber(env.VITE_WHATSAPP_NUMBER ?? '') ? `https://wa.me/${env.VITE_WHATSAPP_NUMBER}` : '/'}
              target="_blank"
              whileHover={{
                scale: isValidPhoneNumber(env.VITE_WHATSAPP_NUMBER ?? '') ? 1.05 : 1
              }}
            >
              <div>WhatsApp</div><div>{isValidPhoneNumber(env.VITE_WHATSAPP_NUMBER ?? '') ? formatPhoneNumberIntl(env.VITE_WHATSAPP_NUMBER ?? '') : defaultph}</div>
            </motion.a>
          }
        </div>

        { /* Uncomment when there will be social media platform */ }

        {/* <div className="mt-7">
          <p className="font-source-serif mb-1">Also you can connect with us at:</p>
          <div className="flex items-center flex-col md:flex-row gap-1 md:gap-4 *:flex *:items-center *:gap-1">
            <motion.a
              className={(env.VITE_FACEBOOK_PROFILE === undefined || env.VITE_FACEBOOK_PROFILE.trim() === '') ? 'pointer-events-none' : ''}
              whileHover={{
                scale: (env.VITE_FACEBOOK_PROFILE === undefined || env.VITE_FACEBOOK_PROFILE.trim() === '') ? 1 : 1.05
              }}
              href={(env.VITE_FACEBOOK_PROFILE === undefined || env.VITE_FACEBOOK_PROFILE.trim() === '') ? '/' : `https://www.facebook.com/${env.VITE_FACEBOOK_PROFILE}`}
              target="_blank"
            >
              <FaFacebookF style={{marginBottom: '5px'}} />/ {env.VITE_FACEBOOK_PROFILE ?? '-handle'}
            </motion.a>
            <motion.a
              className={(env.VITE_INSTAGRAM_PROFILE === undefined || env.VITE_INSTAGRAM_PROFILE.trim() === '') ? 'pointer-events-none' : ''}
              whileHover={{
                scale: (env.VITE_INSTAGRAM_PROFILE === undefined || env.VITE_INSTAGRAM_PROFILE.trim() === '') ? 1 : 1.05
              }}
              href={(env.VITE_INSTAGRAM_PROFILE === undefined || env.VITE_INSTAGRAM_PROFILE.trim() === '') ? '/' : `https://www.instagram.com/${env.VITE_INSTAGRAM_PROFILE}`}
              target="_blank"
            >
              <FaInstagram />/ {env.VITE_INSTAGRAM_PROFILE ?? '-handle'}
            </motion.a>
            <motion.a
              className={(env.VITE_X_PROFILE === undefined || env.VITE_X_PROFILE.trim() === '') ? 'pointer-events-none' : ''}
              whileHover={{
                scale: (env.VITE_X_PROFILE === undefined || env.VITE_X_PROFILE.trim() === '') ? 1 : 1.05
              }}
              href={(env.VITE_X_PROFILE === undefined || env.VITE_X_PROFILE.trim() === '') ? '/' : `https://www.x.com/${env.VITE_X_PROFILE}`}
              target='_blank'
            >
              <FaXTwitter />/ {env.VITE_X_PROFILE ?? '-handle'}
            </motion.a>
          </div>
        </div> */}
      </div>
    </section>
  )
})