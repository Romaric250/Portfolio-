import { hashPassword } from "../src/lib/auth/password";

const password = process.argv[2];
if (!password) {
  console.error('Usage: pnpm admin:hash "<password>"');
  process.exit(1);
}

hashPassword(password).then((hash) => {
  console.log(hash);
});
