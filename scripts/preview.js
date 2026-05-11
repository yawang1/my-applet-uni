const ci = require('miniprogram-ci');
const path = require('path');
const fs = require('fs');

// 从环境变量读取
const appid = 'wx528cb3a33a5fd6cf';
let privateKeyPath = process.env.WECHAT_PRIVATE_KEY_PATH; 

// 如果是 GitHub Actions 环境，自动将 Base64 还原为临时密钥文件
if (process.env.WECHAT_PRIVATE_KEY_BASE64 && !fs.existsSync(privateKeyPath)) {
  console.log('检测到 Base64 密钥，正在写入临时文件...');
  const keyContent = Buffer.from(process.env.WECHAT_PRIVATE_KEY_BASE64, 'base64').toString('utf8');
  privateKeyPath = path.join(process.env.RUNNER_TEMP, 'private.key'); 
  fs.writeFileSync(privateKeyPath, keyContent);
}

console.log('使用密钥路径:', privateKeyPath);

const project = new ci.Project({
  appid: appid,
  type: 'miniProgram',
  projectPath: path.resolve(__dirname, '../dist/build/mp-weixin'), 
  privateKeyPath: privateKeyPath,
  ignores: ['node_modules/**/*'],
});

(async () => {
  try {
    const previewResult = await ci.preview({
      project,
      desc: `CI预览-${new Date().toLocaleTimeString()}`,
      setting: { es6: true },
      qrcodeFormat: 'image',
      qrcodeOutputDest: path.resolve(__dirname, '../preview-qrcode.jpg'),
    });
    console.log('✅ 预览二维码生成成功！');
  } catch (error) {
    console.error('❌ 生成预览失败:', error);
    process.exit(1);
  }
})();