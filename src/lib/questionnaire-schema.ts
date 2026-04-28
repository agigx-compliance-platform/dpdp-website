import { z } from 'zod'

export const step1Schema = z.object({
  role: z.string().min(1, 'Please select your role'),
})

export const step2Schema = z.object({
  orgType: z.string().min(1, 'Please select your organization type'),
})

export const step3Schema = z.object({
  journeyStage: z.string().min(1, 'Please select your journey stage'),
})

export const step4Schema = z.object({
  dataTypes: z.array(z.string()).min(1, 'Select at least one data type'),
})

export const step5Schema = z.object({
  priorities: z
    .array(z.string())
    .min(1, 'Select at least one priority')
    .max(3, 'Select up to 3 priorities'),
})

export const step6Schema = z.object({
  supportType: z.array(z.string()).min(1, 'Select at least one support type'),
})

export const step7Schema = z.object({
  wantsScan: z.boolean(),
})

export const step8Schema = z.object({
  websiteUrl: z.string().url('Please enter a valid URL'),
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company name is required'),
})

export const step9Schema = z.object({
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to proceed' }),
  }),
})

export const questionnaireSchema = z.object({
  role: z.string().min(1),
  orgType: z.string().min(1),
  journeyStage: z.string().min(1),
  dataTypes: z.array(z.string()).min(1),
  priorities: z.array(z.string()).min(1).max(3),
  supportType: z.array(z.string()).min(1),
  wantsScan: z.boolean(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  name: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  consentGiven: z.boolean(),
})

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>

export const stepSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
] as const
