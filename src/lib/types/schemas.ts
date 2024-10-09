import { z } from 'zod'

export const newMessageSchema = z.object({
	id: z.string().length(21),
	message: z.string().min(1).max(1000)
})

export const newUserSchema = z.object({
	username: z.string().min(3).max(20)
})

export const newRoomSchema = z.object({
	id: z.string(),
	slots: z.coerce.number().min(2).max(10)
})
