import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { config } from '../config';
import { logger } from '../utils/logger';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ user: User; token: string }> {
    try {
      // Проверка существования пользователя
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание пользователя
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      await this.userRepository.save(user);

      // Генерация токена
      const token = this.generateToken(user);

      logger.info(`User registered: ${email}`);

      return { user, token };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Поиск пользователя
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Генерация токена
      const token = this.generateToken(user);

      logger.info(`User logged in: ${email}`);

      return { user, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as SignOptions);
  }
}