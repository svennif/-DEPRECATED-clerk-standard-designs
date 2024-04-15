(function (w, d) {
  var e = d.createElement('script'); e.type = 'text/javascript'; e.async = true;
  e.src = 'https://cdn.clerk.io/clerk.js';
  var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
  w.__clerk_q = w.__clerk_q || []; w.Clerk = w.Clerk || function () { w.__clerk_q.push(arguments) };
})(window, document);

analytics.subscribe('clerk_pixel_context', (event) => {
	browser.localStorage.setItem('clerkPixelContext', JSON.stringify(event.customData))
})

analytics.subscribe('checkout_completed', async (event) => {
	const pixelContextRaw = await browser.localStorage.getItem('clerkPixelContext')
	const pixelContext = await JSON.parse(pixelContextRaw)
	const checkout = event.data.checkout
	fetch(`https://api.clerk.io/v2/log/sale/shopify`, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({
			sale: checkout.order.id,
			key: pixelContext.localeApiKey,
		}),
	})
})
