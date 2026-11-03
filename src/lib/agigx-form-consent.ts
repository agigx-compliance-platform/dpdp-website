/**
 * Anonymous form consent (see consent-management-service/docs/plan/ANONYMOUS_FORM_CONSENT_PLAN.md).
 *
 * The SDK renders unticked checkbox cards inside [data-agigx-form-consent="<journeyKey>"].
 * Nothing is sent to Agigx until the host form has been submitted successfully; then we call
 * submitFormConsent, which records ACCEPTED only for the ticked purposes, keyed to the email.
 */

export const CONTACT_FORM_JOURNEY_KEY =
  process.env.NEXT_PUBLIC_CONTACT_CONSENT_JOURNEY_KEY?.trim() || 'contact_us'

type FormConsentIdentity = { type: 'EMAIL' | 'PHONE'; value: string }

type SubmitFormConsentOptions = {
  container?: string | Element
  journeyKey?: string
  identity?: FormConsentIdentity
  formSubmissionRef?: string
}

type AgigxConsentGateApi = {
  submitFormConsent?: (opts: SubmitFormConsentOptions) => Promise<unknown>
}

function getGate(): AgigxConsentGateApi | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as unknown as { AgigxConsentGate?: AgigxConsentGateApi }).AgigxConsentGate
}

/**
 * Record the ticked form-consent purposes for an anonymous visitor.
 * Never throws: consent failures must not block the enquiry "thank you" state
 * (the SDK keeps a retry outbox).
 */
export async function recordFormConsent(opts: SubmitFormConsentOptions): Promise<void> {
  const gate = getGate()
  if (!gate?.submitFormConsent) {
    console.warn('[agigx] form consent mode not available in the loaded SDK; consent not recorded')
    return
  }
  try {
    await gate.submitFormConsent(opts)
  } catch (err) {
    console.warn('[agigx] form consent was not recorded', err)
  }
}
