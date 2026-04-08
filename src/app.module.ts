import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SessionModule } from './session/session.module';
import { Minister } from './users/minister.entity';

import mysqlConfig from './config/mysql.config';
import jwtConfig from './config/jwt.config';

import { User } from './users/user.entity';
import { Patient } from './users/patient.entity';
import { Doctor } from './users/doctor.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mysqlConfig, jwtConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('mysql.host');
        const port = config.get<number>('mysql.port');
        const username = config.get<string>('mysql.username');
        const password = config.get<string>('mysql.password');
        const database = config.get<string>('mysql.database');

        console.log('✅ MYSQL CONFIG DEBUG');
        console.log('HOST:', host);
        console.log('PORT:', port);
        console.log('USER:', username);
        console.log('DB:', database);

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [User, Patient, Doctor, Minister],
          synchronize: true,
          autoLoadEntities: true,
          retryAttempts: 5,
          retryDelay: 2000,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),

    AuthModule,
    UsersModule,
    SessionModule,
  ],
})
export class AppModule {}
