<template>
  <view class="page">
    <view class="hero">
      <text class="title">今天吃什么</text>
      <text class="subtitle">点一下转盘，让它帮你做决定</text>
    </view>

    <view class="wheel-panel">
      <view class="pointer"></view>
      <view class="wheel-wrap" @click="startSpin">
        <view class="wheel" :style="wheelStyle">
          <view
            v-for="item in dividers"
            :key="item.key"
            class="divider"
            :style="item.style"
          ></view>
          <view
            v-for="item in labels"
            :key="item.name"
            class="label"
            :style="item.style"
          >
            <text :style="item.textStyle">{{ item.name }}</text>
          </view>
        </view>
        <view class="center-button">
          <text class="center-main">{{ spinning ? '转动中' : '开始' }}</text>
          <text class="center-sub">{{ spinning ? '请稍候' : '点击转盘' }}</text>
        </view>
      </view>
    </view>

    <view class="action-row">
      <view class="primary-button" @click="startSpin">
        <text>{{ spinning ? '转盘转动中...' : '再摇一次' }}</text>
      </view>
    </view>

    <view class="result-card">
      <text class="result-label">上次抽中</text>
      <text class="result-value">{{ lastResult || '还没决定好，先转一下吧' }}</text>
    </view>

    <view class="foods-card">
      <text class="foods-title">今日候选菜单</text>
      <view class="foods-list">
        <text v-for="food in foods" :key="food" class="food-tag">{{ food }}</text>
      </view>
    </view>
  </view>
</template>

<script>
const FOOD_OPTIONS = ['火锅', '麻辣烫', '烤肉', '肯德基', '黄焖鸡', '寿司', '臊子面', '炸鸡']
const SEGMENT_COLORS = ['#ffb37a', '#ffd166', '#95d5b2', '#7bdff2', '#b8c0ff', '#ffc6ff', '#f4a261', '#caffbf']
const SPIN_DURATION = 4200

