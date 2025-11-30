let impl = null;

async function loadImpl() {
  if (impl) return impl;
  try {
    const m = await import('bcrypt');
    impl = m.default || m;
  } catch (e) {
    const m = await import('bcryptjs');
    impl = m.default || m;
  }
  return impl;
}

export async function hash(password, saltRounds) {
  const b = await loadImpl();
  // bcrypt.hash may return a promise (native) or accept a callback (bcryptjs)
  if (b.hash.length === 3) {
    return new Promise((resolve, reject) => {
      b.hash(password, saltRounds, (err, hashed) => {
        if (err) return reject(err);
        resolve(hashed);
      });
    });
  }
  return b.hash(password, saltRounds);
}

export async function compare(password, hashed) {
  const b = await loadImpl();
  if (b.compare.length === 3) {
    return new Promise((resolve, reject) => {
      b.compare(password, hashed, (err, ok) => {
        if (err) return reject(err);
        resolve(ok);
      });
    });
  }
  return b.compare(password, hashed);
}

export default { hash, compare };
