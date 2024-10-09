export interface Payload {
	type: 'payload'
	message: string
	userId: string
	username: string
	id: string
}

export interface Presence {
	type: 'presence'
	username: string
	event: 'joined' | 'left'
	id: string
}
