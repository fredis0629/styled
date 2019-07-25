const styled = require('./index.js');
const css = styled.css;

test('empty styled without params', () => {
	expect(() => styled()``()).toThrowError('Wrong extended element');
});

test('styled div without params', () => {
	expect(styled.div``()).toBe('');
});

test('styled with simple css', () => {
	expect(
		styled.button`
			color: red;
		`()
	).toBe('color: red;');
});

test('styled with multiple line css', () => {
	expect(
		styled.a`
			color: white;
			background: black;
		`()
	).toBe('color: white;background: black;');
});

test('styled with query', () => {
	const styledColor = styled.button`
		color: ${argument => argument.color || 'red'};
	`;

	expect(
		styledColor({ color: 'blue' })
	).toBe('color: blue;');

	expect(
		styledColor()
	).toBe('color: red;');
});

test('styled with query multiline', () => {
	const styledColor = styled.a`
		color: ${argument => argument.color || 'red'};
		background: ${argument => argument.bg || 'white'};
	`;

	expect(
		styledColor({ color: 'blue' })
	).toBe('color: blue;background: white;');

	expect(
		styledColor()
	).toBe('color: red;background: white;');
});

test('extended styled', () => {
	const styledColor = styled.a`
		color: ${argument => argument.color || 'red'};
	`;

	const styledColorWithBackground = styled(styledColor)`
		background: ${argument => argument.bg || 'white'};
	`;

	expect(
		styledColorWithBackground({ color: 'blue' })
	).toBe('color: blue;background: white;');

	expect(
		styledColorWithBackground({ color: 'yellow', bg: 'blue' })
	).toBe('color: yellow;background: blue;');

	expect(
		styledColorWithBackground()
	).toBe('color: red;background: white;');
});


test('mixin', () => {
	const textAlign = css`
		text-align: ${argument => argument.align || 'center'};
	`;

	const font = css`
		font-family: Arial;
	`;

	const styledText = styled.div`
		${textAlign};
		${font};
	`;

	expect(
		styledText({ align: 'left' })
	).toBe('text-align: left;font-family: Arial;');

	expect(
		styledText({ color: 'yellow', bg: 'blue' })
	).toBe('text-align: center;font-family: Arial;');
});

test('extended styled without duplication', () => {
	const styledColor = styled.a`
		color: black;
	`;

	const extendedStyledColor = styled(styledColor)`
		${argument => argument.color && css`
			color: ${argument.color};
		`};
	`;

	expect(
		extendedStyledColor()
	).toBe('color: black;');

	expect(
		extendedStyledColor({ color: 'blue' })
	).toBe('color: blue;');
});