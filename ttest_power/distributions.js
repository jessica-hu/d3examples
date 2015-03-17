// Generated by CoffeeScript 1.9.1
var betinc, dnct, dnorm, dt, erf, erfcinv, lgamma, pbeta, pnct, pnorm, pt, qnorm, qt;

lgamma = function(z) {
  var s;
  s = 1 + 76.18009173 / z - 86.50532033 / (z + 1) + 24.01409822 / (z + 2) - 1.231739516 / (z + 3) + 0.00120858003 / (z + 4) - 0.00000536382 / (z + 5);
  return (z - 0.5) * Math.log(z + 4.5) - (z + 4.5) + Math.log(s * 2.50662827465);
};

betinc = function(x, a, b, tol) {
  var a0, a1, a2, b0, b1, c9, m9;
  if (tol == null) {
    tol = 1e-8;
  }
  a0 = 0;
  b0 = 1;
  a1 = 1;
  b1 = 1;
  m9 = 0;
  a2 = 0;
  while (Math.abs((a1 - a2) / a1) > tol) {
    a2 = a1;
    c9 = -(a + m9) * (a + b + m9) * x / (a + 2 * m9) / (a + 2 * m9 + 1);
    a0 = a1 + c9 * a0;
    b0 = b1 + c9 * b0;
    m9 = m9 + 1;
    c9 = m9 * (b - m9) * x / (a + 2 * m9 - 1) / (a + 2 * m9);
    a1 = a0 + c9 * a1;
    b1 = b0 + c9 * b1;
    a0 = a0 / b1;
    b0 = b0 / b1;
    a1 = a1 / b1;
    b1 = 1;
  }
  return a1 / a;
};

erf = function(x) {
  var cof, d, dd, isneg, j, res, t, tmp, ty;
  cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2, -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4, 4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6, 1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8, 6.529054439e-9, 5.059343495e-9, -9.91364156e-10, -2.27365122e-10, 9.6467911e-11, 2.394038e-12, -6.886027e-12, 8.94487e-13, 3.13092e-13, -1.12708e-13, 3.81e-16, 7.106e-15, -1.523e-15, -9.4e-17, 1.21e-16, -2.8e-17];
  j = cof.length - 1;
  isneg = false;
  d = 0;
  dd = 0;
  if (x < 0) {
    x = -x;
    isneg = true;
  }
  t = 2 / (2 + x);
  ty = 4 * t - 2;
  while (j > 0) {
    tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
    j -= 1;
  }
  res = t * Math.exp(-x * x + 0.5 * (cof[0] + ty * d) - dd);
  if (isneg) {
    return res - 1;
  }
  return 1 - res;
};

erfcinv = function(p) {
  var err, j, pp, t, x;
  j = 0;
  if (p >= 2) {
    return -100;
  }
  if (p <= 0) {
    return 100;
  }
  pp = p < 1 ? p : 2 - p;
  t = Math.sqrt(-2 * Math.log(pp / 2));
  x = -0.70711 * ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t);
  while (j < 2) {
    err = 1 - erf(x) - pp;
    x += err / (1.12837916709551257 * Math.exp(-x * x) - x * err);
    j += 1;
  }
  if (p < 1) {
    return x;
  }
  return -x;
};

pbeta = function(x, a, b, tol) {
  var bt, s;
  if (tol == null) {
    tol = 1e-8;
  }
  if (a <= 0 || b <= 0) {
    console.log("pbeta: a and b must be positive");
    return null;
  }
  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }
  s = a + b;
  bt = Math.exp(lgamma(s) - lgamma(b) - lgamma(a) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (s + 2)) {
    return bt * betinc(x, a, b, tol);
  }
  return 1 - bt * betinc(1 - x, b, a, tol);
};

dnorm = function(x, mu, sd) {
  var xval;
  if (mu == null) {
    mu = 0;
  }
  if (sd == null) {
    sd = 1;
  }
  x = parseFloat(x);
  mu = parseFloat(mu);
  sd = parseFloat(sd);
  if (sd <= 0) {
    console.log("dnorm: sd must be positive");
    return null;
  }
  if (Array.isArray(x)) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = x.length; i < len; i++) {
        xval = x[i];
        results.push(dnorm(xval, mu, sd));
      }
      return results;
    })();
  }
  return Math.exp(-0.5 * Math.pow((x - mu) / sd, 2)) / (sd * Math.sqrt(2 * Math.PI));
};

pnorm = function(x, mu, sd) {
  var xval, z;
  if (mu == null) {
    mu = 0;
  }
  if (sd == null) {
    sd = 1;
  }
  x = parseFloat(x);
  mu = parseFloat(mu);
  sd = parseFloat(sd);
  if (sd <= 0) {
    console.log("pnorm: sd must be positive");
    return null;
  }
  if (Array.isArray(x)) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = x.length; i < len; i++) {
        xval = x[i];
        results.push(dnorm(xval, mu, sd));
      }
      return results;
    })();
  }
  z = (x - mu) / sd;
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

