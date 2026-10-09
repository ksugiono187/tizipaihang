const fs = require('fs');
const path = require('path');

const coupons = {
  '微风网络-breezenet': 'weifeng90',
  '飞猫云': 'flycat888',
  '无忧链接': 'wuyou666',
  '闪跃-flashleap': 'shanyue',
  'firefly机场': 'firefly',
  '灵猫': 'nmw888',
  // '机场查' -> let's try to find it
  '隐形人': 'rabbit',
  'u1s1-有一说一': 'U1S1',
  '光年梯': 'tt88',
  '宇宙云-yuzhou': 'YUZHOU553'
};

const dir = path.join(__dirname, 'src/content/brands');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const baseName = file.replace('.md', '');
  const coupon = coupons[baseName];
  if (coupon) {
    let p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf-8');
    
    // Check if it already has couponCode
    if (content.includes('couponCode:')) {
      content = content.replace(/couponCode:\s*.*?\n/, `couponCode: ${coupon}\n`);
    } else {
      // Insert right after link:
      content = content.replace(/link:\s*.*?\n/, `$&couponCode: ${coupon}\ncouponDesc: 专属优惠\n`);
    }
    fs.writeFileSync(p, content);
    console.log(`Updated coupon for ${baseName} -> ${coupon}`);
  }
});