export default {
  data() {
    return {
      foods: FOOD_OPTIONS,
      colors: SEGMENT_COLORS,
      spinning: false,
      rotation: 0,
      lastResult: '',
      spinTimer: null
    }
  },
  computed: {
    wheelStyle() {
      const transition = this.spinning
        ? `transform ${SPIN_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
        : 'none'
      return `background: ${this.wheelBackground}; transform: rotate(${this.rotation}deg); transition: ${transition};`
    },
    wheelBackground() {
      const angle = 360 / this.foods.length
      const parts = this.colors.map((color, index) => {
        const start = angle * index
        const end = angle * (index + 1)
        return `${color} ${start}deg ${end}deg`
      })
      return `conic-gradient(${parts.join(', ')})`
    },
    labels() {
      const angle = 360 / this.foods.length
      return this.foods.map((food, index) => {
        const rotate = angle * index + angle / 2
        return {
          name: food,
          style: `transform: translateX(-50%) rotate(${rotate}deg);`,
          textStyle: `transform: rotate(${-rotate}deg);`
        }
      })
    },
    dividers() {
      const angle = 360 / this.foods.length
      return this.foods.map((food, index) => ({
        key: `${food}-${index}`,
        style: `transform: translateX(-50%) rotate(${angle * index}deg);`
      }))
    }
  },
  onUnload() {
    this.clearSpinTimer()
  },
  beforeDestroy() {
    this.clearSpinTimer()
  },
  methods: {
    startSpin() {
      if (this.spinning) {
        return
      }

      const segmentAngle = 360 / this.foods.length
      const targetIndex = Math.floor(Math.random() * this.foods.length)
      const targetFood = this.foods[targetIndex]
      const targetCenterAngle = targetIndex * segmentAngle + segmentAngle / 2
      const currentAngle = ((this.rotation % 360) + 360) % 360
      const stopAngle = (360 - targetCenterAngle + 360) % 360
      const adjustAngle = (stopAngle - currentAngle + 360) % 360
      const extraRounds = 360 * 6

      this.spinning = true
      this.rotation += extraRounds + adjustAngle
      this.clearSpinTimer()
      this.spinTimer = setTimeout(() => {
        this.spinning = false
        this.lastResult = targetFood
        uni.showModal({
          title: '今天吃这个',
          content: `转到 ${targetFood} 啦，出发！`,
          showCancel: false,
          confirmText: '好耶'
        })
      }, SPIN_DURATION)
    },
    clearSpinTimer() {
      if (this.spinTimer) {
        clearTimeout(this.spinTimer)
        this.spinTimer = null
      }
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 36rpx 28rpx 60rpx;
}

.hero {
  padding: 18rpx 8rpx 24rpx;
}

.title {
  display: block;
  color: #8f3d13;
  font-size: 56rpx;
  font-weight: 700;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  color: #b46837;
  font-size: 28rpx;
}

.wheel-panel {
  position: relative;
  margin-top: 18rpx;
  padding: 56rpx 20rpx 28rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24rpx 60rpx rgba(196, 108, 52, 0.12);
}

.pointer {
  position: absolute;
  top: 16rpx;
  left: 50%;
  margin-left: -20rpx;
  width: 0;
  height: 0;
  border-left: 20rpx solid transparent;
  border-right: 20rpx solid transparent;
  border-top: 40rpx solid #ff6f3c;
  z-index: 3;
}

.wheel-wrap {
  position: relative;
  width: 620rpx;
  height: 620rpx;
  margin: 0 auto;
}

.wheel {
  position: relative;
  width: 100%;
  height: 100%;
  border: 16rpx solid #fff3ea;
  border-radius: 50%;
  transform-origin: center center;
  box-shadow: inset 0 0 0 12rpx rgba(255, 255, 255, 0.55), 0 16rpx 40rpx rgba(196, 108, 52, 0.16);
}

.divider {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8rpx;
  height: 280rpx;
  margin-top: -280rpx;
  margin-left: -4rpx;
  transform-origin: center 280rpx;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 999rpx;
  box-shadow: 0 0 10rpx rgba(255, 255, 255, 0.8);
}

.label {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 180rpx;
  margin-top: -250rpx;
  transform-origin: center 250rpx;
  text-align: center;
}

.label text {
  display: inline-block;
  min-width: 112rpx;
  padding: 8rpx 14rpx;
  color: #7a3515;
  font-size: 26rpx;
  font-weight: 700;
  text-align: center;
  background: rgba(255, 255, 255, 0.72);
  border: 2rpx solid rgba(255, 255, 255, 0.92);
  border-radius: 999rpx;
}

.center-button {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 172rpx;
  height: 172rpx;
  border-radius: 50%;
  background: linear-gradient(180deg, #ff8e53 0%, #ff6f3c 100%);
  box-shadow: 0 16rpx 32rpx rgba(255, 111, 60, 0.28);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
}

.center-main {
  font-size: 34rpx;
  font-weight: 700;
}

.center-sub {
  margin-top: 6rpx;
  font-size: 22rpx;
}

.action-row {
  margin-top: 28rpx;
}

.primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 92rpx;
  border-radius: 999rpx;
  background: #ff6f3c;
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  box-shadow: 0 12rpx 24rpx rgba(255, 111, 60, 0.22);
}

.result-card,
.foods-card {
  margin-top: 24rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 16rpx 40rpx rgba(196, 108, 52, 0.08);
}

.result-label,
.foods-title {
  display: block;
  color: #b46837;
  font-size: 24rpx;
}

.result-value {
  display: block;
  margin-top: 14rpx;
  color: #7a3515;
  font-size: 34rpx;
  font-weight: 700;
}

.foods-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 20rpx;
}

.food-tag {
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background: #fff1e7;
  color: #a55325;
  font-size: 26rpx;
}
</style>
