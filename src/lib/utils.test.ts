import { test, expect, describe } from 'vitest'
import { isValidId } from './utils'

describe('isValidId', () => {
	const adjectives = ['happy', 'sad', 'angry']
	const animals = ['cat', 'dog', 'bird']

	test('should return true for a valid ID', () => {
		const id = 'happy-cat-100'
		expect(isValidId(id, adjectives, animals)).toBe(true)
	})

	test('should return false if part of the ID is missing', () => {
		const id = 'happy-100'
		expect(isValidId(id, adjectives, animals)).toBe(false)
	})

	test('should return false if the adjective is not in the list', () => {
		const id = 'excited-cat-100'
		expect(isValidId(id, adjectives, animals)).toBe(false)
	})

	test('should return false if the animal is not in the list', () => {
		const id = 'happy-elephant-100'
		expect(isValidId(id, adjectives, animals)).toBe(false)
	})

	test('should false if the number is not a number', () => {
		const id = 'happy-cat-not100'
		expect(isValidId(id, adjectives, animals)).toBe(false)
	})

	test('should return false if the number is not in the 3 digit range', () => {
		const id = 'happy-cat-1000'
		expect(isValidId(id, adjectives, animals)).toBe(false)
	})
})
