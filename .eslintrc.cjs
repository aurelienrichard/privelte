module.exports = {
	root: true,
	extends: ['@repo/eslint-config'],
	parserOptions: {
		project: true
	},
	ignorePatterns: ['supabase/functions'],
	rules: {
		'no-console': ['warn', { allow: ['error'] }]
	}
}
