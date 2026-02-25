import { DataSource } from 'typeorm';
import { config } from './index';
import { User } from '../entities/User';
import { Task } from '../entities/Task';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false, // Используем миграции вместо автосинхронизации
  logging: config.server.nodeEnv === 'development',
  entities: [User, Task],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  subscribers: [],
});