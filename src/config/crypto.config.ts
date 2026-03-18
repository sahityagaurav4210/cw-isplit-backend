import bcrypt from 'bcrypt';

class CryptoManager {
  private pwSalt: number = 0;

  constructor() {
    this.pwSalt = parseInt(process.env.PWD_HASH_SALT || '10');
  }

  public getAppBcryptSalt() {
    return this.pwSalt;
  }

  public async hashPassword(password: string) {
    return await bcrypt.hash(password, this.pwSalt);
  }

  public async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}

export default CryptoManager;
