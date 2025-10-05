export function slugify(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // replace spaces & special chars with hyphen
		.replace(/^-+|-+$/g, ""); // trim starting/ending hyphens
}