qnorm = function(p, mu, sd) {
  var pval, z;
  if (mu == null) {
    mu = 0;
  }
  if (sd == null) {
    sd = 1;
  }
  p = parseFloat(p);
  mu = parseFloat(mu);
  sd = parseFloat(sd);
  if (sd <= 0) {
    console.log("qnorm: sd must be positive");
    return null;
  }
  if (p <= 0 || p >= 1) {
    console.log("qnorm: p must be in (0,1)");
    return null;
  }
  if (Array.isArray(p)) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = p.length; i < len; i++) {
        pval = p[i];
        results.push(qnorm(pval, mu, sd));
      }
      return results;
    })();
  }
  z = -1.41421356237309505 * erfcinv(2 * p);
  return z * sd + mu;
};

dt = function(x, df) {
  var ldt, xval;
  x = parseFloat(x);
  df = parseFloat(df);
  if (df <= 0) {
    console.log("dt: df must be positive");
    return null;
  }
  if (Array.isArray(x)) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = x.length; i < len; i++) {
        xval = x[i];
        results.push(dt(xval, df));
      }
      return results;
    })();
  }
  ldt = lgamma((df + 1) / 2) - 0.5 * Math.log(df * Math.PI) - lgamma(df / 2) - ((df + 1) / 2) * Math.log(1 + x * x / df);
  return Math.exp(ldt);
};

pt = function(x, df) {
  var xval, y;
  x = parseFloat(x);
  df = parseFloat(df);
  if (df <= 0) {
    console.log("dt: df must be positive");
    return null;
  }
  if (Array.isArray(x)) {
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = x.length; i < len; i++) {
        xval = x[i];
        results.push(pt(xval, df));
      }
      return results;
    })();
  }
  if (x === 0) {
    return 0.5;
  }
  y = 0.5 * pbeta(df / (x * x + df), df / 2, 1 / 2);
  if (x < 0) {
    return y;
  }
  return 1 - y;
};

qt = function(p, df, hi, tol) {
  var lo, quant;
  if (hi == null) {
    hi = 5;
  }
  if (tol == null) {
    tol = 0.0001;
  }
  p = parseFloat(p);
  df = parseFloat(df);
  if (df <= 0) {
    console.log("qt: df must be positive");
    return null;
  }
  if (p <= 0 || p >= 1) {
    console.log("qt: p must be in (0,1)");
    return null;
  }
  lo = qnorm(p);
  while (pt(hi, df) <= p) {
    lo = hi;
    hi += 1;
  }
  quant = (hi + lo) / 2;
  while (hi - lo > tol) {
    if (pt(quant, df) > p) {
      hi = quant;
    } else {
      lo = quant;
    }
    quant = (hi + lo) / 2;
  }
  return quant;
};

pnct = function(x, df, ncp, tol) {
  var flip, j, p, prob, q, tmp, val, y;
  if (tol == null) {
    tol = 1e-14;
  }
  x = parseFloat(x);
  df = parseFloat(df);
  ncp = parseFloat(ncp);
  if (df <= 0) {
    console.log("pnct: df must be positive");
    return null;
  }
  if (ncp === 0) {
    return pt(x, df);
  }
  flip = x < 0;
  if (x < 0) {
    ncp = -ncp;
  }
  prob = pnorm(-ncp);
  j = 0;
  val = tol + 1;
  y = x * x / (x * x + df);
  while (val > tol) {
    tmp = ncp * ncp / 2;
    tmp = -tmp + j * Math.log(tmp);
    p = Math.exp(tmp - lgamma(j + 1));
    q = ncp * Math.exp(tmp - 0.5 * Math.log(2) - lgamma(j + 1.5));
    val = p * pbeta(y, j + 0.5, df / 2) + q * pbeta(y, j + 1, df / 2);
    prob += 0.5 * val;
    j += 1;
  }
  if (flip) {
    return 1 - prob;
  }
  return prob;
};

dnct = function(x, df, ncp, tol) {
  if (tol == null) {
    tol = 1e-14;
  }
  x = parseFloat(x);
  df = parseFloat(df);
  ncp = parseFloat(ncp);
  if (df <= 0) {
    console.log("dnct: df must be positive");
    return null;
  }
  if (ncp === 0) {
    return dt(x, df);
  }
  if (x === 0) {
    return Math.exp(lgamma((df + 1) / 2) - ncp * ncp / 2 - 0.5 * Math.log(Math.PI * df) - lgamma(df / 2));
  }
  return df / x * (pnct(x * Math.sqrt(1 + 2 / df), df + 2, ncp, tol) - pnct(x, df, ncp, tol));
};
