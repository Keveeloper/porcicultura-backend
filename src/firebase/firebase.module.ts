import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';

const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: (configService: ConfigService) => {
    const serviceAccountJson = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    if (!serviceAccountJson) {
      throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON no está definida.');
    }
    const serviceAccountConfig = JSON.parse(serviceAccountJson)  as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountConfig),
    });
    return admin;
  },
  inject: [ConfigService], // Asegurarse de inyectar el ConfigService
};

@Global()
@Module({
  // Importar ConfigModule aquí para que el servicio de configuración esté disponible
  imports: [ConfigModule],
  providers: [firebaseAdminProvider],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
