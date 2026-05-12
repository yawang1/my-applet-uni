<script>
	export default {
		onLaunch() {
			//  #ifdef MP-WEIXIN 
			console.log('我是微信小程序特定的条件编译，只有在微信小程序环境下才会执行。')
			// #endif
		}
	}
</script>

<style>
	page {
		min-height: 100%;
		background: linear-gradient(180deg, #fff7ef 0%, #ffe7d1 100%);
	}

	view,
	text {
		box-sizing: border-box;
	}
</style>