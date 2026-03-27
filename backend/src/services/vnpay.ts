import crypto from 'crypto';

const tmnCode = process.env.VNPAY_MERCHANT_ID || '';
const secretKey = process.env.VNPAY_SECRET_KEY || '';
const apiUrl = process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn';
const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/orders/vnpay/callback';

const sortObject = (obj: Record<string, string>) => {
  const sorted: Record<string, string> = {};
  Object.keys(obj)
    .sort()
    .forEach((k) => (sorted[k] = obj[k]));
  return sorted;
};

const hmacSHA512 = (data: string) => crypto.createHmac('sha512', secretKey).update(data).digest('hex');

export const createPaymentUrl = (txnRef: string, amount: number, ipAddr: string, orderInfo: string): string => {
  const amountVnp = Math.round(amount * 100);
  const now = new Date();
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const createDate = `${y}${m}${d}${hh}${mm}${ss}`;
  const expireDate = `${y}${m}${d}${pad(now.getHours() + 1)}${mm}${ss}`;
  const params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: amountVnp.toString(),
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: ipAddr,
    vnp_Locale: 'vn',
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: returnUrl,
    vnp_TxnRef: txnRef,
    vnp_ExpireDate: expireDate,
  };
  const sorted = sortObject(params);
  const signData = Object.keys(sorted)
    .map((k) => `${k}=${sorted[k]}`)
    .join('&');
  const secureHash = hmacSHA512(signData);
  const query = Object.keys(sorted)
    .map((k) => `${k}=${encodeURIComponent(sorted[k])}`)
    .join('&');
  const url = `${apiUrl}/paymentv2/vpcpay.html?${query}&vnp_SecureHash=${secureHash}`;
  return url;
};

export const verifyCallback = (query: Record<string, string>) => {
  const { vnp_SecureHash, ...rest } = query;
  const sorted = sortObject(rest);
  const signData = Object.keys(sorted)
    .map((k) => `${k}=${sorted[k]}`)
    .join('&');
  const secureHash = hmacSHA512(signData);
  return secureHash === vnp_SecureHash;
};
